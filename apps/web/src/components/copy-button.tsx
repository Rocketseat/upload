'use client'

import { ComponentProps, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { useDictionary } from '@/state/dictionary'

import { Button } from './ui/button'

export interface CopyButtonProps extends ComponentProps<typeof Button> {
  textToCopy: string
}

export function CopyButton({ textToCopy, ...props }: CopyButtonProps) {
  const dictionary = useDictionary()
  const [wasCopiedRecently, setWasCopiedRecently] = useState(false)
  const copyTimeoutRef = useRef<NodeJS.Timeout>()

  function handleCopy() {
    clearTimeout(copyTimeoutRef.current)

    navigator.clipboard.writeText(textToCopy)

    setWasCopiedRecently(true)

    copyTimeoutRef.current = setTimeout(() => {
      setWasCopiedRecently(false)
    }, 2000)
  }

  return (
    <Button
      {...props}
      data-highlight={wasCopiedRecently}
      onClick={handleCopy}
      className={twMerge(
        'data-[highlight=true]:border-emerald-500 data-[highlight=true]:bg-emerald-500 data-[highlight=true]:text-white data-[highlight=true]:transition-none',
        props.className,
      )}
    >
      {wasCopiedRecently ? dictionary.copy_button_copied : props.children}
    </Button>
  )
}
