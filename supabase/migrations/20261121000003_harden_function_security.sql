-- =============================================================================
-- Samudra :: 0003 :: function hardening
--
-- Fixes what the Supabase security linter flagged after 0001/0002:
--   0011 function_search_path_mutable
--   0028 anon_security_definer_function_executable
--   0029 authenticated_security_definer_function_executable
-- =============================================================================

-- ------------------------------------------------- 1. pin the search_path
-- An unpinned search_path lets a caller shadow the objects a function
-- resolves. Both of these only touch built-ins, so '' is enough.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.role_rank(r public.app_role)
returns int
language sql
immutable
set search_path = ''
as $$
  select case r
    when 'user'       then 0
    when 'editor'     then 10
    when 'admin'      then 20
    when 'superadmin' then 30
  end;
$$;

-- --------------------------------- 2. trigger functions are not API endpoints
-- PostgREST exposes every function in `public` as /rest/v1/rpc/<name>. These
-- two only make sense inside their triggers, so nobody should call them.
-- Postgres checks EXECUTE when the trigger is created, not when it fires, and
-- the owning roles keep the grant regardless.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.handle_user_email_change() from public, anon, authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'supabase_auth_admin') then
    grant execute on function public.handle_new_user() to supabase_auth_admin;
    grant execute on function public.handle_user_email_change() to supabase_auth_admin;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.handle_new_user() to service_role;
    grant execute on function public.handle_user_email_change() to service_role;
  end if;
end$$;

-- ------------------------------------- 3. role helpers: signed-in users only
-- RLS policy expressions run with the caller's privileges, so `authenticated`
-- must keep EXECUTE - every policy on profiles / audit_logs / settings calls
-- these. `anon` never evaluates them: the only anon-facing policy
-- ("settings: public read") tests the is_public column and nothing else.
revoke all on function public.current_app_role() from public, anon;
revoke all on function public.has_min_role(public.app_role) from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_superadmin() from public, anon;

grant execute on function public.current_app_role() to authenticated;
grant execute on function public.has_min_role(public.app_role) to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_superadmin() to authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.current_app_role() to service_role;
    grant execute on function public.has_min_role(public.app_role) to service_role;
    grant execute on function public.is_admin() to service_role;
    grant execute on function public.is_superadmin() to service_role;
  end if;
end$$;
