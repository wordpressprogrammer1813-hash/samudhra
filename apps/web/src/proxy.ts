import { NextResponse, type NextRequest } from 'next/server';
import { canAccessAdmin, isRole } from '@samudra/shared';
import { updateSession } from '@/lib/supabase/proxy';

/**
 * Next.js proxy (what used to be called middleware). Two jobs:
 *  1. keep the Supabase session fresh on every request;
 *  2. keep anonymous and under-privileged users out of /admin.
 *
 * This is a first gate, not the only one - every admin page and every API
 * route checks the role again on the server.
 */
export async function proxy(request: NextRequest) {
  const { user, supabase, response } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    const role = isRole(profile?.role) ? profile.role : null;

    if (profile?.status === 'suspended') {
      return NextResponse.redirect(new URL('/login?error=suspended', request.url));
    }
    if (!canAccessAdmin(role)) {
      return NextResponse.redirect(new URL('/?error=forbidden', request.url));
    }
  }

  // Already signed in? Skip the login screen.
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files, so the session is
     * refreshed on real navigations only.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)',
  ],
};
