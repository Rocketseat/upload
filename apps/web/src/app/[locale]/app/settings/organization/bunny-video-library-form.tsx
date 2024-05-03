import { zodResolver } from '@hookform/resolvers/zod'
import { VideoLibraries } from '@nivo/bunny'
import { Dictionary } from '@nivo/i18n'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const videoLibrarySchema = (dictionary: Dictionary) =>
  z.object({
    videoLibraryId: z
      .string({
        required_error: dictionary.bunny_video_library_form_error_required,
      })
      .min(1, { message: dictionary.bunny_video_library_form_error_select }),
  })

export type VideoLibrarySchema = z.infer<ReturnType<typeof videoLibrarySchema>>

interface BunnyVideoLibraryFormProps {
  videoLibraries: VideoLibraries
  onVideoLibraryChosen: (data: VideoLibrarySchema) => Promise<void> | void
  dictionary: Dictionary
}

export function BunnyVideoLibraryForm({
  onVideoLibraryChosen,
  videoLibraries,
  dictionary,
}: BunnyVideoLibraryFormProps) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<VideoLibrarySchema>({
    resolver: zodResolver(videoLibrarySchema(dictionary)),
  })

  return (
    <form onSubmit={handleSubmit(onVideoLibraryChosen)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="videoLibraryId">
          {dictionary.bunny_video_library_form_label}
        </Label>

        <Controller
          name="videoLibraryId"
          control={control}
          render={({ field }) => {
            return (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      dictionary.bunny_video_library_form_placeholder
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {videoLibraries.map((videoLibrary) => {
                    return (
                      <SelectItem key={videoLibrary.Id} value={videoLibrary.Id}>
                        {videoLibrary.Name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )
          }}
        />

        {errors.videoLibraryId && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.videoLibraryId.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <DialogTrigger asChild>
          <Button variant="ghost">
            {dictionary.bunny_video_library_form_cancel}
          </Button>
        </DialogTrigger>
        <Button disabled={isSubmitting} className="w-44">
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            dictionary.bunny_video_library_form_connect
          )}
        </Button>
      </div>
    </form>
  )
}
