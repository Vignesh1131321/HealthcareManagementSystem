// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   const isPublicPath =
//     path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/forgotpassword';
//   const token = request.cookies.get('next-auth.session-token')?.value || '';

//   // If the user is on a public path and has a token, redirect to the homepage
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/', request.nextUrl));
//   }

//   // If the user is not on a public path and doesn't have a token, redirect to login page
//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }

//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     '/',
//     '/profile',
//     '/login',
//     '/signup',
//     '/verifyemail',
//     '/forgotpassword',
//     '/appointment',
//     '/complete-profile',
//     '/doctor_side/doctor-profile',
//   ]
// }



// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define path patterns
  const isPublicPath = path === '/login' || 
                      path === '/signup' || 
                      path === '/verifyemail' || 
                      path === '/forgotpassword';
  
  const isDoctorPath = path.startsWith('/doctor_home');
  
  // Get the token and user role
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // If user is logged in and tries to access public paths
  if (isPublicPath && token) {
    // Redirect doctors to doctor dashboard, users to main dashboard
    if (token.role === 'doctor') {
      return NextResponse.redirect(new URL('/doctor_home', request.nextUrl));
    }
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // If no token and trying to access protected routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Prevent regular users from accessing doctor routes
  if (isDoctorPath && token?.role !== 'doctor') {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Prevent doctors from accessing user routes
  if (!isDoctorPath && !isPublicPath && token?.role === 'doctor') {
    return NextResponse.redirect(new URL('/doctor_home', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/forgotpassword',
    '/appointment',
    '/complete-profile',
    '/doctor_side/:path*'
  ]
}
