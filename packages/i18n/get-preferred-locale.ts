import { i18n } from ".";

export function getPreferredLocaleFromHeader(headers: Headers) {
  const acceptLanguageHeader = headers.get('accept-language');

  if (!acceptLanguageHeader) return null;

  const locales = acceptLanguageHeader.split(',')
    .map(item => {
      const [locale, q = 'q=1'] = item.split(';');
      return { locale: locale.trim(), weight: parseFloat(q.split('=')[1]) };
    })
    .sort((a, b) => b.weight - a.weight);

  for (const { locale } of locales) {
    const lang = locale.split('-')[0];
    if (i18n.locales.some(supportedLang => supportedLang === lang)) {
      return lang;
    }
  }
  return null;
}
