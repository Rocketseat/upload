import { Header } from '@/components/header'
import { Locale, getDictionary } from '@nivo/i18n'

export default async function AppLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode,
  params: {
    locale: Locale
  }
}) {
  const dictionary = await getDictionary(locale)

  return (
    <div className="flex min-h-screen flex-col">
      <Header dictionary={dictionary} />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">{children}</div>
    </div>
  )
}
