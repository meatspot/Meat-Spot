begin;
create schema if not exists private;
revoke all on schema private from public,anon;
grant usage on schema private to authenticated,service_role;

create table private.admin_members(user_id uuid primary key references auth.users(id),is_active boolean not null default true);
create table private.allowed_administrators(email text primary key);

create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from private.admin_members where user_id=auth.uid() and is_active);
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;
create function public.current_user_is_admin() returns boolean language sql stable security invoker set search_path='' as $$select private.is_admin();$$;
revoke all on function public.current_user_is_admin() from public;
grant execute on function public.current_user_is_admin() to authenticated;
create function private.bootstrap_admin() returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then return false; end if;
 if exists(select 1 from auth.users u join private.allowed_administrators a on lower(u.email)=lower(a.email) where u.id=auth.uid() and u.email_confirmed_at is not null and exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google')) then
 insert into private.admin_members(user_id) values(auth.uid()) on conflict do nothing;
 end if;
 return private.is_admin();
end;$$;
revoke all on function private.bootstrap_admin() from public;
grant execute on function private.bootstrap_admin() to authenticated;
create function public.bootstrap_admin() returns boolean language sql security invoker set search_path='' as $$select private.bootstrap_admin();$$;
revoke all on function public.bootstrap_admin() from public;
grant execute on function public.bootstrap_admin() to authenticated;

create table public.profiles(id uuid primary key references auth.users(id),display_name text not null default '',phone text,locale text not null default 'nl' check(locale in ('nl','ar','en','tr')));
alter table public.profiles enable row level security;
grant select,insert on public.profiles to authenticated;
grant update(display_name,phone,locale) on public.profiles to authenticated;
create policy profiles_read on public.profiles for select to authenticated using(id=(select auth.uid()));
create policy profiles_insert on public.profiles for insert to authenticated with check(id=(select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));

create function private.valid_translations(v jsonb) returns boolean language sql immutable set search_path='' as $$
select jsonb_typeof(v)='object' and not exists(select 1 from unnest(array['nl','ar','en','tr']) l where coalesce(length(trim(v->l->>'name')),0)=0);
$$;
revoke all on function private.valid_translations(jsonb) from public;
grant execute on function private.valid_translations(jsonb) to authenticated,service_role;

create table public.categories(id uuid primary key default gen_random_uuid(),parent_id uuid references public.categories(id),slug text unique not null check(slug~'^[a-z0-9]+(-[a-z0-9]+)*$'),published boolean not null default false,sort_order integer not null default 0,translations jsonb not null default '{}',check(parent_id is null or parent_id<>id),check(not published or private.valid_translations(translations)));
create index categories_parent_idx on public.categories(parent_id);
create table public.products(id uuid primary key default gen_random_uuid(),slug text unique not null check(slug~'^[a-z0-9]+(-[a-z0-9]+)*$'),category_id uuid not null references public.categories(id),status text not null default 'draft' check(status in ('draft','published','archived')),available boolean not null default false,unit_type text not null default 'kg' check(unit_type in ('kg','g','piece','package')),price_minor integer check(price_minor between 0 and 10000000),min_quantity_base integer not null default 100 check(min_quantity_base between 1 and 100000),step_quantity_base integer not null default 100 check(step_quantity_base between 1 and 100000),offer_price_minor integer check(offer_price_minor>=0),offer_until timestamptz,translations jsonb not null default '{}',images text[] not null default '{}',created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(status<>'published' or (price_minor is not null and private.valid_translations(translations))),check(offer_price_minor is null or (price_minor is not null and offer_price_minor<price_minor and offer_until is not null)));
create index products_category_idx on public.products(category_id);
create index products_public_idx on public.products(created_at desc) where status='published';
alter table public.categories enable row level security;
alter table public.products enable row level security;
grant select on public.categories,public.products to anon,authenticated;
create policy categories_read on public.categories for select to anon,authenticated using(published);
create policy products_read on public.products for select to anon,authenticated using(status='published' and exists(select 1 from public.categories c where c.id=category_id and c.published));

create table public.store_settings(id boolean primary key default true check(id),address text not null default 'Veenlustplein 11',postal_code text not null default '9641 MK',city text not null default 'Veendam',phone text not null default '+31 6 30538872',email text not null default 'help@bluesass.nl',timezone text not null default 'Europe/Amsterdam' check(timezone='Europe/Amsterdam'),lead_minutes integer check(lead_minutes between 0 and 10080),interval_minutes integer check(interval_minutes between 5 and 240),slot_capacity integer check(slot_capacity between 1 and 100),orders_enabled boolean not null default false);
insert into public.store_settings(id) values(true);
create table public.weekly_hours(day integer primary key check(day between 1 and 7),opens time not null default '10:00',closes time not null default '18:00',closed boolean not null default false,check(closes>opens));
insert into public.weekly_hours(day,closed) select n,n=7 from generate_series(1,7) n;
create table public.store_closures(date date primary key);
create table public.content_blocks(key text primary key check(key in ('home','about','privacy','terms')),translations jsonb not null default '{}',published boolean not null default false,check(not published or private.valid_translations(translations)));
create table public.pickup_slots(id uuid primary key default gen_random_uuid(),starts_at timestamptz unique not null,ends_at timestamptz not null,capacity integer not null check(capacity between 1 and 100),reserved_count integer not null default 0 check(reserved_count>=0 and reserved_count<=capacity),enabled boolean not null default true,check(ends_at>starts_at));
create index pickup_slots_start_idx on public.pickup_slots(starts_at);
alter table public.store_settings enable row level security;
alter table public.weekly_hours enable row level security;
alter table public.store_closures enable row level security;
alter table public.content_blocks enable row level security;
alter table public.pickup_slots enable row level security;
grant select on public.store_settings,public.weekly_hours,public.store_closures,public.content_blocks to anon,authenticated;
grant select on public.pickup_slots to authenticated;
create policy settings_read on public.store_settings for select to anon,authenticated using(true);
create policy hours_read on public.weekly_hours for select to anon,authenticated using(true);
create policy closures_read on public.store_closures for select to anon,authenticated using(true);
create policy content_read on public.content_blocks for select to anon,authenticated using(published);
create policy slots_read on public.pickup_slots for select to authenticated using(enabled);

create table public.orders(id uuid primary key default gen_random_uuid(),order_number bigint generated always as identity unique,customer_id uuid not null references auth.users(id),locale text not null check(locale in ('nl','ar','en','tr')),status text not null default 'submitted' check(status in ('submitted','confirmed','ready','completed','cancelled')),slot_id uuid not null references public.pickup_slots(id),estimated_total_minor integer not null check(estimated_total_minor>=0),final_total_minor integer check(final_total_minor>=0),currency text not null default 'EUR' check(currency='EUR'),contact_email text not null,contact_phone text not null,created_at timestamptz not null default now(),idempotency_key uuid not null,request_payload jsonb not null,unique(customer_id,idempotency_key));
create index orders_customer_created_idx on public.orders(customer_id,created_at desc);
create index orders_status_slot_idx on public.orders(status,slot_id);
create table public.order_items(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),product_id uuid references public.products(id),name_snapshot text not null,unit_type text not null check(unit_type in ('kg','g','piece','package')),unit_price_minor integer not null check(unit_price_minor>=0),quantity_base integer not null check(quantity_base>0),actual_quantity_base integer check(actual_quantity_base>0),line_total_minor integer not null check(line_total_minor>=0));
create index order_items_order_idx on public.order_items(order_id);
create index order_items_product_idx on public.order_items(product_id);
create table public.order_events(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),from_status text,to_status text not null,actor_id uuid references auth.users(id),created_at timestamptz not null default now());
create index order_events_order_idx on public.order_events(order_id);
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
grant select(id,order_number,customer_id,locale,status,slot_id,estimated_total_minor,final_total_minor,currency,contact_email,contact_phone,created_at) on public.orders to authenticated;
grant select on public.order_items,public.order_events to authenticated;
create policy orders_own on public.orders for select to authenticated using(customer_id=(select auth.uid()));
create policy items_own on public.order_items for select to authenticated using(exists(select 1 from public.orders where id=order_id and customer_id=(select auth.uid())));
create policy events_own on public.order_events for select to authenticated using(exists(select 1 from public.orders where id=order_id and customer_id=(select auth.uid())));

