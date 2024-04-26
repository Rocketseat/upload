'use client'

import { Check } from 'lucide-react'
import { Locale } from '@nivo/i18n'
import { ReactNode } from 'react'

import { DropdownMenuItem } from '../ui/dropdown-menu'

interface LanguagePickerItemProps {
  setLanguage(locale: Locale): void
  isSelected: boolean
  locale: Locale
  children: ReactNode
}

export function LanguagePickerItem({
  setLanguage,
  isSelected,
  locale,
  children,
}: LanguagePickerItemProps) {
  function handleChangeLanguage() {
    setLanguage(locale)
    setTimeout(() => {
      window.location.reload()
    }, 200)
  }

  return (
    <DropdownMenuItem
      onClick={handleChangeLanguage}
      className="space-x-2 gap-2 cursor-pointer dark:focus:bg-inherit focus:bg-inherit"
    >
      {children}
      {isSelected && <Check className="mr-2 size-4" />}
    </DropdownMenuItem>
  )
}
