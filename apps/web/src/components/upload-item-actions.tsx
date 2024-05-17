'use client'

import { Pencil2Icon } from '@radix-ui/react-icons'
import { GroupIcon, Loader2, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { trpc } from '@/lib/trpc/react'
import { useDictionary } from '@/state/dictionary'

interface UploadItemActionsProps {
  videoId: string
  uploadBatchId: string | null
}

export function UploadItemActions({
  videoId,
  uploadBatchId,
}: UploadItemActionsProps) {
  const dictionary = useDictionary()
  const utils = trpc.useUtils()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { mutateAsync: deleteVideo, isPending: isDeletingVideo } =
    trpc.deleteUpload.useMutation({
      onSuccess() {
        utils.getUploads.invalidate()
      },
    })

  async function handleDeleteVideo() {
    try {
      await deleteVideo({ videoId })

      setIsDeleteDialogOpen(false)
    } catch {
      toast.error(dictionary.upload_item_actions_toast_error, {
        description: dictionary.upload_item_actions_toast_error_description,
      })
    }
  }

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            className="data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-3" />
            <span className="sr-only">
              {dictionary.upload_item_actions_open_menu}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link href={`/app/videos/${videoId}`} prefetch={false}>
              <Pencil2Icon className="mr-2 h-4 w-4" />
              <span>{dictionary.upload_item_actions_edit}</span>
            </Link>
          </DropdownMenuItem>
          {uploadBatchId && (
            <DropdownMenuItem asChild>
              <Link href={`/app/batches/${uploadBatchId}`} prefetch={false}>
                <GroupIcon className="mr-2 h-4 w-4" />
                <span>{dictionary.upload_item_actions_view_batch}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-500 data-[highlighted]:text-red-500 dark:text-red-400 dark:data-[highlighted]:text-red-400"
              disabled={isDeletingVideo}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {dictionary.upload_item_actions_delete}
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dictionary.upload_item_actions_confirm_title}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>{dictionary.upload_item_actions_confirm_description}</p>
            <p>
              {dictionary.upload_item_actions_confirm_note_1}
              <span className="font-semibold text-accent-foreground">
                {dictionary.upload_item_actions_confirm_note_2}
              </span>
              :
            </p>
            <ol className="list-disc space-y-2 pl-4">
              <li>{dictionary.upload_item_actions_confirm_step_1}</li>
              <li>{dictionary.upload_item_actions_confirm_step_2}</li>
              <li>{dictionary.upload_item_actions_confirm_step_3}</li>
            </ol>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {dictionary.upload_item_actions_cancel}
          </AlertDialogCancel>
          <Button
            disabled={isDeletingVideo}
            variant="destructive"
            className="w-20"
            onClick={handleDeleteVideo}
          >
            {isDeletingVideo ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              dictionary.upload_item_actions_delete
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
