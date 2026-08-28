create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  corvex_order_id text not null,
  lead_id text,
  event text not null,
  status text not null default 'unknown',
  customer_name text,
  customer_email text,
  customer_phone text,
  total_cents integer not null default 0,
  currency text not null default 'BRL',
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now()
);

create unique index if not exists orders_event_order_lead_uidx
  on public.orders (event, corvex_order_id, (coalesce(lead_id, '')));

create index if not exists orders_corvex_order_id_idx on public.orders (corvex_order_id);
create index if not exists orders_received_at_idx on public.orders (received_at desc);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  title text not null,
  quantity integer not null default 1,
  unit_price_cents integer not null default 0
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists orders_insert_anon on public.orders;
create policy orders_insert_anon on public.orders for insert to anon with check (true);

drop policy if exists order_items_insert_anon on public.order_items;
create policy order_items_insert_anon on public.order_items for insert to anon with check (true);