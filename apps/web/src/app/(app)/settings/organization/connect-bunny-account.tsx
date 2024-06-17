'use client'

import { getBunnyVideoLibraries, VideoLibraries } from '@nivo/bunny'
import { Check, Plug } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc/react'

import { onBunnyAccountConnected } from './actions'
import { APIKeySchema, BunnyApiKeyForm } from './bunny-api-key-form'
import {
  BunnyVideoLibraryForm,
  VideoLibrarySchema,
} from './bunny-video-library-form'

interface ConnectBunnyAccountProps {
  externalId: string | null
}

export function ConnectBunnyAccount({ externalId }: ConnectBunnyAccountProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bunnyVideoLibraries, setBunnyVideoLibraries] =
    useState<VideoLibraries>([])

  const { mutateAsync: setBunnyLibraryAndAPIKey } =
    trpc.setBunnyLibraryAndAPIKey.useMutation()

  async function handleApiKey({ apiKey }: APIKeySchema) {
    try {
      const { videoLibraries } = await getBunnyVideoLibraries(apiKey)

      setBunnyVideoLibraries(videoLibraries)
    } catch (err) {
      toast.error(
        'Failed to fetch Bunny video library, please check the API key provided.',
      )
    }
  }

  async function handleVideoLibraryChosen({
    videoLibraryId,
  }: VideoLibrarySchema) {
    try {
      const videoLibrary = bunnyVideoLibraries.find(
        (item) => item.Id === videoLibraryId,
      )

      if (!videoLibrary) {
        throw new Error()
      }

      await setBunnyLibraryAndAPIKey({
        libraryId: videoLibrary.Id,
        libraryName: videoLibrary.Name,
        apiKey: videoLibrary.ApiKey,
      })

      toast.success('Connected to Bunny!', {
        description: 'You can now start uploading videos.',
      })

      await onBunnyAccountConnected()

      setIsDialogOpen(false)
    } catch (err) {
      toast.error('Failed to set Bunny Video Library, please try again.')
    }
  }

  const isBunnyVideoLibrariesEmpty = bunnyVideoLibraries.length === 0

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!!externalId}
            variant="secondary"
            className="w-56 shrink-0"
          >
            {externalId ? (
              <>
                <Check className="mr-2 size-4" />
                Account connected
              </>
            ) : (
              <>
                <Plug className="mr-2 size-4" />
                Connect account
              </>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Bunny account</DialogTitle>
            <DialogDescription>
              This will allow you to upload new videos.
            </DialogDescription>
          </DialogHeader>

          {isBunnyVideoLibrariesEmpty ? (
            <BunnyApiKeyForm onKeySubmit={handleApiKey} />
          ) : (
            <BunnyVideoLibraryForm
              videoLibraries={bunnyVideoLibraries}
              onVideoLibraryChosen={handleVideoLibraryChosen}
            />
          )}
        </DialogContent>
      </Dialog>

      <Input
        type="text"
        id="bunnyLibraryId"
        disabled
        readOnly
        placeholder="Connect your Bunny account to upload"
        value={externalId ?? ''}
      />
    </div>
  )
}
