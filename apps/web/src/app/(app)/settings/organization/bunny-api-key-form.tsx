import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const apiKeySchema = z.object({
  apiKey: z
    .string()
    .min(1, { message: 'Please provide a valid Bunny API Key.' }),
})

export type APIKeySchema = z.infer<typeof apiKeySchema>

interface BunnyApiKeyFormProps {
  onKeySubmit: (data: APIKeySchema) => Promise<void> | void
}

export function BunnyApiKeyForm({ onKeySubmit }: BunnyApiKeyFormProps) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<APIKeySchema>({
    resolver: zodResolver(apiKeySchema),
  })

  return (
    <form onSubmit={handleSubmit(onKeySubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="apiKey">Bunny API Key</Label>
        <Input id="apiKey" {...register('apiKey')} />
        {errors.apiKey && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.apiKey.message}
          </p>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          The API key can be found on your{' '}
          <a
            href="https://dash.bunny.net/account/settings"
            target="_blank"
            className="underline"
          >
            account page
          </a>{' '}
          and it will be used only <span className="font-semibold">ONCE</span>{' '}
          so we can fetch the available video libraries.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2">
        <DialogTrigger asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogTrigger>
        <Button disabled={isSubmitting} className="w-44">
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Fetch video libraries'
          )}
        </Button>
      </div>
    </form>
  )
}
