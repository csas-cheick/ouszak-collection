create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_store_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_user_id = auth.uid()
    and exists (
      select 1
      from public.admin_users
      where user_id = p_user_id
    );
$$;

revoke all on function public.is_store_admin(uuid) from public;
grant execute on function public.is_store_admin(uuid) to authenticated;

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12, 0) not null check (amount > 0),
  payment_method text not null check (payment_method in ('cash', 'mobile_money', 'card', 'other')),
  note text,
  sold_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12, 0) not null check (amount > 0),
  description text not null check (length(trim(description)) > 0),
  spent_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id)
);

create table if not exists public.cash_sessions (
  id uuid primary key default gen_random_uuid(),
  opening_balance numeric(12, 0) not null check (opening_balance >= 0),
  closing_balance numeric(12, 0) check (closing_balance >= 0),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_by uuid not null references auth.users (id),
  check ((closed_at is null and closing_balance is null) or (closed_at is not null and closing_balance is not null))
);

create index if not exists sales_sold_at_idx on public.sales (sold_at desc);
create index if not exists expenses_spent_at_idx on public.expenses (spent_at desc);
create index if not exists cash_sessions_opened_at_idx on public.cash_sessions (opened_at desc);

create unique index if not exists one_open_cash_session
  on public.cash_sessions ((closed_at is null))
  where closed_at is null;

alter table public.admin_users enable row level security;
alter table public.sales enable row level security;
alter table public.expenses enable row level security;
alter table public.cash_sessions enable row level security;

drop policy if exists "Admins can view their own admin role" on public.admin_users;
create policy "Admins can view their own admin role"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Admins can read sales" on public.sales;
create policy "Admins can read sales"
  on public.sales for select
  to authenticated
  using (public.is_store_admin(auth.uid()));

drop policy if exists "Admins can record sales" on public.sales;
create policy "Admins can record sales"
  on public.sales for insert
  to authenticated
  with check (public.is_store_admin(auth.uid()) and created_by = auth.uid());

drop policy if exists "Admins can read expenses" on public.expenses;
create policy "Admins can read expenses"
  on public.expenses for select
  to authenticated
  using (public.is_store_admin(auth.uid()));

drop policy if exists "Admins can record expenses" on public.expenses;
create policy "Admins can record expenses"
  on public.expenses for insert
  to authenticated
  with check (public.is_store_admin(auth.uid()) and created_by = auth.uid());

drop policy if exists "Admins can read cash sessions" on public.cash_sessions;
create policy "Admins can read cash sessions"
  on public.cash_sessions for select
  to authenticated
  using (public.is_store_admin(auth.uid()));

drop policy if exists "Admins can open cash sessions" on public.cash_sessions;
create policy "Admins can open cash sessions"
  on public.cash_sessions for insert
  to authenticated
  with check (public.is_store_admin(auth.uid()) and created_by = auth.uid());

drop policy if exists "Admins can close open cash sessions" on public.cash_sessions;
create policy "Admins can close open cash sessions"
  on public.cash_sessions for update
  to authenticated
  using (public.is_store_admin(auth.uid()) and closed_at is null)
  with check (public.is_store_admin(auth.uid()) and closed_at is not null);

grant select on public.admin_users to authenticated;
grant select, insert on public.sales to authenticated;
grant select, insert on public.expenses to authenticated;
grant select, insert, update on public.cash_sessions to authenticated;
