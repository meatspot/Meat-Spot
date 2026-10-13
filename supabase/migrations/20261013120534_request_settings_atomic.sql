begin;
create or replace function public.save_store_configuration(p_actor uuid,p_document jsonb,p_hours jsonb,p_closures jsonb) returns void language plpgsql security invoker set search_path='' as $$
begin
 perform public.save_settings(p_actor,p_document,p_hours,p_closures);
 perform public.save_geography(p_actor,(p_document->>'latitude')::numeric,(p_document->>'longitude')::numeric,p_document->>'map_place_id');
 if p_document ? 'requests_enabled' then
  if (p_document->>'requests_enabled')::boolean and exists(
   select 1 from unnest(array['privacy','terms']) k where not exists(
    select 1 from public.content_blocks c where c.key=k and c.published
     and private.valid_translations(c.translations) and not exists(
      select 1 from unnest(array['nl','ar','en','tr']) l
      where coalesce(length(trim(c.translations->l->>'description')),0)=0))) then
   raise exception 'LEGAL_CONTENT_REQUIRED';
  end if;
  update public.store_settings set requests_enabled=(p_document->>'requests_enabled')::boolean where id=true;
 end if;
end;$$;
revoke execute on function public.save_store_configuration(uuid,jsonb,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.save_store_configuration(uuid,jsonb,jsonb,jsonb) to service_role;
commit;
