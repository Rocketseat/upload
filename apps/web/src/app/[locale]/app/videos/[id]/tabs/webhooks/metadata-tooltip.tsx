import { InfoCircledIcon } from '@radix-ui/react-icons'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDictionary } from '@/state/dictionary'

export function MetadataTooltip() {
  const dictionary = useDictionary()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoCircledIcon className="h-4 w-4 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px]">
          <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
            {dictionary.metadata_tooltip_request_body}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
