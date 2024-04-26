'server-only'

import { cache } from 'react';
import { type Dictionary, Locale } from '@nivo/i18n'

const serverContext = cache(() => new Map());

export const useDictionary = (
  defaultValue?: Dictionary,
  language?: Locale,
) => {
  const global = serverContext();

  if (defaultValue !== undefined) {
    global.set('dictionary', defaultValue);
  }
  if (language !== undefined) {
    global.set('language', language);
  }

  return {
    get language(): Locale {
      return global.get('language')
    },
    get dictionary(): Dictionary {
      return global.get('dictionary')
    },
    set dictionary(value: Dictionary) {
      global.set('dictionary', value);
    }
  }
};