create table private.notification_outbox(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),event_type text not null default 'order_submitted',status text not null default 'pending' check(status in ('pending','processing','sent','failed')),attempts integer not null default 0,next_attempt timestamptz not null default now(),lease_until timestamptz,provider_id text,last_error text,unique(order_id,event_type));
create index notification_ready_idx on private.notification_outbox(next_attempt) where status in ('pending','processing');
create table private.audit_logs(id uuid primary key default gen_random_uuid(),actor_id uuid references auth.users(id),action text not null,entity_id text,created_at timestamptz not null default now());
create table private.api_rate_limits(bucket text primary key,window_start timestamptz not null,hits integer not null);
alter table private.admin_members enable row level security;
alter table private.allowed_administrators enable row level security;
alter table private.audit_logs enable row level security;
alter table private.notification_outbox enable row level security;
alter table private.api_rate_limits enable row level security;
grant all on all tables in schema public to service_role;
grant all on all tables in schema private to service_role;
grant usage,select on all sequences in schema public to service_role;

create function public.check_rate_limit(p_bucket text,p_limit integer,p_seconds integer) returns boolean language plpgsql security invoker set search_path='' as $$
declare r private.api_rate_limits;
begin
 insert into private.api_rate_limits values(p_bucket,clock_timestamp(),1) on conflict(bucket) do update set window_start=case when private.api_rate_limits.window_start<clock_timestamp()-make_interval(secs=>p_seconds) then clock_timestamp() else private.api_rate_limits.window_start end,hits=case when private.api_rate_limits.window_start<clock_timestamp()-make_interval(secs=>p_seconds) then 1 else private.api_rate_limits.hits+1 end returning * into r;
 return r.hits<=p_limit;
