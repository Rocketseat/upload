'use client'

import { Locale } from '@nivo/i18n'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

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
      className={twMerge(
        'space-x-2',
        isSelected ? 'bg-muted' : 'bg-transparent',
      )}
    >
      {children}
    </DropdownMenuItem>
  )
}
