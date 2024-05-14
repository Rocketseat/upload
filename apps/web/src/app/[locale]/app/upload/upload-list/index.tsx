'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useDictionary } from '@/state/dictionary'

import { trpc } from '@/lib/trpc/react'

import { Header } from './header'
import { UploadDropArea } from './upload-drop-area'
import { UploadTable } from './upload-table'
import { Dictionary } from '@nivo/i18n'

const uploadsFormSchema = (dictionary: Dictionary) => z.object({
  files: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        duration: z.coerce.number().transform(Math.round),
        language: z.enum(['pt', 'es']),
        sizeInBytes: z.coerce.number(),
        tags: z.array(z.string()).min(1, { message: dictionary.upload_list_at_least_one_tag }),
      }),
    )
    .min(0),
})

export type UploadsFormSchema = z.infer<ReturnType<typeof uploadsFormSchema>>

export function UploadList() {
  const dictionary = useDictionary()
  const router = useRouter()

  const uploadsForm = useForm<UploadsFormSchema>({
    resolver: zodResolver(uploadsFormSchema(dictionary)),
  })

  const { handleSubmit } = uploadsForm

  const { mutateAsync: createUploadBatch } =
    trpc.createUploadBatch.useMutation()

  async function handleCreateUploadBatch({ files }: UploadsFormSchema) {
    try {
      const { batchId } = await createUploadBatch({ files })

      router.push(`/app/batches/${batchId}`)
    } catch {
      toast.error(dictionary.upload_list_error_title, {
        description: dictionary.upload_list_error_description,
      })
    }
  }

  return (
    <FormProvider {...uploadsForm}>
      <div className="space-y-4">
        <Header onSubmit={handleSubmit(handleCreateUploadBatch)} />
        <UploadDropArea />
        <UploadTable />
      </div>
    </FormProvider>
  )
}
