begin;
alter table public.store_settings add column owner_name text not null default 'Fuozi Abu Alfoz';
create or replace function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null
 and exists(select 1 from private.admin_members where user_id=auth.uid() and is_active)
 and exists(select 1 from auth.sessions where user_id=auth.uid() and id=(auth.jwt()->>'session_id')::uuid);
$$;
create function public.save_settings(p_actor uuid,p_document jsonb,p_hours jsonb,p_closures jsonb) returns void language plpgsql security invoker set search_path='' as $$
declare h jsonb;
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 if (p_document->>'orders_enabled')::boolean and (exists(select 1 from unnest(array['privacy','terms']) k where not exists(select 1 from public.content_blocks c where c.key=k and c.published and private.valid_translations(c.translations) and not exists(select 1 from unnest(array['nl','ar','en','tr']) l where coalesce(length(trim(c.translations->l->>'description')),0)=0)))) then raise exception 'LEGAL_CONTENT_REQUIRED';end if;
 update public.store_settings set owner_name=p_document->>'owner_name',address=p_document->>'address',postal_code=p_document->>'postal_code',city=p_document->>'city',phone=p_document->>'phone',email=p_document->>'email',lead_minutes=(p_document->>'lead_minutes')::integer,interval_minutes=(p_document->>'interval_minutes')::integer,slot_capacity=(p_document->>'slot_capacity')::integer,orders_enabled=(p_document->>'orders_enabled')::boolean where id=true;
 for h in select value from jsonb_array_elements(p_hours) loop
 insert into public.weekly_hours(day,opens,closes,closed) values((h->>'day')::integer,(h->>'opens')::time,(h->>'closes')::time,(h->>'closed')::boolean) on conflict(day) do update set opens=excluded.opens,closes=excluded.closes,closed=excluded.closed;
 end loop;
 delete from public.store_closures;
 insert into public.store_closures(date) select value::date from jsonb_array_elements_text(p_closures) value;
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'settings:save','store');
end;$$;
create function public.save_content(p_actor uuid,p_document jsonb) returns void language plpgsql security invoker set search_path='' as $$
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 insert into public.content_blocks(key,translations,published) values(p_document->>'key',p_document->'translations',(p_document->>'published')::boolean) on conflict(key) do update set translations=excluded.translations,published=excluded.published;
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'content:save',p_document->>'key');
end;$$;
create function public.attach_product_image(p_actor uuid,p_product uuid,p_url text) returns void language plpgsql security invoker set search_path='' as $$
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 update public.products set images=array_append(images,p_url),updated_at=now() where id=p_product and cardinality(images)<8;
 if not found then raise exception 'IMAGE_LIMIT';end if;
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'image:attach',p_product::text);
end;$$;
revoke execute on function public.save_settings(uuid,jsonb,jsonb,jsonb),public.save_content(uuid,jsonb),public.attach_product_image(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.save_settings(uuid,jsonb,jsonb,jsonb),public.save_content(uuid,jsonb),public.attach_product_image(uuid,uuid,text) to service_role;
create function public.configure_owner(p_email text) returns void language plpgsql security invoker set search_path='' as $$
begin
 if p_email is null or length(p_email)>254 or position('@' in p_email)=0 then raise exception 'INVALID_EMAIL';end if;
 insert into private.allowed_administrators(email) values(lower(trim(p_email))) on conflict do nothing;
end;$$;
revoke execute on function public.configure_owner(text) from public,anon,authenticated;
grant execute on function public.configure_owner(text) to service_role;
commit;
