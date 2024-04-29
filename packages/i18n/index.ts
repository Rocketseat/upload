import { config, Locale } from './config'
import { Dictionary, getDictionary } from './get-dictionary'
import { getLocaleFromPath } from './get-locale'
import { getPreferredLocaleFromHeader } from './get-preferred-locale'
// import { useDictionary } from './use-dictionary'

export {
  // useDictionary,
  getDictionary,
  getLocaleFromPath,
  getPreferredLocaleFromHeader,
  config as i18n,
}

export type { Locale, Dictionary }
