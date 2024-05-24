'use client'

import { Loader2 } from 'lucide-react'

import { CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDictionary } from '@/state/dictionary'

export function TranscriptionSkeleton() {
  const dictionary = useDictionary()

  return (
    <>
      <CardContent className="select-none space-y-2 p-4 leading-relaxed opacity-60 blur-sm">
        {Array.from({ length: 20 }).map((_, row) => {
          return <Skeleton key={row} className="h-4 w-full" />
        })}
      </CardContent>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 text-center text-sm text-card-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <div className="flex flex-col gap-1">
          {dictionary.transcription_skeleton_generating}
          <span className="text-xs text-muted-foreground">
            {dictionary.transcription_skeleton_auto_refresh}
          </span>
        </div>
      </div>
    </>
  )
}
