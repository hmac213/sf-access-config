// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Check for your auth token, cookie, or session here
  const token = req.cookies.get('session-token');

  // debug code
  const res = await fetch(`${process.env.API_BASE_URL}/api/auth/status`, {
    credentials: 'include'
  });
  console.log(res);

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

// Apply middleware only to the /config route
export const config = {
  matcher: '/config'
};