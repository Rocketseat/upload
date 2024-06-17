import { ComponentProps } from 'react'

import { NavLink } from '../nav-link'

export function MenuLink(props: ComponentProps<typeof NavLink>) {
  return (
    <NavLink
      shouldMatchExact
      className="flex h-14 items-center border-b-2 border-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border data-[current=true]:border-violet-400 data-[current=true]:text-accent-foreground"
      {...props}
    />
  )
}
