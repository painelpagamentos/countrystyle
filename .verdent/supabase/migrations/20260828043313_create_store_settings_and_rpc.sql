create table if not exists public.store_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;

create or replace function public.get_store_settings(p_gate text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_gate is null or p_gate <> 'yunabella-liga-config-2026' then
    return null;
  end if;
  return (select coalesce(jsonb_object_agg(s.key, s.value), '{}'::jsonb) from public.store_settings s);
end;
$$;

revoke all on function public.get_store_settings(text) from public;
grant execute on function public.get_store_settings(text) to anon;