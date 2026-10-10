begin;
alter table public.store_settings add column latitude numeric check(latitude between -90 and 90),add column longitude numeric check(longitude between -180 and 180),add column map_place_id text;
alter table public.store_settings add constraint coordinate_pair check((latitude is null)=(longitude is null));
create function public.save_geography(p_actor uuid,p_latitude numeric,p_longitude numeric,p_place text) returns void language plpgsql security invoker set search_path='' as $$
begin
 if not exists(select 1 from private.admin_members where user_id=p_actor and is_active) then raise exception 'FORBIDDEN';end if;
 update public.store_settings set latitude=p_latitude,longitude=p_longitude,map_place_id=nullif(trim(p_place),'') where id=true;
 insert into private.audit_logs(actor_id,action,entity_id) values(p_actor,'geography:save','store');
end;$$;
revoke execute on function public.save_geography(uuid,numeric,numeric,text) from public,anon,authenticated;
grant execute on function public.save_geography(uuid,numeric,numeric,text) to service_role;
create function public.save_store_configuration(p_actor uuid,p_document jsonb,p_hours jsonb,p_closures jsonb) returns void language plpgsql security invoker set search_path='' as $$
begin
 perform public.save_settings(p_actor,p_document,p_hours,p_closures);
 perform public.save_geography(p_actor,(p_document->>'latitude')::numeric,(p_document->>'longitude')::numeric,p_document->>'map_place_id');
end;$$;
revoke execute on function public.save_store_configuration(uuid,jsonb,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.save_store_configuration(uuid,jsonb,jsonb,jsonb) to service_role;
commit;