end;$$;

create function public.place_order(p_customer_id uuid,p_email text,p_locale text,p_phone text,p_slot_id uuid,p_key uuid,p_lines jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare cfg public.store_settings; sl public.pickup_slots; wh public.weekly_hours; p public.products; line jsonb; q integer; price integer; amount integer; total bigint:=0; oid uuid; existing public.orders; request jsonb; local_start timestamp; local_end timestamp; lines_saved jsonb:='[]';
begin
 if p_locale not in ('nl','ar','en','tr') or length(p_phone)>30 or length(p_phone)<7 or jsonb_typeof(p_lines)<>'array' or jsonb_array_length(p_lines) not between 1 and 40 then raise exception 'INVALID_INPUT'; end if;
 request=jsonb_build_object('locale',p_locale,'phone',p_phone,'slot',p_slot_id,'lines',p_lines);
 perform pg_advisory_xact_lock(hashtextextended(p_customer_id::text||p_key::text,0));
 select * into existing from public.orders where customer_id=p_customer_id and idempotency_key=p_key;
 if found then if existing.request_payload<>request then raise exception 'IDEMPOTENCY_CONFLICT'; end if; return existing.id; end if;
 select * into cfg from public.store_settings where id=true;
 if not cfg.orders_enabled or cfg.lead_minutes is null then raise exception 'ORDERS_DISABLED'; end if;
 if exists(select 1 from jsonb_array_elements(p_lines) l group by l->>'productId' having count(*)>1) then raise exception 'DUPLICATE_PRODUCT'; end if;
 for line in select value from jsonb_array_elements(p_lines) order by value->>'productId' loop
 select * into p from public.products where id=(line->>'productId')::uuid for share;
 q=(line->>'quantity')::integer;
 if not found or p.status<>'published' or not p.available or p.price_minor is null or not exists(select 1 from public.categories c where c.id=p.category_id and c.published) or q is null or q<p.min_quantity_base or q>100000 or (q-p.min_quantity_base)%p.step_quantity_base<>0 then raise exception 'PRODUCT_UNAVAILABLE'; end if;
 price=case when p.offer_price_minor is not null and p.offer_until>clock_timestamp() then p.offer_price_minor else p.price_minor end;
 if price<>coalesce((line->>'expectedPrice')::integer,-1) or p.unit_type<>coalesce(line->>'expectedUnit','') then raise exception 'PRICE_CHANGED'; end if;
 amount=round(price::numeric*q/case when p.unit_type='kg' then 1000 else 1 end)::integer;
 total=total+amount;
 lines_saved=lines_saved||jsonb_build_array(jsonb_build_object('id',p.id,'name',coalesce(p.translations->p_locale->>'name',p.translations->'nl'->>'name',p.slug),'unit',p.unit_type,'price',price,'quantity',q,'amount',amount));
 end loop;
 if total>100000000 then raise exception 'ORDER_TOO_LARGE'; end if;
 select * into sl from public.pickup_slots where id=p_slot_id for update;
 if not found or not sl.enabled or sl.reserved_count>=sl.capacity or sl.starts_at<clock_timestamp()+make_interval(mins=>cfg.lead_minutes) then raise exception 'SLOT_UNAVAILABLE'; end if;
 local_start=sl.starts_at at time zone cfg.timezone;local_end=sl.ends_at at time zone cfg.timezone;
 select * into wh from public.weekly_hours where day=extract(isodow from local_start)::integer;
 if not found or wh.closed or local_start::date<>local_end::date or local_start::time<wh.opens or local_end::time>wh.closes or exists(select 1 from public.store_closures where date=local_start::date) then raise exception 'SLOT_UNAVAILABLE'; end if;
 update public.pickup_slots set reserved_count=reserved_count+1 where id=sl.id;
 insert into public.orders(customer_id,locale,slot_id,estimated_total_minor,contact_email,contact_phone,idempotency_key,request_payload) values(p_customer_id,p_locale,p_slot_id,total::integer,p_email,p_phone,p_key,request) returning id into oid;
 for line in select value from jsonb_array_elements(lines_saved) loop
 insert into public.order_items(order_id,product_id,name_snapshot,unit_type,unit_price_minor,quantity_base,line_total_minor) values(oid,(line->>'id')::uuid,line->>'name',line->>'unit',(line->>'price')::integer,(line->>'quantity')::integer,(line->>'amount')::integer);
 end loop;
 insert into public.order_events(order_id,to_status,actor_id) values(oid,'submitted',p_customer_id);
 insert into private.notification_outbox(order_id) values(oid);
 return oid;
end;$$;

create function public.change_order(p_actor uuid,p_order uuid,p_status text,p_weights jsonb default '{}') returns void language plpgsql security invoker set search_path='' as $$
declare o public.orders;i public.order_items;q integer;amount integer;total bigint:=0;
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 select * into o from public.orders where id=p_order for update;
 if not found then raise exception 'NOT_FOUND';end if;
 if not ((o.status='submitted' and p_status in ('confirmed','cancelled')) or (o.status='confirmed' and p_status in ('ready','cancelled')) or (o.status='ready' and p_status in ('completed','cancelled'))) then raise exception 'INVALID_TRANSITION';end if;
 if p_status='ready' then
 for i in select * from public.order_items where order_id=o.id for update loop
 q=coalesce((p_weights->>i.id::text)::integer,i.quantity_base);
 if q not between 1 and 100000 then raise exception 'INVALID_WEIGHT';end if;
 if i.unit_type in ('piece','package') and q<>i.quantity_base then raise exception 'INVALID_QUANTITY';end if;
 amount=round(i.unit_price_minor::numeric*q/case when i.unit_type='kg' then 1000 else 1 end)::integer;
 update public.order_items set actual_quantity_base=q,line_total_minor=amount where id=i.id;total=total+amount;
 end loop;
 if total>100000000 then raise exception 'ORDER_TOO_LARGE';end if;
 update public.orders set final_total_minor=total::integer where id=o.id;
 end if;
 update public.orders set status=p_status where id=o.id;
 if p_status='cancelled' then update public.pickup_slots set reserved_count=reserved_count-1 where id=o.slot_id;end if;
 insert into public.order_events(order_id,from_status,to_status,actor_id) values(o.id,o.status,p_status,p_actor);
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'order:'||p_status,o.id::text);
end;$$;

