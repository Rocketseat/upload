import { config, Locale } from './config'
import { Dictionary, getDictionary } from './get-dictionary'
import { getLocaleFromPath } from './get-locale'

export {
  getDictionary,
  getLocaleFromPath,
  config as i18n,
}

export type { Locale, Dictionary }
