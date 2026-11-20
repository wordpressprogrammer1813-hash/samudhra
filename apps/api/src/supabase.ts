import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Service-role client. Bypasses RLS entirely, so it must never be reachable
 * from the browser and every route that uses it has to do its own role check
 * (see `requireRole` in ./middleware/auth.ts).
 */
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { 'X-Client-Info': 'samudra-api' } },
  },
);

/**
 * A client that acts *as the calling user*, so Postgres RLS still applies.
 * Prefer this for anything that does not genuinely need admin powers.
 */
export function supabaseAsUser(accessToken: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
