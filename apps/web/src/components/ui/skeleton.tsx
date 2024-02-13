import { twMerge } from 'tailwind-merge'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
