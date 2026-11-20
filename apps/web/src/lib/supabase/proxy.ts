import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Used by src/proxy.ts. Refreshes the Supabase session on every matched
 * request and hands back both the user and the response carrying the updated
 * auth cookies.
 *
 * Important: always return *this* response object (or copy its cookies onto
 * your own), otherwise the refreshed tokens never reach the browser.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Do not remove: this call is what actually refreshes an expired token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, supabase, response };
}
