import { Locale } from './config'

export interface Dictionary {
  languages: {
    en: string;
    pt: string;
  }
  dashboard: {
    heading: string;
  }
}

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.en()
