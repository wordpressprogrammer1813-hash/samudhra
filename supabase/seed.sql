-- =============================================================================
-- Samudra :: local seed (runs on `supabase db reset`)
-- =============================================================================
-- Promote the first signed-up account to superadmin. For a hosted project,
-- sign up normally and then run this once in the SQL editor with your email:
--
--   update public.profiles set role = 'superadmin' where email = 'you@example.com';
--
-- Locally, whichever account signed up first becomes superadmin:
update public.profiles p
   set role = 'superadmin'
 where p.id = (select id from public.profiles order by created_at asc limit 1)
   and not exists (select 1 from public.profiles where role = 'superadmin');
