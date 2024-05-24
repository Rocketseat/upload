'use client'

import { Locale } from '@nivo/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider, useAtom, useSetAtom } from 'jotai'
import { ThemeProvider } from 'next-themes'
import { ReactNode, useState } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import { trpcLinks } from '@/lib/trpc/client'
import { trpc, TRPCProvider } from '@/lib/trpc/react'
import { dictionaryAtom, localeAtom } from '@/state/dictionary'

export function DictionaryProvider({
  children,
  locale,
}: {
  children: ReactNode
  locale: Locale
}) {
  const setLocale = useSetAtom(localeAtom)
  setLocale(locale)
  useAtom(dictionaryAtom)

  return <>{children}</>
}

export function Providers({
  children,
  locale,
}: {
  children: ReactNode
  locale: Locale
}) {
  const [queryClient] = useState(() => {
    return new QueryClient()
  })

  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: trpcLinks,
    })
  })

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCProvider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <DictionaryProvider locale={locale}>
              <TooltipProvider>{children}</TooltipProvider>
            </DictionaryProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </TRPCProvider>
    </ThemeProvider>
  )
}
