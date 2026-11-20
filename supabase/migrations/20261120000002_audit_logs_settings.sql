-- =============================================================================
-- Samudra :: 0002 :: audit log + site settings
-- =============================================================================

-- ----------------------------------------------------------------- audit log
create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users (id) on delete set null,
  actor_email text,
  action      text not null,
  entity      text,
  entity_id   text,
  meta        jsonb,
  ip          text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

comment on table public.audit_logs is 'Append-only trail of privileged actions.';

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_actor_idx      on public.audit_logs (actor_id);
create index if not exists audit_logs_action_idx     on public.audit_logs (action);
create index if not exists audit_logs_entity_idx     on public.audit_logs (entity, entity_id);

alter table public.audit_logs enable row level security;

drop policy if exists "audit: admins read" on public.audit_logs;

-- Readable by admin and above; written only by the service role (the API).
create policy "audit: admins read"
  on public.audit_logs for select
  to authenticated
  using (public.is_admin());

revoke all on public.audit_logs from anon;
grant select on public.audit_logs to authenticated;

-- ------------------------------------------------------------------ settings
create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  is_public  boolean not null default false,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

comment on table public.settings is 'Key/value site configuration edited from the superadmin panel.';

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

alter table public.settings enable row level security;

drop policy if exists "settings: public read"      on public.settings;
drop policy if exists "settings: admins read all"  on public.settings;
drop policy if exists "settings: superadmin write" on public.settings;

-- Rows flagged public are readable by anyone (site name, contact info, ...).
create policy "settings: public read"
  on public.settings for select
  to anon, authenticated
  using (is_public);

create policy "settings: admins read all"
  on public.settings for select
  to authenticated
  using (public.is_admin());

create policy "settings: superadmin write"
  on public.settings for all
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

grant select on public.settings to anon, authenticated;

-- ------------------------------------------------------------ default values
insert into public.settings (key, value, is_public) values
  ('site',        '{"name":"Samudhra","tagline":"Tradition, reinterpreted.","logoUrl":null}'::jsonb, true),
  ('contact',     '{"email":"","phone":"","address":""}'::jsonb,           true),
  ('maintenance', '{"enabled":false,"message":""}'::jsonb,                 true),
  ('features',    '{"signupEnabled":true}'::jsonb,                         false)
on conflict (key) do nothing;
