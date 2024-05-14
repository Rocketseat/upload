import { Cable, CopyIcon } from 'lucide-react'
import { useDictionary } from '@/state/dictionary'
import { dayjs } from '@nivo/dayjs'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { z } from 'zod'

import { CopyButton } from '@/components/copy-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UploadItemActions } from '@/components/upload-item-actions'
import { serverClient } from '@/lib/trpc/server'
import { formatBytes } from '@/utils/format-bytes'
import { formatSecondsToMinutes } from '@/utils/format-seconds-to-minutes'

import { UploadsPagination } from './uploads-pagination'
import { unstable_noStore } from 'next/cache'
import { Locale, getDictionary } from '@nivo/i18n'

export const metadata: Metadata = {
  title: 'Uploads',
}

const uploadsPageSearchParams = z.object({
  pageIndex: z.coerce.number().default(0),
  pageSize: z.coerce.number().default(10),
  tagsFilter: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional(),
  titleFilter: z.string().default(''),
})

type UploadsPageSearchParams = z.infer<typeof uploadsPageSearchParams>

export default async function UploadsPage({
  searchParams,
  params: { locale }
}: {
  searchParams: UploadsPageSearchParams,
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)

  unstable_noStore()

  const { pageIndex, pageSize, titleFilter, tagsFilter } =
    uploadsPageSearchParams.parse(searchParams)

  const { videos, pageCount } = await serverClient.getUploads({
    pageIndex,
    pageSize,
    titleFilter,
    tagsFilter,
  })

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dictionary.uploads_video}</TableHead>
              <TableHead style={{ width: 100 }}>{dictionary.uploads_duration}</TableHead>
              <TableHead style={{ width: 120 }}>{dictionary.uploads_size}</TableHead>
              <TableHead style={{ width: 200 }}>
                <div className="flex items-center gap-2">
                  <Cable className="size-4" />
                  {dictionary.uploads_external}
                </div>
              </TableHead>
              <TableHead style={{ width: 200 }} />
              <TableHead style={{ width: 64 }} />
            </TableRow>
          </TableHeader>

          <TableBody>
            {videos && videos.length > 0 ? (
              videos.map((video) => {
                return (
                  <TableRow
                    key={video.id}
                    className="has-[a:focus-visible]:bg-muted"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/app/videos/${video.id}`}
                          prefetch={false}
                          className="font-medium text-primary outline-none hover:underline"
                        >
                          {video.title}
                        </Link>

                        <span className="text-xs text-muted-foreground">
                          {video.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatSecondsToMinutes(video.duration)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatBytes(video.sizeInBytes)}
                    </TableCell>
                    <TableCell>
                      {video.externalProviderId ? (
                        <div className="flex items-center gap-2 font-medium">
                          <span className="truncate text-xs text-muted-foreground">
                            {video.externalProviderId}
                          </span>
                          <CopyButton
                            size="xs"
                            variant="outline"
                            textToCopy={video.externalProviderId}
                          >
                            <CopyIcon className="mr-1 h-3 w-3" />
                            {dictionary.uploads_copy}
                          </CopyButton>
                        </div>
                      ) : (
                        <div className="flex items-center font-medium text-muted-foreground/80">
                          <span>{dictionary.uploads_processing}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <time title={video.createdAt.toLocaleString()}>
                          {dayjs(video.createdAt).fromNow()}
                        </time>
                        {video.author?.image && (
                          <Tooltip>
                            <div className="flex items-center gap-2">
                              <span>{dictionary.uploads_by}</span>
                              <TooltipTrigger asChild>
                                <Image
                                  src={video.author?.image}
                                  className="size-5 rounded-full"
                                  width={20}
                                  height={20}
                                  alt=""
                                />
                              </TooltipTrigger>
                              {video.author?.name && (
                                <TooltipContent>
                                  {video.author?.name}
                                </TooltipContent>
                              )}
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <UploadItemActions
                        videoId={video.id}
                        uploadBatchId={video.uploadBatchId}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {dictionary.uploads_no_results}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <UploadsPagination
          pageSize={pageSize}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
      </Suspense>
    </>
  )
}
