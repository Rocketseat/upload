import { Locale, getDictionaryByLocale } from '@nivo/i18n'

import { Header } from '@/components/header'
import { setDictionary, setLocale } from '@/utils/dictionary-server-side'

export default async function AppLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: {
    locale: Locale
  }
}) {
  setLocale(locale)
  const dictionary = await getDictionaryByLocale(locale)
  setDictionary(dictionary)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">{children}</div>
    </div>
  )
}
