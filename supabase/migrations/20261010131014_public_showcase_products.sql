begin;
alter table public.products drop constraint products_status_check;
alter table public.products add constraint products_status_check check(status in ('draft','showcase','published','archived'));
alter table public.products add constraint products_showcase_check check(status<>'showcase' or (available=false and price_minor is null and private.valid_translations(translations)));
drop policy products_read on public.products;
create policy products_read on public.products for select to anon,authenticated using(status in ('published','showcase') and exists(select 1 from public.categories c where c.id=category_id and c.published));
commit;
