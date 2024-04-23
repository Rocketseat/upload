import { auth } from '@nivo/auth'
import { NextRequest, NextResponse } from 'next/server'

import { getLocale, SUPPORTED_LOCALES } from './utils/get-locale'

export async function middleware(
  request: NextRequest,
): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl

  const session = await auth()

  if (!session || !session.user) {
    const signInUrl = new URL('/auth/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }

  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return

  const preferredLocale = getLocale(request)

  request.nextUrl.pathname = `/${preferredLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)'],
}
