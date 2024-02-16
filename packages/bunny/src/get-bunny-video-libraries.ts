import { z } from 'zod'

const videoLibrarySchema = z.object({
  Id: z.coerce.string(),
  Name: z.string(),
  ApiKey: z.string(),
})

export const videoLibrariesSchema = z.array(videoLibrarySchema)

export type VideoLibrary = z.infer<typeof videoLibrarySchema>

export type VideoLibraries = z.infer<typeof videoLibrariesSchema>

export async function getBunnyVideoLibraries(apiKey: string) {
  const response = await fetch('https://api.bunny.net/videolibrary', {
    headers: {
      AccessKey: apiKey,
    },
  })

  const data = await response.json()

  const videoLibraries = videoLibrariesSchema.parse(data)

  return { videoLibraries }
}
