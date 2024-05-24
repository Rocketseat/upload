import { getDictionaryByLocale, i18n, Locale } from '@nivo/i18n'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { LanguageForm } from './language-form'
import { setDictionary } from '@/utils/dictionary-server-side'

export const metadata: Metadata = {
  title: 'Language settings',
}

export default async function LanguagePage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionaryByLocale(locale)
  setDictionary(dictionary)
  const languages = i18n.locales.map((locale) => ({
    label: dictionary[`languages_${locale}`],
    code: locale,
  }))

  async function updateLanguage(locale: Locale) {
    'use server'
    const cookieStore = cookies()
    cookieStore.set('NEXT_LOCALE', locale)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.language_page_choose_language}</CardTitle>
        <CardDescription>
          {dictionary.language_page_description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageForm
          languages={languages}
          updateLanguage={updateLanguage}
        />
      </CardContent>
    </Card>
  )
}
