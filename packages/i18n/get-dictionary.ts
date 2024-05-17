import { Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
}

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>> & {
  [key: string]: string
  [key: `languages_${Locale}`]: string
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const dictionary = await dictionaries[locale as keyof typeof dictionaries]()
  return new Proxy(dictionary, {
    get(target, property) {
      if (property in target) {
        return target[property as keyof typeof target]
      } else {
        return `{{${property.toString()}}}`
      }
    },
  }) as Dictionary
}
