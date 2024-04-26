import { db } from '@nivo/drizzle'
import { getLocaleFromPath, getPreferredLocaleFromHeader, i18n } from '@nivo/i18n'
import type { NextAuthConfig, Session } from 'next-auth'
import { GoogleProfile } from 'next-auth/providers/google'
import { i18nRouter } from 'next-i18n-router'

import { credentialsProvider } from './credentials-provider'
import { drizzleAuthAdapter } from './drizzle-auth-adapter'
import { googleProvider } from './google-provider'

const checkCurrentRoute = (pathname: string, locale?: string) => {
  const checkPathnameRegex = (pattern: string | RegExp) => {
    const rootRegex = new RegExp(pattern)
    return Boolean(pathname.match(rootRegex))
  }

  return {
    isOnWebhooks: checkPathnameRegex(`^/(${locale})?/webhooks.*`),
    isOnPublicAPIRoutes: checkPathnameRegex(`^/(${locale})?/api/auth.*`),
    isOnAPIRoutes: checkPathnameRegex(`^/(${locale})?/api.*`),
    isOnPrivatePages:
      checkPathnameRegex(`^/(${locale})?/app.*`) ||
      checkPathnameRegex(`^/app.*`),
  }
}

export const authConfig = {
  adapter: drizzleAuthAdapter,
  providers: [googleProvider, credentialsProvider],
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        const googleProfile = profile as GoogleProfile
        const [, emailDomain] = googleProfile.email.split('@')

        if (!emailDomain) {
          return false
        }

        const company = await db.query.company.findFirst({
          where(fields, { eq }) {
            return eq(fields.domain, emailDomain)
          },
        })

        return googleProfile.email_verified && !!company
      } else if (account?.provider === 'credentials') {
        return true
      }

      return false
    },
    jwt({ token, user, session, trigger }) {
      if (user) {
        token.companyId = user.companyId
      }

      function isSessionAvailable(session: unknown): session is Session {
        return !!session
      }

      if (trigger === 'update' && isSessionAvailable(session)) {
        token.name = session.user.name
      }

      return token
    },
    session({ session, ...params }) {
      if ('token' in params && session.user) {
        session.user.companyId = params.token.companyId
        session.user.id = params.token.sub!
      }

      return session
    },
    authorized({ auth, request }) {
      const { nextUrl, headers } = request
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
      const urlLocale = getLocaleFromPath(nextUrl.pathname);
      const browserLocale = getPreferredLocaleFromHeader(headers);
      const locale = cookieLocale || urlLocale.locale || browserLocale || i18n.defaultLocale;

      const isLoggedIn = !!auth?.user

      const {
        isOnWebhooks,
        isOnPublicAPIRoutes,
        isOnAPIRoutes,
        isOnPrivatePages,
      } = checkCurrentRoute(nextUrl.pathname, locale)

      if (isOnWebhooks || isOnPublicAPIRoutes) {
        return true
      }

      if (!isOnPrivatePages && !isOnAPIRoutes && isLoggedIn) {
        const prefixLocale = locale ? `/${locale}` : ''
        return Response.redirect(new URL(`${prefixLocale}/app`, nextUrl))
      }

      if (isOnAPIRoutes && !isLoggedIn) {
        return Response.json({ message: 'Unauthorized.' }, { status: 401 })
      }

      if (isOnPrivatePages && !isLoggedIn) {
        return false
      }

      return i18nRouter(request, {
        ...i18n,
        prefixDefault: true
      })
    },
  },
} satisfies NextAuthConfig
