import { Metadata } from 'next'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { LanguageForm } from './language-form'
import { getDictionary, i18n, Locale } from '@nivo/i18n'

export const metadata: Metadata = {
  title: 'Language settings',
}

export default async function LanguagePage({ params: { locale } }: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)
  const languages = i18n.locales.map(locale => ({
    label: dictionary[`languages_${locale}`],
    code: locale
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Language</CardTitle>
        <CardDescription>
          Select your preferred language from the list below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageForm languages={languages} currentLocale={locale} />
      </CardContent>
    </Card>
  )
}
