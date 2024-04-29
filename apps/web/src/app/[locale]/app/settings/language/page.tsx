import { Metadata } from 'next'

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

export default async function LanguagePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Language</CardTitle>
        <CardDescription>
          Select your preferred language from the list below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageForm />
      </CardContent>
    </Card>
  )
}
