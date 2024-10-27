// middleware.js
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth'; // or your authentication method

export function middleware(req : NextRequest) {
  const auth = getAuth();
  const user = auth.currentUser; // Get the current user

  // Set a custom header or cookie to identify authentication state
  const response = NextResponse.next();

  if (user) {
    response.headers.set('x-user-authenticated', 'true');
  } else {
    response.headers.set('x-user-authenticated', 'false');
  }

  return response;
}
