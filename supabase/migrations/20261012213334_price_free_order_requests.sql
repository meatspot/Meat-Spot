begin;
alter table public.products add column request_enabled boolean not null default false;
alter table public.products add column request_units text[] not null default array['kg']::text[] check(cardinality(request_units) between 1 and 2 and request_units <@ array['kg','piece']::text[]);
alter table public.store_settings add column requests_enabled boolean not null default false;
-- Internal prices stay editable, but are never readable by anonymous visitors.
grant select(id,slug,category_id,status,available,unit_type,min_quantity_base,step_quantity_base,translations,images,created_at,updated_at,request_enabled,request_units) on public.products to anon,authenticated;
create table private.order_requests(
 id uuid primary key default gen_random_uuid(),number bigint generated always as identity unique,
 customer_name text not null check(length(customer_name) between 2 and 100),
 phone text not null check(length(phone) between 7 and 30),locale text not null check(locale in ('nl','ar','en','tr')),
 status text not null default 'submitted' check(status in ('submitted','confirmed','ready','completed','cancelled')),
 requested_pickup_at timestamptz not null,approved_pickup_at timestamptz,
 notes text not null default '' check(length(notes)<=1000),items jsonb not null,
 idempotency_key uuid not null unique,request_payload jsonb not null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
alter table private.order_requests enable row level security;
create index order_requests_created_idx on private.order_requests(created_at desc);
create function private.pickup_request_valid(p_time timestamptz) returns boolean language sql stable set search_path='' as $$
select p_time>now() and p_time<=now()+interval '30 days'
 and exists(select 1 from public.weekly_hours h where h.day=extract(isodow from p_time at time zone 'Europe/Amsterdam')::int and not h.closed
 and (p_time at time zone 'Europe/Amsterdam')::time>=h.opens and (p_time at time zone 'Europe/Amsterdam')::time<h.closes)
 and not exists(select 1 from public.store_closures c where c.date=(p_time at time zone 'Europe/Amsterdam')::date);
$$;
revoke all on function private.pickup_request_valid(timestamptz) from public,anon,authenticated;
create function private.submit_order_request(p_document jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare existing private.order_requests; item jsonb; prod public.products; saved jsonb:='[]'; q integer; u text; result private.order_requests;
begin
 if not coalesce((select requests_enabled from public.store_settings where id),false) then raise exception 'REQUESTS_DISABLED';end if;
 if jsonb_typeof(p_document->'lines')<>'array' or jsonb_array_length(p_document->'lines') not between 1 and 40 then raise exception 'INVALID_LINES';end if;
 if (p_document->>'name') is null or length(trim(p_document->>'name')) not between 2 and 100 or (p_document->>'phone')!~'^[+0-9 ()-]{7,30}$' or p_document->>'locale' not in ('nl','ar','en','tr') or length(coalesce(p_document->>'notes',''))>1000 then raise exception 'INVALID_INPUT';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_document->>'idempotencyKey',0));
 select * into existing from private.order_requests where idempotency_key=(p_document->>'idempotencyKey')::uuid;
 if found then if existing.request_payload<>p_document then raise exception 'IDEMPOTENCY_CONFLICT';end if;return jsonb_build_object('number',existing.number);end if;
 if not private.pickup_request_valid((p_document->>'pickupAt')::timestamptz) then raise exception 'PICKUP_UNAVAILABLE';end if;
 if exists(select 1 from jsonb_array_elements(p_document->'lines') l group by l->>'productId',l->>'unit' having count(*)>1) then raise exception 'DUPLICATE_PRODUCT';end if;
 for item in select value from jsonb_array_elements(p_document->'lines') order by value->>'productId' loop
 select * into prod from public.products where id=(item->>'productId')::uuid for share;
 if not found or not prod.request_enabled or prod.status not in ('showcase','published') or not exists(select 1 from public.categories c where c.id=prod.category_id and c.published) then raise exception 'PRODUCT_UNAVAILABLE';end if;
 q=(item->>'quantity')::integer;u=item->>'unit';
 if q is null or u is null or not u=any(prod.request_units) or (u='kg' and (q<100 or q>100000 or q%100<>0)) or (u='piece' and (q<1 or q>100)) then raise exception 'INVALID_QUANTITY';end if;
 saved=saved||jsonb_build_array(jsonb_build_object('productId',prod.id,'name',coalesce(prod.translations->(p_document->>'locale')->>'name',prod.translations->'nl'->>'name',prod.slug),'unit',u,'quantity',q));
 end loop;
 insert into private.order_requests(customer_name,phone,locale,requested_pickup_at,notes,items,idempotency_key,request_payload)
 values(trim(p_document->>'name'),p_document->>'phone',p_document->>'locale',(p_document->>'pickupAt')::timestamptz,coalesce(p_document->>'notes',''),saved,(p_document->>'idempotencyKey')::uuid,p_document)
 returning * into result;
 return jsonb_build_object('number',result.number);
