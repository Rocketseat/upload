'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { webhookEventTrigger } from '@nivo/drizzle/schema'
import { Dictionary } from '@nivo/i18n'
import { RouterOutput } from '@nivo/trpc'
import { Loader2 } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc/react'
import { useDictionary } from '@/state/dictionary'

import { WebhookTriggersInput } from './webhook-triggers-input'

export const createWebhookSchema = (dictionary: Dictionary) =>
  z.object({
    url: z.string().url({ message: dictionary.webhook_form_invalid_url }),
    triggers: z
      .array(webhookEventTrigger)
      .min(1, { message: dictionary.webhook_form_select_trigger }),
  })

export type CreateWebhookSchema = z.infer<
  ReturnType<typeof createWebhookSchema>
>

interface WebhookFormProps {
  webhookToEdit?: RouterOutput['getCompanyWebhooks']['companyWebhooks'][number]
}

export function WebhookForm({ webhookToEdit }: WebhookFormProps) {
  const dictionary = useDictionary()
  const utils = trpc.useUtils()

  const webhookForm = useForm<CreateWebhookSchema>({
    resolver: zodResolver(createWebhookSchema(dictionary)),
    defaultValues: {
      url: webhookToEdit?.url ?? '',
      triggers: webhookToEdit?.triggers ?? [],
    },
  })

  const { mutateAsync: createWebhook } = trpc.createCompanyWebhook.useMutation()
  const { mutateAsync: updateWebhook } = trpc.updateCompanyWebhook.useMutation()

  async function handleSaveWebhook({ url, triggers }: CreateWebhookSchema) {
    try {
      const isEditingWebhook = webhookToEdit !== undefined

      if (isEditingWebhook) {
        await updateWebhook({
          companyWebhookId: webhookToEdit.id,
          url,
          triggers,
        })
      } else {
        await createWebhook({
          url,
          triggers,
        })
      }

      if (!isEditingWebhook) {
        webhookForm.reset({
          url: '',
          triggers: [],
        })
      }

      utils.getCompanyWebhooks.invalidate()

      toast.success(dictionary.webhook_form_save_success, {
        description: dictionary.webhook_form_save_success_description,
      })
    } catch {
      toast.success(dictionary.webhook_form_save_error, {
        description: dictionary.webhook_form_save_error_description,
      })
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = webhookForm

  return (
    <FormProvider {...webhookForm}>
      <form onSubmit={handleSubmit(handleSaveWebhook)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url">{dictionary.webhook_form_label_url}</Label>
          <Input id="url" placeholder="https://" {...register('url')} />
          {errors.url && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.url.message}
            </p>
          )}
        </div>

        <WebhookTriggersInput />

        <div className="flex items-center justify-end gap-2">
          <DialogTrigger asChild>
            <Button variant="ghost">
              {dictionary.webhook_form_button_cancel}
            </Button>
          </DialogTrigger>
          <Button disabled={isSubmitting} className="w-20">
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              dictionary.webhook_form_button_save
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
