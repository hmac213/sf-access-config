// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('running middleware');
  // Check for your auth token, cookie, or session here
  const token = req.cookies.get('session-token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

// Apply middleware only to the /config route
export const config = {
  matcher: '/config'
};