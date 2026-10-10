begin;
create index audit_logs_actor_idx on private.audit_logs(actor_id);
create index order_events_actor_idx on public.order_events(actor_id);
create index orders_slot_idx on public.orders(slot_id);
commit;
