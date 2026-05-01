import { NextRequest, NextResponse } from 'next/server'
import { decrypt, encrypt } from '@/lib/session'

export default async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value
  if (!sessionCookie) return NextResponse.next()

  const payload = await decrypt(sessionCookie)
  if (!payload) return NextResponse.next()

  // Re-issue the cookie with a fresh expiry on every request
  const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const newToken = await encrypt({ ...payload, expiresAt: newExpiry })

  const response = NextResponse.next()
  response.cookies.set('session', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: newExpiry,
    path: '/dashboard',
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\.png$).*)'],
}