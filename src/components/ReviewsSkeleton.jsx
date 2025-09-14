import { Skeleton } from "../../app/components/ui/skeleton"

const ReviewsSkeleton = () => {
  return (
    <div id="reviews" className="flex flex-col gap-5 my-8 lg:my-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-40 lg:w-80 bg-zinc-300 dark:bg-muted" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-10 w-20 lg:w-40 bg-zinc-300 dark:bg-muted" />
          <Skeleton className="h-10 w-10 bg-zinc-300 dark:bg-muted" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-15 w-50 lg:w-240 bg-zinc-300 dark:bg-muted" />
        <Skeleton className="h-10 w-20 lg:w-40 bg-zinc-300 dark:bg-muted" />
        <Skeleton className="h-10 w-15 bg-zinc-300 dark:bg-muted" />
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="h-30 w-90 lg:w-full bg-zinc-300 dark:bg-muted" />
        <Skeleton className="h-30 w-90 lg:w-full bg-zinc-300 dark:bg-muted" />
      </div>
    </div>
  )
}

export default ReviewsSkeleton
