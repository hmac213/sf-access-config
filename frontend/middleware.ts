// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];
const PROTECTED_PATHS = ['/config']; // Add other protected paths here if needed

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Use the backend API endpoint to check the actual authentication status
  try {
    const authCheckUrl = `${process.env.API_BASE_URL}/api/auth/status`;
    if (!authCheckUrl) {
      console.error('Middleware Error: API_BASE_URL not defined.');
      // Redirect to login with error for safety on any path if config fails
      return NextResponse.redirect(new URL('/login?error=config_error', req.url)); 
    }

    const res = await fetch(authCheckUrl, {
        headers: {
          // Forward cookies from the incoming request to the backend check
          cookie: req.headers.get('cookie') ?? ''
        },
        credentials: 'include' // Although headers manually set, keep for clarity/fallback
    });

    const isAuthenticated = res.ok;

    if (isAuthenticated) {
      // If user is logged in and tries to access login/register, redirect to config
      if (PUBLIC_PATHS.includes(pathname)) {
        console.log(`Middleware: Authenticated user accessing ${pathname}, redirecting to /config.`);
        return NextResponse.redirect(new URL('/config', req.url));
      }
      // For any other path (including protected ones), let them proceed
      console.log(`Middleware: Authenticated user accessing ${pathname}, proceeding.`);
      return NextResponse.next(); 
    } else {
      // If user is not logged in and tries to access a protected path, redirect to login
      if (PROTECTED_PATHS.includes(pathname)) {
        console.log(`Middleware: Unauthenticated user accessing protected path ${pathname}, redirecting to /login.`);
        // Preserve the original URL (pathname + search params) as redirect_uri
        const originalUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(new URL(`/login?redirect_uri=${originalUrl}`, req.url)); 
      }
      // For any other path (including public ones), let them proceed
      console.log(`Middleware: Unauthenticated user accessing ${pathname}, proceeding.`);
      return NextResponse.next();
    }
  } catch (error) {
      console.error('Middleware: Error during authentication check:', error);
      // Handle fetch errors (e.g., backend down) - redirect to login for safety
      if (PROTECTED_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL('/login?error=server_error', req.url));
      }
      // Allow access to public pages even if auth check fails? Or redirect?
      // Let's be safe and redirect public pages too if the check itself errors.
      return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}

// Apply middleware to relevant routes
export const config = {
  matcher: [
    '/config', // Protected route
    '/login',  // Public route (needs check for logged-in user)
    '/register' // Public route (needs check for logged-in user)
    // Add other paths that need auth checks here
  ]
};