create function public.save_product(p_actor uuid,p_document jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare pid uuid:=coalesce((p_document->>'id')::uuid,gen_random_uuid());
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 insert into public.products(id,slug,category_id,status,available,unit_type,price_minor,min_quantity_base,step_quantity_base,offer_price_minor,offer_until,translations)
 values(pid,p_document->>'slug',(p_document->>'category_id')::uuid,p_document->>'status',(p_document->>'available')::boolean,p_document->>'unit_type',(p_document->>'price_minor')::integer,(p_document->>'min_quantity_base')::integer,(p_document->>'step_quantity_base')::integer,(p_document->>'offer_price_minor')::integer,(p_document->>'offer_until')::timestamptz,p_document->'translations')
 on conflict(id) do update set slug=excluded.slug,category_id=excluded.category_id,status=excluded.status,available=excluded.available,unit_type=excluded.unit_type,price_minor=excluded.price_minor,min_quantity_base=excluded.min_quantity_base,step_quantity_base=excluded.step_quantity_base,offer_price_minor=excluded.offer_price_minor,offer_until=excluded.offer_until,translations=excluded.translations,updated_at=now();
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'product:save',pid::text);return pid;
end;$$;
create function public.save_category(p_actor uuid,p_document jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare cid uuid:=coalesce((p_document->>'id')::uuid,gen_random_uuid());parent uuid:=(p_document->>'parent_id')::uuid;
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 perform pg_advisory_xact_lock(hashtextextended('meat-spot-category-tree',0));
 if parent=cid or exists(with recursive ancestors as (select id,parent_id from public.categories where id=parent union select c.id,c.parent_id from public.categories c join ancestors a on c.id=a.parent_id) select 1 from ancestors where id=cid) then raise exception 'CATEGORY_CYCLE';end if;
 insert into public.categories(id,slug,parent_id,published,sort_order,translations) values(cid,p_document->>'slug',parent,(p_document->>'published')::boolean,(p_document->>'sort_order')::integer,p_document->'translations') on conflict(id) do update set slug=excluded.slug,parent_id=excluded.parent_id,published=excluded.published,sort_order=excluded.sort_order,translations=excluded.translations;
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'category:save',cid::text);return cid;
end;$$;

