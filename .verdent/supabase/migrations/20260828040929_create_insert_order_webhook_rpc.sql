create or replace function public.insert_order_webhook(p_order jsonb, p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.orders (
    corvex_order_id, lead_id, event, status,
    customer_name, customer_email, customer_phone,
    total_cents, currency, payload
  ) values (
    coalesce(p_order->>'corvex_order_id', 'sem-id'),
    nullif(p_order->>'lead_id', ''),
    p_order->>'event',
    coalesce(p_order->>'status', 'unknown'),
    nullif(p_order->>'customer_name', ''),
    nullif(p_order->>'customer_email', ''),
    nullif(p_order->>'customer_phone', ''),
    coalesce((p_order->>'total_cents')::int, 0),
    coalesce(nullif(p_order->>'currency', ''), 'BRL'),
    coalesce(p_order->'payload', '{}'::jsonb)
  )
  on conflict do nothing
  returning id into v_id;

  if v_id is null then
    return null; -- evento duplicado (unique index event+order+lead)
  end if;

  insert into public.order_items (order_id, product_id, title, quantity, unit_price_cents)
  select
    v_id,
    nullif(it->>'product_id', ''),
    coalesce(nullif(it->>'title', ''), 'Item'),
    coalesce((it->>'quantity')::int, 1),
    coalesce((it->>'unit_price_cents')::int, 0)
  from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) as it;

  return v_id;
end;
$$;

revoke all on function public.insert_order_webhook(jsonb, jsonb) from public;
grant execute on function public.insert_order_webhook(jsonb, jsonb) to anon;