import { getDictionary } from '@nivo/i18n'
import {
  Building,
  Code2,
  Globe,
  SquareDashedBottomCode,
  User2,
} from 'lucide-react'
import { ReactNode } from 'react'

import { AsideLink } from './aside-link'

export default async function Layout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: string }
}) {
  const dictionary = await getDictionary(locale)

  return (
    <>
      <div className="grid grid-cols-5 gap-12">
        <aside className="-mx-4 space-y-4">
          <h2 className="mx-4 text-2xl font-bold tracking-tight">
            {dictionary.settings_aside_title}
          </h2>

          <nav className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="mb-2 px-4 text-xxs font-semibold uppercase text-muted-foreground">
                {dictionary.settings_aside_general}
              </span>
              <AsideLink href="/app/settings/profile">
                <User2 className="mr-2 size-4" />
                {dictionary.settings_aside_profile}
              </AsideLink>
              <AsideLink href="/app/settings/organization">
                <Building className="mr-2 size-4" />
                {dictionary.settings_aside_organization}
              </AsideLink>
            </div>
            <div className="flex flex-col gap-1">
              <span className="mb-2 px-4 text-xxs font-semibold uppercase text-muted-foreground">
                {dictionary.settings_aside_developers}
              </span>
              <AsideLink href="/app/settings/developers">
                <Code2 className="mr-2 size-4" />
                {dictionary.settings_aside_api_webhooks}
              </AsideLink>
              <AsideLink href="/app/settings/developers/logs">
                <SquareDashedBottomCode className="mr-2 size-4" />
                {dictionary.settings_aside_webhook_logs}
              </AsideLink>
            </div>
            <div className="flex flex-col gap-1">
              <span className="mb-2 px-4 text-xxs font-semibold uppercase text-muted-foreground">
                {dictionary.settings_aside_preferences}
              </span>
              <AsideLink href="/app/settings/language">
                <Globe className="mr-2 size-4" />
                {dictionary.settings_aside_language}
              </AsideLink>
            </div>
          </nav>
        </aside>

        <div className="col-span-4">{children}</div>
      </div>
    </>
  )
}