create function public.claim_notifications() returns setof private.notification_outbox language sql security invoker set search_path='' as $$
 update private.notification_outbox set status='processing',lease_until=clock_timestamp()+interval '5 minutes',attempts=attempts+1 where id in(select id from private.notification_outbox where (status='pending' and next_attempt<=clock_timestamp()) or (status='processing' and lease_until<clock_timestamp()) order by next_attempt for update skip locked limit 10) returning *;
$$;
create function public.finish_notification(p_id uuid,p_success boolean,p_provider text default null) returns void language plpgsql security invoker set search_path='' as $$
begin update private.notification_outbox set status=case when p_success then 'sent' when attempts>=8 then 'failed' else 'pending' end,provider_id=case when p_success then p_provider else provider_id end,last_error=case when p_success then null else 'DELIVERY_FAILED' end,next_attempt=clock_timestamp()+make_interval(secs=>least(3600,power(2,attempts)::integer*30)),lease_until=null where id=p_id;end;$$;

-- Trusted server operations are never callable by browser roles.
revoke execute on function public.check_rate_limit(text,integer,integer),public.place_order(uuid,text,text,text,uuid,uuid,jsonb),public.change_order(uuid,uuid,text,jsonb),public.save_product(uuid,jsonb),public.save_category(uuid,jsonb),public.claim_notifications(),public.finish_notification(uuid,boolean,text) from public,anon,authenticated;
grant execute on function public.check_rate_limit(text,integer,integer),public.place_order(uuid,text,text,text,uuid,uuid,jsonb),public.change_order(uuid,uuid,text,jsonb),public.save_product(uuid,jsonb),public.save_category(uuid,jsonb),public.claim_notifications(),public.finish_notification(uuid,boolean,text) to service_role;

-- Public image reads; only the trusted server writes sanitized images.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy published_image_read on storage.objects for select to anon,authenticated using(bucket_id='product-images');
commit;
