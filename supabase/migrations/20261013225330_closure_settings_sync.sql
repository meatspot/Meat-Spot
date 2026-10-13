begin;
CREATE OR REPLACE FUNCTION public.save_settings(p_actor uuid, p_document jsonb, p_hours jsonb, p_closures jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare h jsonb;
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 if (p_document->>'orders_enabled')::boolean and (exists(select 1 from unnest(array['privacy','terms']) k where not exists(select 1 from public.content_blocks c where c.key=k and c.published and private.valid_translations(c.translations) and not exists(select 1 from unnest(array['nl','ar','en','tr']) l where coalesce(length(trim(c.translations->l->>'description')),0)=0)))) then raise exception 'LEGAL_CONTENT_REQUIRED';end if;
 update public.store_settings set owner_name=p_document->>'owner_name',address=p_document->>'address',postal_code=p_document->>'postal_code',city=p_document->>'city',phone=p_document->>'phone',email=p_document->>'email',lead_minutes=(p_document->>'lead_minutes')::integer,interval_minutes=(p_document->>'interval_minutes')::integer,slot_capacity=(p_document->>'slot_capacity')::integer,orders_enabled=(p_document->>'orders_enabled')::boolean where id=true;
 for h in select value from jsonb_array_elements(p_hours) loop
 insert into public.weekly_hours(day,opens,closes,closed) values((h->>'day')::integer,(h->>'opens')::time,(h->>'closes')::time,(h->>'closed')::boolean) on conflict(day) do update set opens=excluded.opens,closes=excluded.closes,closed=excluded.closed;
 end loop;
 delete from public.store_closures where date not in (select value::date from jsonb_array_elements_text(p_closures) value);
 insert into public.store_closures(date) select value::date from jsonb_array_elements_text(p_closures) value on conflict(date) do nothing;
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'settings:save','store');
end;$function$;

commit;
