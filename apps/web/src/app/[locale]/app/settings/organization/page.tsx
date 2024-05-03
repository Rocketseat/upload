import { getDictionary, Locale } from '@nivo/i18n'
import { unstable_noStore } from 'next/cache'
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
import { Select, SelectTrigger } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { serverClient } from '@/lib/trpc/server'

import { ConnectBunnyAccount } from './connect-bunny-account'

export default async function OrganizationPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)
  unstable_noStore()

  const { company } = await serverClient.getCurrentUserCompany()

  return (
    <>
      <Head>
        <title>{dictionary.organization_page_title}</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.organization_title}</CardTitle>
          <CardDescription>
            {dictionary.organization_description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{dictionary.organization_label_name}</Label>
              <Input
                name="name"
                id="name"
                defaultValue={company.name ?? ''}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">
                {dictionary.organization_label_domain}
              </Label>
              <Input
                type="text"
                id="domain"
                defaultValue={company.domain ?? ''}
                disabled
              />
              <p className="text-[0.8rem] text-muted-foreground">
                {dictionary.organization_domain_description}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="bunnyLibraryId">
                {dictionary.organization_label_bunny_integration}
              </Label>
              <ConnectBunnyAccount externalId={company.externalId} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>{dictionary.organization_label_members}</Label>
              <div className="rounded border">
                <Table>
                  <TableBody>
                    {company.members.map((member) => {
                      return (
                        <TableRow key={member.id}>
                          <TableCell style={{ width: 48 }}>
                            <Avatar>
                              {member.image ? (
                                <Image
                                  className="aspect-square size-full"
                                  src={member.image}
                                  width={32}
                                  height={32}
                                  alt=""
                                />
                              ) : (
                                <div className="aspect-square size-full bg-accent" />
                              )}
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-primary">
                                {member.name}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {member.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="flex justify-end">
                            <Select disabled>
                              <SelectTrigger className="w-fit gap-2">
                                {dictionary.organization_member_role}
                              </SelectTrigger>
                            </Select>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            <p className="text-[0.8rem] text-muted-foreground">
              {dictionary.organization_info_update_not_allowed}
            </p>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
