import './globals.css'

import { env } from '@nivo/env'
import { i18n, Locale } from '@nivo/i18n'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'

import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_VERCEL_URL),
  title: {
    template: '%s | Nivo',
    absolute: 'Nivo',
  },
  description: 'The all-in-one video solution for online learning.',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <html
      lang={params.lang}
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>
          {children}

          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
