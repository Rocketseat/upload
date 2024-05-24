'use client'

import { MagicWandIcon } from '@radix-ui/react-icons'
import { useCompletion } from 'ai/react'
import { Loader2 } from 'lucide-react'
import { TextareaHTMLAttributes, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useDictionary } from '@/state/dictionary'

import { EditVideoFormSchema } from './video-form'

export interface VideoDescriptionInputProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  videoId: string
}

export function VideoDescriptionInput({
  videoId,
  ...props
}: VideoDescriptionInputProps) {
  const dictionary = useDictionary()
  const { setValue, register } = useFormContext<EditVideoFormSchema>()

  const { completion, complete, isLoading } = useCompletion({
    api: `/api/ai/generate/description?videoId=${videoId}`,
  })

  useEffect(() => {
    if (completion) {
      setValue('description', completion)
    }
  }, [completion, setValue])

  return (
    <>
      <Textarea
        id="description"
        disabled={isLoading}
        className="min-h-[132px] leading-relaxed"
        {...register('description')}
        {...props}
        placeholder={dictionary.video_description_placeholder}
      />
      <div>
        <Button
          disabled={isLoading}
          onClick={() => complete(videoId)}
          size="sm"
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <MagicWandIcon className="mr-2 h-3 w-3" />
          )}
          {dictionary.generate_with_ai_button}
        </Button>
      </div>
    </>
  )
}
