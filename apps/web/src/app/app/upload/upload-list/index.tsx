'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { trpc } from '@/lib/trpc/react'

import { Header } from './header'
import { UploadDropArea } from './upload-drop-area'
import { UploadTable } from './upload-table'

const uploadsFormSchema = z.object({
  files: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        duration: z.coerce.number().transform(Math.round),
        language: z.enum(['pt', 'es']),
        sizeInBytes: z.coerce.number(),
        tags: z.array(z.string()).min(1, 'At least one tag is required.'),
      }),
    )
    .min(0),
})

export type UploadsFormSchema = z.infer<typeof uploadsFormSchema>

export function UploadList() {
  const router = useRouter()

  const uploadsForm = useForm<UploadsFormSchema>({
    resolver: zodResolver(uploadsFormSchema),
  })

  const { handleSubmit } = uploadsForm

  const { mutateAsync: createUploadBatch } =
    trpc.createUploadBatch.useMutation()

  async function handleCreateUploadBatch({ files }: UploadsFormSchema) {
    try {
      const { batchId } = await createUploadBatch({ files })

      router.push(`/app/batches/${batchId}`)
    } catch {
      toast.error('Uh oh! Something went wrong.', {
        description:
          'An error ocurred while trying to create the upload batch. If the error persists, please contact an administrator.',
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
