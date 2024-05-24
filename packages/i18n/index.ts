import { i18nRouter } from 'next-i18n-router'

import { config, Locale } from './config'
import { Dictionary, getDictionaryByLocale } from './get-dictionary-by-locale'

export {
  getDictionaryByLocale,
  config as i18n,
  i18nRouter
}

export type { Locale, Dictionary }
