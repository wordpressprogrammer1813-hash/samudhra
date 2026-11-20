-- =============================================================================
-- Samudra :: 0001 :: roles + profiles
-- Creates the app role enum, a profiles table mirroring auth.users, the
-- SECURITY DEFINER helpers used by every policy, and RLS on profiles.
-- =============================================================================

-- ---------------------------------------------------------------- extensions
create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------- enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('user', 'editor', 'admin', 'superadmin');
  end if;
  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type public.user_status as enum ('active', 'invited', 'suspended');
  end if;
end$$;

-- ------------------------------------------------------------------ profiles
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text               not null,
  full_name    text,
  phone        text,
  avatar_url   text,
  role         public.app_role    not null default 'user',
  status       public.user_status not null default 'active',
  last_seen_at timestamptz,
  created_at   timestamptz        not null default now(),
  updated_at   timestamptz        not null default now(),
  constraint profiles_email_key unique (email)
);

comment on table public.profiles is 'Application profile + role for each auth.users row.';

create index if not exists profiles_role_idx       on public.profiles (role);
create index if not exists profiles_status_idx     on public.profiles (status);
create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

-- ------------------------------------------------------------- updated_at fn
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ------------------------------------------------- auth.users -> profiles sync
-- Runs as the definer so it can write to public.profiles regardless of RLS.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update
    set email      = excluded.email,
        full_name  = coalesce(public.profiles.full_name, excluded.full_name),
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep the email column in step when the user changes it in auth.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = coalesce(new.email, '') where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- ------------------------------------------------------------- role helpers
-- SECURITY DEFINER so policies on profiles can read profiles without
-- recursing through their own RLS checks.
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.role_rank(r public.app_role)
returns int
language sql
immutable
as $$
  select case r
    when 'user'       then 0
    when 'editor'     then 10
    when 'admin'      then 20
    when 'superadmin' then 30
  end;
$$;

create or replace function public.has_min_role(minimum public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.role_rank(public.current_app_role()) >= public.role_rank(minimum), false);
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() = 'superadmin';
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_min_role('admin');
$$;

-- --------------------------------------------------------------------- RLS
alter table public.profiles enable row level security;

drop policy if exists "profiles: read own"           on public.profiles;
drop policy if exists "profiles: admins read all"    on public.profiles;
drop policy if exists "profiles: update own"         on public.profiles;
drop policy if exists "profiles: superadmin writes"  on public.profiles;
drop policy if exists "profiles: superadmin deletes" on public.profiles;

-- Everyone may read their own profile.
create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Admin and above may read every profile.
create policy "profiles: admins read all"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- A user may edit their own profile but NOT their own role or status.
create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role   = (select p.role   from public.profiles p where p.id = auth.uid())
    and status = (select p.status from public.profiles p where p.id = auth.uid())
  );

-- Only a superadmin may change roles / statuses.
create policy "profiles: superadmin writes"
  on public.profiles for update
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "profiles: superadmin deletes"
  on public.profiles for delete
  to authenticated
  using (public.is_superadmin());

-- Inserts only happen through the auth trigger or the service role.
revoke all on public.profiles from anon;
grant select, update on public.profiles to authenticated;