end;$$;
revoke all on function private.submit_order_request(jsonb) from public,anon,authenticated;
grant execute on function private.submit_order_request(jsonb) to service_role;
create function public.submit_order_request(p_document jsonb) returns jsonb language sql security invoker set search_path='' as $$select private.submit_order_request(p_document);$$;
revoke all on function public.submit_order_request(jsonb) from public,anon,authenticated;
grant execute on function public.submit_order_request(jsonb) to service_role;
create function private.admin_order_requests(p_page integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare rows jsonb;
begin
 if not private.is_admin() then raise exception 'FORBIDDEN';end if;
 select coalesce(jsonb_agg(to_jsonb(r)-'request_payload'-'idempotency_key'),'[]') into rows from
 (select * from private.order_requests order by created_at desc,id limit 50 offset greatest(0,least(p_page,100000)-1)*50) r;
 return jsonb_build_object('orders',rows,'count',(select count(*) from private.order_requests));
end;$$;
revoke all on function private.admin_order_requests(integer) from public,anon;
grant execute on function private.admin_order_requests(integer) to authenticated;
create function public.admin_order_requests(p_page integer default 1) returns jsonb language sql security invoker set search_path='' as $$select private.admin_order_requests(p_page);$$;
revoke all on function public.admin_order_requests(integer) from public,anon;
grant execute on function public.admin_order_requests(integer) to authenticated;
create function private.review_order_request(p_id uuid,p_status text,p_pickup timestamptz,p_notes text,p_items jsonb) returns void language plpgsql security definer set search_path='' as $$
declare old private.order_requests; line jsonb; current_line jsonb; q integer; u text; changed jsonb:='[]';
begin
 if not private.is_admin() then raise exception 'FORBIDDEN';end if;
 select * into old from private.order_requests where id=p_id for update;
 if not found or not ((old.status='submitted' and p_status in ('confirmed','cancelled')) or (old.status='confirmed' and p_status in ('ready','cancelled')) or (old.status='ready' and p_status in ('completed','cancelled'))) then raise exception 'INVALID_TRANSITION';end if;
 if p_status='confirmed' and (p_pickup is null or not private.pickup_request_valid(p_pickup)) then raise exception 'PICKUP_UNAVAILABLE';end if;
 if length(coalesce(p_notes,''))>1000 then raise exception 'INVALID_NOTES';end if;
 if p_items is not null then
 if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)<>jsonb_array_length(old.items) then raise exception 'INVALID_ITEMS';end if;
 for current_line in select value from jsonb_array_elements(old.items) loop
 select value into line from jsonb_array_elements(p_items) where value->>'productId'=current_line->>'productId' and value->>'unit'=current_line->>'unit';
 if not found then raise exception 'INVALID_ITEMS';end if;
 q=(line->>'quantity')::int;u=current_line->>'unit';
 if q is null or (u='kg' and (q<100 or q>100000 or q%100<>0)) or (u='piece' and (q<1 or q>100)) then raise exception 'INVALID_QUANTITY';end if;
 changed=changed||jsonb_build_array(current_line||jsonb_build_object('quantity',q));
 end loop;
 else changed=old.items;end if;
 update private.order_requests set status=p_status,approved_pickup_at=case when p_status='confirmed' then p_pickup else approved_pickup_at end,notes=coalesce(p_notes,notes),items=changed,updated_at=now() where id=p_id;
 insert into private.audit_logs(actor_id,action,entity_id) values(auth.uid(),'request:'||p_status,p_id::text);
end;$$;
revoke all on function private.review_order_request(uuid,text,timestamptz,text,jsonb) from public,anon;
grant execute on function private.review_order_request(uuid,text,timestamptz,text,jsonb) to authenticated;
create function public.review_order_request(p_id uuid,p_status text,p_pickup timestamptz default null,p_notes text default null,p_items jsonb default null) returns void language sql security invoker set search_path='' as $$select private.review_order_request(p_id,p_status,p_pickup,p_notes,p_items);$$;
revoke all on function public.review_order_request(uuid,text,timestamptz,text,jsonb) from public,anon;
grant execute on function public.review_order_request(uuid,text,timestamptz,text,jsonb) to authenticated;
alter table public.products drop constraint products_showcase_check;
alter table public.products add constraint products_showcase_check check(status<>'showcase' or private.valid_translations(translations));
alter table public.products drop constraint products_check;
alter table public.products add constraint products_check check(status<>'published' or private.valid_translations(translations));
create or replace function public.save_product(p_actor uuid,p_document jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare pid uuid:=coalesce((p_document->>'id')::uuid,gen_random_uuid());
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 insert into public.products(id,slug,category_id,status,available,unit_type,price_minor,min_quantity_base,step_quantity_base,offer_price_minor,offer_until,translations,request_enabled,request_units)
 values(pid,p_document->>'slug',(p_document->>'category_id')::uuid,p_document->>'status',(p_document->>'available')::boolean,p_document->>'unit_type',(p_document->>'price_minor')::integer,(p_document->>'min_quantity_base')::integer,(p_document->>'step_quantity_base')::integer,(p_document->>'offer_price_minor')::integer,(p_document->>'offer_until')::timestamptz,p_document->'translations',coalesce((p_document->>'request_enabled')::boolean,false),case when jsonb_typeof(p_document->'request_units')='array' then array(select jsonb_array_elements_text(p_document->'request_units')) else array['kg']::text[] end)
 on conflict(id) do update set slug=excluded.slug,category_id=excluded.category_id,status=excluded.status,available=excluded.available,unit_type=excluded.unit_type,price_minor=excluded.price_minor,min_quantity_base=excluded.min_quantity_base,step_quantity_base=excluded.step_quantity_base,offer_price_minor=excluded.offer_price_minor,offer_until=excluded.offer_until,translations=excluded.translations,request_enabled=excluded.request_enabled,request_units=excluded.request_units,updated_at=now();
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'product:save',pid::text);return pid;
end;$$;

commit;
