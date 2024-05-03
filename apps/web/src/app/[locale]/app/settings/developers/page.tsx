import { getDictionary, Locale } from '@nivo/i18n'
import { ClipboardCopy, Code2 } from 'lucide-react'
import Head from 'next/head'
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

export default async function SettingsPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)

  return (
    <>
      <Head>
        <title>{dictionary.developers_settings_title}</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.developers_title}</CardTitle>
          <CardDescription>{dictionary.developers_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">{dictionary.api_url_label}</Label>
              <Input
                name="apiUrl"
                id="apiUrl"
                defaultValue="https://nivo.video/api/v1"
                disabled
              />
              <p className="text-[0.8rem] text-muted-foreground">
                {dictionary.api_url_description}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">{dictionary.api_key_label}</Label>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-zinc-400 has-[input:focus-visible]:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:has-[input:focus-visible]:ring-zinc-800">
                <input
                  id="apiKey"
                  className="h-10 flex-1 bg-transparent py-2 text-sm outline-none"
                  readOnly
                  defaultValue={'*'.repeat(48)}
                />
                <Button variant="secondary" size="xs">
                  <ClipboardCopy className="mr-1.5 size-3" />
                  {dictionary.api_key_copy_button}
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
                <Link href="/app/settings/developers/logs" prefetch={false}>
                  <Code2 className="mr-2 size-4" />
                  {dictionary.webhook_logs_button}
                </Link>
              </Button>

              <WebhookDocsButton dictionary={dictionary} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
