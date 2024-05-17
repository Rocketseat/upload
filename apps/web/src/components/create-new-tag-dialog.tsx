'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Dictionary } from '@nivo/i18n'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { trpc } from '@/lib/trpc/react'
import { useDictionary } from '@/state/dictionary'

import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

const newTagFormSchema = (dictionary: Dictionary) =>
  z.object({
    tag: z
      .string({
        required_error: dictionary.new_tag_form_error_required,
      })
      .regex(/^[a-zA-Z]+(-[a-zA-Z]+)*$/, {
        message: dictionary.new_tag_form_error_format,
      }),
  })

type NewTagFormSchema = z.infer<ReturnType<typeof newTagFormSchema>>

interface CreateNewTagDialogProps {
  onRequestClose: () => void
}

export function CreateNewTagDialog({
  onRequestClose,
}: CreateNewTagDialogProps) {
  const dictionary = useDictionary()
  const utils = trpc.useUtils()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<NewTagFormSchema>({
    resolver: zodResolver(newTagFormSchema(dictionary)),
    defaultValues: {
      tag: '',
    },
  })

  const { mutateAsync: createTag } = trpc.createTag.useMutation({
    onSuccess() {
      utils.getTags.invalidate()
    },
  })

  async function handleCreateTag({ tag }: NewTagFormSchema) {
    try {
      await createTag({ tag })

      reset()
      onRequestClose()
    } catch (err) {
      toast.error(dictionary.create_tag_error, {
        description: dictionary.create_tag_error_description,
      })
    }
  }

  return (
    <DialogContent className="outline-none sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{dictionary.create_new_tag}</DialogTitle>
        <DialogDescription className="space-y-3">
          <p>
            {dictionary.create_new_tag_description_1}{' '}
            <span className="font-semibold text-accent-foreground">
              {dictionary.create_new_tag_description_2}
            </span>
            .
          </p>
          <p className="flex items-center">
            <AlertCircle className="mr-2 inline h-4 w-4" />
            <span>
              {dictionary.create_new_tag_description_3}{' '}
              <span className="font-semibold text-accent-foreground">
                {dictionary.create_new_tag_description_4}
              </span>
              :
            </span>
          </p>
          <ol className="space-y-2">
            <li>
              <Badge variant="outline">ignite</Badge> -{' '}
              {dictionary.example_tag_product}
            </li>
            <li>
              <Badge variant="outline">react</Badge> -{' '}
              {dictionary.example_tag_technology}
            </li>
            <li>
              <Badge variant="outline">fundamentos-do-react</Badge> -{' '}
              {dictionary.example_tag_course}
            </li>
          </ol>
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateTag)} className="w-full">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-baseline gap-4">
            <Label htmlFor="tag" className="text-right">
              {dictionary.new_tag_label}
            </Label>
            <div className="col-span-3 space-y-4">
              <Input
                id="tag"
                placeholder={dictionary.new_tag_placeholder}
                disabled={isSubmitting}
                {...register('tag')}
              />
              {errors.tag && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {errors.tag.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost">
              {dictionary.cancel_button}
            </Button>
          </DialogTrigger>
          <Button className="w-24" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              dictionary.create_button
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
