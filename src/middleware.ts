import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   const isPublicPath = path==='/login'||path==='/signup'||path=== '/verifyemail'||path==='/forgotpassword'
//   const token = request.cookies.get('token')?.value || ''

//   if(isPublicPath && token) {
//     return NextResponse.redirect(new URL('/',request.nextUrl))
//   }
//   if(!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/login',request.nextUrl))
//   }
// }
// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/forgotpassword';
//   const token = request.cookies.get('next-auth.session-token')?.value || '';

//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/', request.nextUrl));
//   }
//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }
// }

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/forgotpassword';
  const token = request.cookies.get('next-auth.session-token')?.value || '';

  // If the user is on a public path and has a token, redirect to the homepage
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // If the user is not on a public path and doesn't have a token, redirect to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/forgotpassword',
  ]
}