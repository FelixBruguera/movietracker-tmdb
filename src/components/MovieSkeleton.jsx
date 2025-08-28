import { Skeleton } from "../../app/components/ui/skeleton"
import MovieDetailsList from "./MovieDetailsList"

const MovieSkeleton = () => {
  return (
    <div className="container p-4 w-full max-w-400 mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 h-screen w-full">
        <Skeleton className="h-100 lg:h-7/10 w-3/4 lg:w-1/3 mx-auto lg:mx-0 rounded-sm bg-zinc-200 dark:bg-muted" />
        <div className="w-full md:w-2/3 flex flex-col gap-3">
          <Skeleton className="h-10 w-90 lg:w-8/10 rounded-sm bg-zinc-200 dark:bg-muted p-2" />
          <MovieDetailsList>
            <Skeleton className="h-10 w-1/8 rounded-sm bg-zinc-200 dark:bg-muted" />
            <Skeleton className="h-10 w-1/8 rounded-sm bg-zinc-200 dark:bg-muted" />
            <Skeleton className="h-10 w-1/8 rounded-sm bg-zinc-200 dark:bg-muted" />
            <Skeleton className="h-10 w-1/8 rounded-sm bg-zinc-200 dark:bg-muted" />
          </MovieDetailsList>
          <Skeleton className="h-40 w-90 lg:w-9/10 rounded-sm bg-zinc-200 dark:bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default MovieSkeleton