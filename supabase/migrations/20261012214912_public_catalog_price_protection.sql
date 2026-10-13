begin;
revoke select on public.products from anon,authenticated;
grant select(id,slug,category_id,status,available,unit_type,min_quantity_base,step_quantity_base,translations,images,created_at,updated_at,request_enabled,request_units) on public.products to anon,authenticated;
commit;