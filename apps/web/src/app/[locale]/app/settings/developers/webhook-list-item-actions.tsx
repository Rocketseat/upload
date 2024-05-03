'use client'

import { RouterOutput } from '@nivo/trpc'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { Loader2, MoreHorizontal, X } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { trpc } from '@/lib/trpc/react'
import { useDictionary } from '@/state/dictionary'

import { WebhookForm } from './webhook-form'

interface WebhookListItemActionsProps {
  webhook: RouterOutput['getCompanyWebhooks']['companyWebhooks'][number]
}

export function WebhookListItemActions({
  webhook,
}: WebhookListItemActionsProps) {
  const dictionary = useDictionary()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const utils = trpc.useUtils()

  const { mutateAsync: deleteCompanyWebhook, isPending: isDeletingWebhook } =
    trpc.deleteCompanyWebhook.useMutation({
      onSuccess() {
        utils.getCompanyWebhooks.invalidate()
      },
    })

  async function handleDeleteWebhook() {
    try {
      await deleteCompanyWebhook({
        companyWebhookId: webhook.id,
      })

      setIsDeleteDialogOpen(false)
    } catch {
      toast.error(dictionary.error_deleting_webhook, {
        description: dictionary.error_deleting_webhook_desc,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="outline" size="xs">
          <MoreHorizontal className="size-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil2Icon className="mr-2 size-4" />
              {dictionary.webhook_list_actions_edit}
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dictionary.webhook_dialog_title}</DialogTitle>
              <DialogDescription>
                {dictionary.webhook_dialog_description}
              </DialogDescription>
            </DialogHeader>

            <WebhookForm webhookToEdit={webhook} />
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              disabled={isDeletingWebhook}
              onSelect={(e) => e.preventDefault()}
            >
              <X className="mr-2 size-4" />
              {dictionary.webhook_list_actions_delete}
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {dictionary.webhook_list_delete_confirmation}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>{dictionary.webhook_list_delete_detail}</p>
                <p>{dictionary.webhook_list_delete_events}</p>
                <ol className="list-disc space-y-2 pl-4">
                  {webhook.triggers.map((trigger) => {
                    return (
                      <li key={trigger}>
                        <Badge className="px-1" variant="secondary">
                          {trigger}
                        </Badge>
                      </li>
                    )
                  })}
                </ol>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {dictionary.webhook_list_delete_cancel}
              </AlertDialogCancel>
              <Button
                disabled={isDeletingWebhook}
                variant="destructive"
                className="w-20"
                onClick={handleDeleteWebhook}
              >
                {isDeletingWebhook ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  dictionary.webhook_list_actions_delete
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
