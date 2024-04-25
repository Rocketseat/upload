'use server'

import { revalidatePath } from 'next/cache'

export async function onBunnyAccountConnected() {
  revalidatePath('/')
  revalidatePath('/upload')
  revalidatePath('/settings/organization')
}
