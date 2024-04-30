import { i18nRouter } from 'next-i18n-router'

import { config, Locale } from './config'
import { Dictionary, getDictionary } from './get-dictionary'

export {
  getDictionary,
  config as i18n,
  i18nRouter,
}

export type { Locale, Dictionary }
