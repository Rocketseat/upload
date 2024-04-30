import { Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
}

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>> & {
  [key: `languages_${Locale}`]: string
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale as keyof typeof dictionaries]()
