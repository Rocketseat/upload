import type { Config } from 'next-i18n-router/dist/types'

export const config: Config = {
  defaultLocale: 'en',
  locales: ['en', 'pt'],
  noPrefix: true,
} as const

export type Locale = (typeof config)['locales'][number]
