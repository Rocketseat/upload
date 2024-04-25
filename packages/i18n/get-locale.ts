import { i18n } from '.'
import { Locale, config } from './config'

function parseAcceptLanguageHeader(header: string | null): Locale[] {
  if (!header) {
    return [config.defaultLocale]
  }

  return header.split(',').map((lang) => lang.split(';')[0].trim()) as Locale[]
}

function findBestMatchingLocale(requestedLocales: string[]): string {
  const mutableLocales = config.locales as unknown as string
  return (
    requestedLocales.find((locale) => mutableLocales.includes(locale)) ||
    config.defaultLocale
  );
}


export function getLocaleFromPathOrHeaders(pathname: string, headers: Headers) {
  const acceptLanguageHeader = headers.get('accept-language')
  const requestedLocales = parseAcceptLanguageHeader(acceptLanguageHeader)
  const bestLocale = findBestMatchingLocale(requestedLocales)
  const localeFromPathRegex = new RegExp(`^/(${i18n.locales.join('|')})?`)
  const localeFromPath = pathname.match(localeFromPathRegex)?.[1] || bestLocale
  return { locale: localeFromPath }
}
