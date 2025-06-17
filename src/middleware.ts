import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/sign-in',
  '/admin-sign-in',
  '/onboarding',
  '/onboarding/completed',
  '/onboarding/personal-information',
  '/onboarding/financial-information',
  '/onboard-staff', // keep this to allow onboarding redirect
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tr-token')?.value;
  const adminToken = request.cookies.get('tr-admin_token')?.value;

  // Allow public paths
  const isPublicPath = PUBLIC_PATHS.some((publicPath) =>
    pathname.startsWith(publicPath)
  );

  // Handle /onboard-staff/ redirects
  if (pathname.startsWith('/onboard-staff/')) {
    const onboardToken = pathname.split('/')[2];
    return NextResponse.redirect(
      new URL(`/onboarding?token=${onboardToken}`, request.url)
    );
  }

  // Redirect unauthenticated users trying to access private routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect if admin hasn't authenticated yet.
  if (pathname.startsWith('/sign-in') && !adminToken) {
    return NextResponse.redirect(new URL('/admin-sign-in', request.url));
  }

  // Redirect if admin has authenticated but trying to access admin sign-in page.
  if (pathname.startsWith('/admin-sign-in') && adminToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'], // Match all except static assets
};
