'use client'

import { Link1Icon } from '@radix-ui/react-icons'
import { Edit2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/lib/trpc/react'
import { useDictionary } from '@/state/dictionary'

import { Button } from './ui/button'

export interface TranscriptionPreviewProps {
  videoId: string
}

export function TranscriptionPreview({ videoId }: TranscriptionPreviewProps) {
  const dictionary = useDictionary()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    data,
    isLoading: isLoadingTranscription,
    isPending: isPendingTranscription,
  } = trpc.getUploadTranscription.useQuery(
    {
      videoId,
    },
    {
      enabled: isDialogOpen,
    },
  )

  const transcriptionText = useMemo(() => {
    if (!data) {
      return ''
    }

    return data.transcription.segments.map((segment) => segment.text).join('')
  }, [data])

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center font-medium text-primary hover:underline">
          <Link1Icon className="mr-2 h-4 w-4" />
          <span>{dictionary.transcription_preview_view_transcription}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{dictionary.transcription_preview_title}</DialogTitle>
        </DialogHeader>
        {isLoadingTranscription || isPendingTranscription ? (
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => {
              return <Skeleton key={i} className="h-3 w-full" />
            })}
          </div>
        ) : (
          <>
            <Textarea
              lang="pt"
              className="h-[480px] hyphens-auto text-sm leading-relaxed"
              value={transcriptionText}
              readOnly
              autoFocus
            />
            <Button variant="secondary" asChild>
              <Link href={`/app/videos/${data?.transcription?.uploadId}`}>
                <Edit2 className="mr-2 h-3 w-3" />
                {dictionary.transcription_preview_button_review}
              </Link>
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
