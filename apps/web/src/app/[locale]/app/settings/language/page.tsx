import { getDictionary, i18n, Locale } from '@nivo/i18n'
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

export const metadata: Metadata = {
  title: 'Language settings',
}

export default async function LanguagePage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)
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
        <CardTitle>Choose Language</CardTitle>
        <CardDescription>
          Select your preferred language from the list below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageForm
          languages={languages}
          currentLocale={locale}
          updateLanguage={updateLanguage}
        />
      </CardContent>
    </Card>
  )
}
