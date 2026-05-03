import { NextRequest, NextResponse } from 'next/server'
import { decrypt, encrypt } from '@/lib/session/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) return NextResponse.next();

  const sessionCookie = request.cookies.get('session')?.value

  const isPublicRoute = ['/login', '/signup', '/forgot-password', '/'].includes(pathname)
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/inventory') || pathname.startsWith('/pos')

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicRoute && sessionCookie) {
    if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (!sessionCookie) return NextResponse.next()

  // 3. Session Decryption and Renewal
  const payload = await decrypt(sessionCookie)
  if (!payload) {
    const response = NextResponse.next()
    response.cookies.delete('session')
    return response
  }

  // Re-issue the cookie with a fresh expiry on every request to keep session alive
  const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const newToken = await encrypt({ ...payload, expiresAt: newExpiry })

  const response = NextResponse.next()
  response.cookies.set('session', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: newExpiry,
    path: '/', // Ensure path is root for global availability
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
