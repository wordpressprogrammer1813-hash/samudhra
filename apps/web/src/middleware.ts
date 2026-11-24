import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const secret = process.env.SESSION_SECRET;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  // Fails closed: no secret configured means no one gets in, not everyone.
  if (!secret || !verifySessionToken(token, secret)) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
  // Force the Node.js runtime so node:crypto (used by verifySessionToken)
  // behaves exactly as it does in the server actions, not an Edge polyfill.
  runtime: 'nodejs',
};
