import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu'

export function LanguagePicker() {
  return (
    <>
      <DropdownMenuLabel>Language</DropdownMenuLabel>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>🇺🇸 English</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem className="space-x-2 bg-muted">
            🇺🇸 English
          </DropdownMenuItem>
          <DropdownMenuItem>🇧🇷 Portuguese</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  )
}
