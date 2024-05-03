import { zodResolver } from '@hookform/resolvers/zod'
import { Dictionary } from '@nivo/i18n'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDictionary } from '@/state/dictionary'

export const apiKeySchema = (dictionary: Dictionary) =>
  z.object({
    apiKey: z.string().min(1, { message: dictionary.bunny_api_key_form_error }),
  })

export type APIKeySchema = z.infer<ReturnType<typeof apiKeySchema>>

interface BunnyApiKeyFormProps {
  onKeySubmit: (data: APIKeySchema) => Promise<void> | void
}

export function BunnyApiKeyForm({ onKeySubmit }: BunnyApiKeyFormProps) {
  const dictionary = useDictionary()
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<APIKeySchema>({
    resolver: zodResolver(apiKeySchema(dictionary)),
  })

  return (
    <form onSubmit={handleSubmit(onKeySubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="apiKey">{dictionary.bunny_api_key_form_label}</Label>
        <Input id="apiKey" {...register('apiKey')} />
        {errors.apiKey && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.apiKey.message}
          </p>
        )}
        <BunnyApiKeyFormDescription dictionary={dictionary} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <DialogTrigger asChild>
          <Button variant="ghost">
            {dictionary.bunny_api_key_form_cancel_button}
          </Button>
        </DialogTrigger>
        <Button disabled={isSubmitting} className="w-44">
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            dictionary.bunny_api_key_form_fetch_button
          )}
        </Button>
      </div>
    </form>
  )
}

const BunnyApiKeyFormDescription = ({
  dictionary,
}: {
  dictionary: Dictionary
}) => {
  const accountPageUrl = 'https://dash.bunny.net/account/settings'
  const accountPageText = dictionary.bunny_api_key_form_account_page
  const onceText = dictionary.bunny_api_key_form_description_once

  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      {dictionary.bunny_api_key_form_description_part1}
      <a href={accountPageUrl} target="_blank" className="underline">
        {accountPageText}
      </a>
      {dictionary.bunny_api_key_form_description_part2}
      <span className="font-semibold">{onceText}</span>
      {dictionary.bunny_api_key_form_description_part3}
    </p>
  )
}
