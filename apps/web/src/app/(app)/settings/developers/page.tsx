import { ClipboardCopy, Code2 } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { WebhookDocsButton } from './webhooks-docs-button'
import { WebhooksList } from './webhooks-list'
import { WebhooksListLoading } from './webhooks-list-loading'

export const metadata: Metadata = {
  title: 'Developers settings',
}

export default async function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developers</CardTitle>
        <CardDescription>
          Connect your application through our webhooks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">API URL</Label>
            <Input
              name="apiUrl"
              id="apiUrl"
              defaultValue="https://upload.rocketseat.com.br/api/v1"
              disabled
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Access our{' '}
              <a href="#" className="underline">
                documentation
              </a>{' '}
              to understand how to use our API.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-zinc-400 has-[input:focus-visible]:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:has-[input:focus-visible]:ring-zinc-800">
              <input
                id="apiKey"
                className="h-10 flex-1 bg-transparent py-2 text-sm outline-none"
                readOnly
                defaultValue={'*'.repeat(48)}
              />
              <Button variant="secondary" size="xs">
                <ClipboardCopy className="mr-1.5 size-3" />
                Click to copy
              </Button>
            </div>
          </div>

          <Separator />

          <Suspense fallback={<WebhooksListLoading />}>
            <WebhooksList />
          </Suspense>

          <Separator />

          <div className="space-x-3">
            <Button size="default" variant="outline" asChild>
              <Link href="/settings/developers/logs" prefetch={false}>
                <Code2 className="mr-2 size-4" />
                Webhook logs
              </Link>
            </Button>

            <WebhookDocsButton />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
