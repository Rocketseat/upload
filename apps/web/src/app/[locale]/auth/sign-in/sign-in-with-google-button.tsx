'use client'

import { AtSign, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'

export function SignInWithGoogleButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      disabled={pending}
      variant="outline"
      type="submit"
      className="w-full"
    >
      {pending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <AtSign className="mr-2 size-4" />
      )}
      Sign in with Google
    </Button>
  )
}
