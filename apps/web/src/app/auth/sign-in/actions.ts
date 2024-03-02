'use server'

import { signIn } from '@nivo/auth'
import { z } from 'zod'

const signInFormSchema = z.object({
  email: z.string().email({ message: 'Use admin@rocketseat.team' }),
  password: z.string().min(1, { message: 'Use 123456' }),
})

export async function signInWithEmail(data: FormData) {
  const { email, password } = signInFormSchema.parse(Object.fromEntries(data))

  await signIn('credentials', {
    email,
    password,
    redirectTo: '/dashboard',
  })
}

export async function signInWithGithub() {
  await signIn('google', {
    redirectTo: '/dashboard',
  })
}
