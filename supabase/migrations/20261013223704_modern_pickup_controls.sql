begin;
create or replace function private.pickup_request_valid(p_time timestamptz) returns boolean language sql stable set search_path='' as $$
 select p_time>now() and p_time>=now()+coalesce(s.lead_minutes,0)*interval '1 minute' and p_time<=now()+interval '30 days'
 and exists(select 1 from public.weekly_hours h where h.day=extract(isodow from p_time at time zone 'Europe/Amsterdam')::int and not h.closed
 and (p_time at time zone 'Europe/Amsterdam')::time>=h.opens and (p_time at time zone 'Europe/Amsterdam')::time<h.closes
 and mod(extract(epoch from ((p_time at time zone 'Europe/Amsterdam')::time-h.opens))::numeric,coalesce(s.interval_minutes,30)*60)=0)
 and not exists(select 1 from public.store_closures c where c.date=(p_time at time zone 'Europe/Amsterdam')::date)
 from public.store_settings s where s.id=true;
$$;
revoke all on function private.pickup_request_valid(timestamptz) from public,anon,authenticated;
commit;
