import { Skeleton } from "../../app/components/ui/skeleton"

const PersonInfoSkeleton = () => {
  return (
    <div className="px-9 flex items-start justify-start gap-2">
      <Skeleton className="h-40 lg:h-49 w-28 lg:w-35 rounded-sm bg-zinc-300 dark:bg-muted" />
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-28 lg:w-60 rounded-sm bg-zinc-300 dark:bg-muted" />
        <Skeleton className="h-16 w-35 lg:w-100 rounded-sm bg-zinc-300 dark:bg-muted" />
        <Skeleton className="h-10 w-60 lg:w-90 rounded-sm bg-zinc-300 dark:bg-muted" />
      </div>
    </div>
  )
}

export default PersonInfoSkeleton
