'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { SheetOverlay, sheetVariants } from './ui/sheet'

export const InterceptedSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const router = useRouter()

  const onDismiss = React.useCallback(() => {
    router.back()
  }, [router])

  return (
    <>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        onEscapeKeyDown={onDismiss}
        onPointerDownOutside={onDismiss}
        className={sheetVariants({ side: 'right', className })}
        {...props}
      >
        {children}
        <button
          onClick={onDismiss}
          className="absolute right-8 top-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </SheetPrimitive.Content>
    </>
  )
})

InterceptedSheetContent.displayName = SheetPrimitive.Content.displayName
