import { auth } from '@nivo/auth'
import { getDictionary, Locale } from '@nivo/i18n'
import Head from 'next/head'
import Image from 'next/image'

import { Avatar } from '@/components/ui/avatar'
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

export default async function ProfilePage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)
  const session = await auth()

  if (!session || !session.user) {
    throw new Error(
      dictionary.error_invalid_session_data || 'Invalid session data.',
    )
  }

  const { user } = session

  return (
    <>
      <Head>
        <title>{dictionary.profile_page_title}</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.profile_title}</CardTitle>
          <CardDescription>{dictionary.profile_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="inline-block space-y-2">
              <Label>{dictionary.profile_label_avatar}</Label>
              <Avatar className="size-16 overflow-visible">
                {user.image ? (
                  <Image
                    className="aspect-square size-full rounded-full ring-1 ring-muted"
                    src={user.image}
                    width={64}
                    height={64}
                    alt="User Avatar"
                  />
                ) : (
                  <div className="aspect-square size-full bg-accent" />
                )}
              </Avatar>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{dictionary.profile_label_name}</Label>
              <Input
                name="name"
                id="name"
                defaultValue={user.name ?? ''}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{dictionary.profile_label_email}</Label>
              <Input
                type="email"
                id="email"
                defaultValue={user.email ?? ''}
                disabled
              />
            </div>
            <Separator />
            <p className="text-[0.8rem] text-muted-foreground">
              {dictionary.profile_info_update_not_allowed}
            </p>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
