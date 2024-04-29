'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Locale } from '@nivo/i18n'

export const createLanguageSchema = z.object({
  language: z.object({
    label: z.string(),
    code: z.string(),
  }),
})

export type UpdateLanguageSchema = z.infer<typeof createLanguageSchema>

interface LanguageFormProps {
  languages: { code: Locale, label: string }[]
  currentLocale: string
}

export function LanguageForm({ languages, currentLocale }: LanguageFormProps) {
  const [open, setOpen] = useState(false)

  const languageForm = useForm<UpdateLanguageSchema>({
    resolver: zodResolver(createLanguageSchema),
  })

  async function handleSaveLanguage({ language }: UpdateLanguageSchema) {
    console.log({ language })
    toast.success('Your language preferences were updated!')
  }

  const { handleSubmit } = languageForm


  return (
    <FormProvider {...languageForm}>
      <form onSubmit={handleSubmit(handleSaveLanguage)} className="space-y-6">
        <FormField
          defaultValue={languages.find(lang => lang.code === currentLocale)}
          control={languageForm.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Current Setting</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={twMerge(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? languages.find(
                          (language) => language.code === field.value.code,
                        )?.label
                        : 'Select Language'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search language..."
                      className="h-9"
                    />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          key={language.code}
                          value={language.label}
                          onSelect={() => {
                            languageForm.setValue('language', language)
                            setOpen(false)
                          }}
                        >
                          {language.label}
                          <CheckIcon
                            className={twMerge(
                              'ml-auto h-4 w-4',
                              language.code === field.value?.code
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This setting determines the language used throughout the app.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </FormProvider>
  )
}
