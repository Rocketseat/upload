'use client'

import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDictionary } from '@/state/dictionary'

import { WebhookForm } from './webhook-form'

export function CreateWebhook() {
  const dictionary = useDictionary()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Plus className="mr-2 size-3" />
          {dictionary.create_webhook_button}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.create_webhook_title}</DialogTitle>
          <DialogDescription>
            {dictionary.create_webhook_description}
          </DialogDescription>
        </DialogHeader>

        <WebhookForm />
      </DialogContent>
    </Dialog>
  )
}
