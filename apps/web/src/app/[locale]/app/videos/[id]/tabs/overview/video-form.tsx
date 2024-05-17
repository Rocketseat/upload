'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Dictionary } from '@nivo/i18n'
import { RouterOutput } from '@nivo/trpc'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Loader2 } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { trpc } from '@/lib/trpc/react'
import { useDictionary } from '@/state/dictionary'

import { VideoDescriptionInput } from './video-description-input'
import { VideoTagInput } from './video-tag-input'

interface VideoFormProps {
  video: RouterOutput['getUpload']['video']
}

const editVideoFormSchema = (dictionary: Dictionary) =>
  z.object({
    title: z
      .string()
      .min(1, { message: dictionary.edit_video_form_error_valid_title }),
    description: z.string().nullable(),
    commitUrl: z
      .string()
      .url({ message: dictionary.edit_video_form_error_valid_github_url })
      .nullable(),
    tags: z.array(z.string()).min(1, {
      message: dictionary.edit_video_form_error_tag_required,
    }),
  })

export type EditVideoFormSchema = z.infer<
  ReturnType<typeof editVideoFormSchema>
>

export function VideoForm({ video }: VideoFormProps) {
  const dictionary = useDictionary()

  const editVideoForm = useForm<EditVideoFormSchema>({
    resolver: zodResolver(editVideoFormSchema(dictionary)),
    defaultValues: {
      title: video.title,
      description: video.description,
      tags: video.tags.map((tag) => tag.slug),
      commitUrl: video.commitUrl,
    },
  })

  const { mutateAsync: updateVideo } = trpc.updateUpload.useMutation()

  async function handleSaveVideo({
    title,
    description,
    tags,
    commitUrl,
  }: EditVideoFormSchema) {
    try {
      await updateVideo({
        videoId: video.id,
        title,
        description,
        tags,
        commitUrl,
      })
    } catch {
      toast.error(dictionary.video_form_toast_error, {
        description: dictionary.video_form_toast_error_description,
      })
    }
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = editVideoForm

  return (
    <FormProvider {...editVideoForm}>
      <form onSubmit={handleSubmit(handleSaveVideo)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {dictionary.video_form_title_label}{' '}
            <span className="text-muted-foreground">
              {dictionary.video_form_title_synced}
            </span>
          </Label>
          <Input id="title" {...register('title')} defaultValue={video.title} />
          {errors.title && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="commit">{dictionary.video_form_tags_label}</Label>
          <VideoTagInput />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            {dictionary.video_form_description_label}{' '}
            <span className="text-muted-foreground">
              {dictionary.video_form_description_synced}
            </span>
          </Label>
          <VideoDescriptionInput
            videoId={video.id}
            defaultValue={video.description ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="externalProviderId">
            {dictionary.video_form_external_status_id_label}
          </Label>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-zinc-400 has-[input:focus-visible]:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:has-[input:focus-visible]:ring-zinc-800">
            <Badge variant="secondary">
              {video.externalStatus ||
                dictionary.video_form_external_status_waiting}
            </Badge>
            <Separator orientation="vertical" className="h-4" />
            <input
              data-empty={!video.externalProviderId}
              value={
                video.externalProviderId ??
                dictionary.video_form_external_id_not_generated
              }
              id="externalProviderId"
              className="h-10 flex-1 bg-transparent py-2 text-sm outline-none"
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commit">
            {dictionary.video_form_commit_reference_label}{' '}
            <span className="text-muted-foreground">
              {dictionary.video_form_commit_reference_synced}
            </span>
          </Label>
          <Input
            id="commit"
            {...register('commitUrl')}
            defaultValue={video.commitUrl ?? ''}
          />
          {errors.commitUrl && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.commitUrl.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button className="w-24" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              dictionary.video_form_save_button
            )}
          </Button>
          {isSubmitSuccessful && (
            <div className="flex items-center gap-2 text-sm text-emerald-500 dark:text-emerald-400">
              <CheckCircledIcon className="h-3 w-3" />
              <span>{dictionary.video_form_saved_message}</span>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
