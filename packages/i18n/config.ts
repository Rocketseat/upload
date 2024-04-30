import type { Config } from 'next-i18n-router/dist/types'

export const config: Config = {
  defaultLocale: 'en',
  // Check available options at: https://www.w3schools.com/tags/ref_language_codes.asp
  locales: ['en', 'pt'],
  noPrefix: true,
} as const

export type Locale = (typeof config)['locales'][number]
