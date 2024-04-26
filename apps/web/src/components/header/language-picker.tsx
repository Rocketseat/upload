import { i18n, Locale } from '@nivo/i18n'
import { cookies } from 'next/headers'

import { useDictionary } from '@/state/dictionary'

import {
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu'
import { LanguagePickerItem } from './language-picker-item'

export async function LanguagePicker() {
  const { dictionary, language } = useDictionary()

  async function setLanguage(locale: Locale) {
    'use server'
    const cookieStore = cookies()
    cookieStore.set('NEXT_LOCALE', locale)
  }

  return (
    <>
      <DropdownMenuLabel>{dictionary.languagePicker.title}</DropdownMenuLabel>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {dictionary.languages[language]}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {i18n.locales.map((locale) => (
            <LanguagePickerItem
              key={locale}
              setLanguage={setLanguage}
              locale={locale}
              isSelected={language === locale}
            >
              {dictionary.languages[locale]}
            </LanguagePickerItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  )
}
