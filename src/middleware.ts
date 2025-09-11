import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const session = await auth()
    
    // If no session, redirect to login
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // If not admin, redirect to unauthorized
    if (!session.user?.isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // If user is inactive, redirect to login
    if (!session.user?.isActive) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'Account is inactive')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === '/login') {
    const session = await auth()
    if (session?.user?.isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
