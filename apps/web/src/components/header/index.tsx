import { Dictionary } from '@nivo/i18n'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import nivoIcon from '@/assets/nivo-icon.svg'

import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { MenuLink } from './menu-link'
import { Search } from './search'
import { ThemeSwitcher } from './theme-switcher'
import { UserProfileButton } from './user-profile-button'

export async function Header({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between px-8">
        <div className="flex items-center space-x-4">
          <Image
            src={nivoIcon}
            alt={dictionary.header_nivo_alt}
            className="size-6"
            width={24}
            height={24}
          />

          <Separator orientation="vertical" className="h-6" />

          <nav className="flex items-center space-x-2 lg:space-x-3">
            <MenuLink href="/app">{dictionary.header_nav_dashboard}</MenuLink>
            <MenuLink href="/app/uploads">
              {dictionary.header_nav_uploads}
            </MenuLink>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Search />

          <Separator orientation="vertical" className="h-6" />

          <Button size="sm" asChild>
            <Link href="/app/upload">
              <PlusCircle className="mr-2 size-4" />
              {dictionary.header_button_upload_video}
            </Link>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <ThemeSwitcher />
          <UserProfileButton dictionary={dictionary} />
        </div>
      </div>
    </div>
  )
}
