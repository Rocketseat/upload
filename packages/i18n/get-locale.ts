import { i18n } from '.'

export function getLocaleFromPath(pathname: string) {
  const localeFromPathRegex = new RegExp(`^/(${i18n.locales.join('|')})?`)
  const locale = pathname.match(localeFromPathRegex)?.[1]
  return { locale }
}
