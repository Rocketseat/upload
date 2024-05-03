import { Dictionary } from '@nivo/i18n'
import { BookText } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { serverClient } from '@/lib/trpc/server'

export async function WebhookDocsButton({
  dictionary,
}: {
  dictionary: Dictionary
}) {
  const { triggers } = await serverClient.getAvailableTriggers()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="default" variant="outline">
          <BookText className="mr-2 size-4" />
          {dictionary.webhook_docs_button_label}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.webhook_docs_title}</DialogTitle>
          <DialogDescription>
            {dictionary.webhook_docs_description}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px]">
          <Accordion type="single" collapsible className="w-full">
            {triggers.map(({ trigger, description }) => {
              return (
                <AccordionItem value={trigger} key={trigger}>
                  <AccordionTrigger>{trigger}</AccordionTrigger>
                  <AccordionContent>{dictionary[description]}</AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  )
}
