'use client'

import { dayjs } from '@nivo/dayjs'
import { SymbolIcon } from '@radix-ui/react-icons'
import { Cable, CopyIcon, Loader2, ReceiptText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useDictionary } from '@/state/dictionary'

import { CopyButton } from '@/components/copy-button'
import { TranscriptionPreview } from '@/components/transcription-preview'
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
import { trpc } from '@/lib/trpc/react'
import { formatBytes } from '@/utils/format-bytes'
import { formatSecondsToMinutes } from '@/utils/format-seconds-to-minutes'

import { BatchUploadSkeletonTable } from './batch-upload-skeleton-table'

export interface BatchUploadListProps {
  batchId: string
}

export function BatchUploadList({ batchId }: BatchUploadListProps) {
  const dictionary = useDictionary()
  const {
    data,
    isLoading: isLoadingBatch,
    isRefetching: isRefetchingBatch,
  } = trpc.getUploadBatch.useQuery(
    {
      batchId,
    },
    {
      refetchInterval: 15 * 1000,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
    },
  )

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 54 }}></TableHead>
              <TableHead style={{ width: 400 }}>
                <div className="flex items-center gap-2">
                  {dictionary.batch_upload_list_video_column}
                  {isRefetchingBatch && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
              </TableHead>
              <TableHead style={{ width: 120 }}>{dictionary.batch_upload_list_duration_column}</TableHead>
              <TableHead style={{ width: 140 }}>{dictionary.batch_upload_list_size_column}</TableHead>
              <TableHead style={{ width: 200 }}>
                <div className="flex items-center gap-2">
                  <ReceiptText className="size-4" />
                  {dictionary.batch_upload_list_transcription_column}
                </div>
              </TableHead>
              <TableHead style={{ width: 200 }}>
                <div className="flex items-center gap-2">
                  <Cable className="size-4" />
                  {dictionary.batch_upload_list_external_id_column}
                </div>
              </TableHead>
              <TableHead style={{ width: 200 }}></TableHead>
              <TableHead style={{ width: 60 }}></TableHead>
            </TableRow>
          </TableHeader>

          {isLoadingBatch ? (
            <BatchUploadSkeletonTable />
          ) : (
            <TableBody>
              {data?.batch && data.batch.uploads.length ? (
                data.batch.uploads.map((video) => (
                  <TableRow
                    key={video.id}
                    className="has-[a:focus-visible]:bg-accent"
                  >
                    <TableCell className="text-right font-medium">
                      {video.uploadOrder}
                    </TableCell>
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
                    <TableCell className="text-xs text-muted-foreground">
                      {formatSecondsToMinutes(video.duration)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatBytes(video.sizeInBytes)}
                    </TableCell>
                    <TableCell>
                      {video.transcription ? (
                        <TranscriptionPreview videoId={video.id} />
                      ) : (
                        <div className="flex items-center font-medium">
                          <SymbolIcon className="mr-2 h-3 w-3 animate-spin" />
                          {dictionary.batch_upload_list_processing_status}
                        </div>
                      )}
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
                            {dictionary.batch_upload_list_copy_button}
                          </CopyButton>
                        </div>
                      ) : (
                        <div className="flex items-center font-medium">
                          <SymbolIcon className="mr-2 h-3 w-3 animate-spin" />
                          {dictionary.batch_upload_list_processing_status}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 whitespace-nowrap text-muted-foreground">
                        <time title={video.createdAt.toLocaleString()}>
                          {dayjs(video.createdAt).fromNow()}
                        </time>
                        {video.author?.image && (
                          <Tooltip>
                            <div className="flex items-center gap-2">
                              <span>{dictionary.batch_upload_list_by}</span>
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
                      <UploadItemActions videoId={video.id} uploadBatchId={null} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={99} className="h-24 text-center">
                    {dictionary.batch_upload_list_no_results}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </>
  )
}
