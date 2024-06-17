import { zodResolver } from '@hookform/resolvers/zod'
import { VideoLibraries } from '@nivo/bunny'
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

export const videoLibrarySchema = z.object({
  videoLibraryId: z
    .string()
    .min(1, { message: 'Please select a video library.' }),
})

export type VideoLibrarySchema = z.infer<typeof videoLibrarySchema>

interface BunnyVideoLibraryFormProps {
  videoLibraries: VideoLibraries
  onVideoLibraryChosen: (data: VideoLibrarySchema) => Promise<void> | void
}

export function BunnyVideoLibraryForm({
  onVideoLibraryChosen,
  videoLibraries,
}: BunnyVideoLibraryFormProps) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<VideoLibrarySchema>({
    resolver: zodResolver(videoLibrarySchema),
  })

  return (
    <form onSubmit={handleSubmit(onVideoLibraryChosen)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="videoLibraryId">Bunny Video Library</Label>

        <Controller
          name="videoLibraryId"
          control={control}
          render={({ field }) => {
            return (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a video library" />
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
          <Button variant="ghost">Cancel</Button>
        </DialogTrigger>
        <Button disabled={isSubmitting} className="w-44">
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Connect video library'
          )}
        </Button>
      </div>
    </form>
  )
}
