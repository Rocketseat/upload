'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useDictionary } from '@/state/dictionary'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UploadsPaginationProps {
  pageCount: number
  pageSize: number
  pageIndex: number
}

export function UploadsPagination({
  pageCount,
  pageSize,
  pageIndex,
}: UploadsPaginationProps) {
  const dictionary = useDictionary()
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  function navigateToPage(pageIndex: number) {
    router.push(
      `/app/uploads?${createQueryString('pageIndex', String(pageIndex))}`,
    )
  }

  function setPageSize(pageSize: string) {
    router.push(`/app/uploads?${createQueryString('pageSize', pageSize)}`)
  }

  const page = pageIndex + 1
  const hasPreviousPage = page > 1
  const hasNextPage = page < pageCount

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{dictionary.uploads_pagination_rows_per_page}</p>
          <Select value={`${pageSize}`} onValueChange={setPageSize}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {`${dictionary.uploads_pagination_page_info} ${page} ${dictionary.uploads_pagination_page_info_separator} ${pageCount}`}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => navigateToPage(0)}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">{dictionary.uploads_pagination_go_to_first_page}</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => navigateToPage(pageIndex - 1)}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">{dictionary.uploads_pagination_go_to_previous_page}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => navigateToPage(pageIndex + 1)}
            disabled={!hasNextPage}
          >
            <span className="sr-only">{dictionary.uploads_pagination_go_to_next_page}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => navigateToPage(pageCount - 1)}
            disabled={!hasNextPage}
          >
            <span className="sr-only">{dictionary.uploads_pagination_go_to_last_page}</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
