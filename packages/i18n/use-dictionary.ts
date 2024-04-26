// // 'server-only'

// TODO: needs to understand why cache does not exists here... (same version as in web app)
// import { cache } from 'react'
// import { Dictionary } from './get-dictionary'
// import { Locale } from './config'


// const serverContext = cache(() => new Map())

// export const useDictionary = (defaultValue?: Dictionary, language?: Locale) => {
//   const global = serverContext()

//   if (defaultValue !== undefined) {
//     global.set('dictionary', defaultValue)
//   }
//   if (language !== undefined) {
//     global.set('language', language)
//   }

//   return {
//     get language(): Locale {
//       return global.get('language')
//     },
//     get dictionary(): Dictionary {
//       return global.get('dictionary')
//     },
//     set dictionary(value: Dictionary) {
//       global.set('dictionary', value)
//     },
//   }
// }
