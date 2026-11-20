import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client for server components, server actions and route handlers.
 * Reads and writes the auth cookies through Next's cookie store.
 *
 * In a plain server component writing cookies throws, which is expected -
 * the middleware refreshes the session instead, so we swallow it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a server component - middleware handles the refresh.
          }
        },
      },
    },
  );
}
