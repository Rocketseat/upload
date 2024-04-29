'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc/react'

import { CreateWebhookSchema } from './webhook-form'

export function WebhookTriggersInput() {
  const { data, isLoading } = trpc.getAvailableTriggers.useQuery()

  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CreateWebhookSchema>()

  function handleSelectAllTriggers() {
    if (!data) {
      return
    }

    setValue(
      'triggers',
      data.triggers.map((item) => item.trigger),
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {Array.from({ length: 6 }).map((_, i) => {
          return (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {data &&
          data.triggers.map(({ trigger, description }) => {
            return (
              <div key={trigger} className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Controller
                    control={control}
                    name="triggers"
                    render={({ field }) => {
                      return (
                        <Checkbox
                          checked={field.value.includes(trigger)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, trigger])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== trigger,
                                  ),
                                )
                          }}
                        />
                      )
                    }}
                  />
                  <Badge className="px-1" variant="secondary">
                    {trigger}
                  </Badge>
                </Label>
                <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            )
          })}
      </div>
      {errors.triggers && (
        <p className="text-sm font-medium text-red-500 dark:text-red-400">
          {errors.triggers.message}
        </p>
      )}
      <Separator />
      <p className="text-sm text-muted-foreground">
        Do you want this webhook to{' '}
        <button
          type="button"
          onClick={handleSelectAllTriggers}
          className="bg-transparent underline"
        >
          listen to all events
        </button>
        ?
      </p>
    </div>
  )
}
