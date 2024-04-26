import { Locale, i18n } from '@nivo/i18n'
import {
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu'
import { useDictionary } from '@/state/dictionary'
import { LanguagePickerItem } from './language-picker-item'
import { cookies } from 'next/headers'

export async function LanguagePicker() {
  const { dictionary, language } = useDictionary()

  async function setLanguage(locale: Locale) {
    "use server"
    const cookieStore = cookies()
    cookieStore.set('NEXT_LOCALE', locale)
  }

  return (
    <>
      <DropdownMenuLabel>Language</DropdownMenuLabel>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>{dictionary.languages[language]}</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {i18n.locales.map(locale => (
            <LanguagePickerItem
              setLanguage={setLanguage}
              locale={locale}
              isSelected={language === locale}
            >
              {dictionary.languages[locale]}
            </LanguagePickerItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub >
    </>
  )
}
