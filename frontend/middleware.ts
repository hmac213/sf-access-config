// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Use the backend API endpoint to check the actual authentication status
  try {
    const authCheckUrl = `${process.env.API_BASE_URL}/api/auth/status`;
    if (!authCheckUrl) {
      console.error('API_BASE_URL is not defined in environment variables.');
      // Decide how to handle this - perhaps deny access?
      return NextResponse.redirect(new URL('/login?error=config_error', req.url)); 
    }

    const res = await fetch(authCheckUrl, {
        headers: {
          // Forward cookies from the incoming request to the backend check
          cookie: req.headers.get('cookie') ?? ''
        },
        credentials: 'include' // Although headers manually set, keep for clarity/fallback
    });

    // Check if the backend confirmed authentication (status 200)
    if (res.ok) {
        // You could optionally check the JSON body too: const data = await res.json(); if (data.authenticated)
        console.log('Middleware: User authenticated via API check.');
        return NextResponse.next(); // User is authenticated, proceed
    } else {
        console.log(`Middleware: Authentication check failed with status: ${res.status}`);
        return NextResponse.redirect(new URL('/login', req.url)); // Backend says not authenticated
    }
  } catch (error) {
      console.error('Middleware: Error during authentication check:', error);
      // Handle fetch errors (e.g., backend down)
      return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}

// Apply middleware only to the /config route
export const config = {
  matcher: '/config'
};