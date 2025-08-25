import { Skeleton } from "../../app/components/ui/skeleton"

const MovieSearchSkeleton = ({}) => {
  const items = Array.from(Array(6).keys())
  return items.map(() => (
    <div className="flex flex-col w-full lg:w-1/4 gap-1 justify-center items-center">
      <Skeleton className="flex w-1/2 h-40 lg:h-40 bg-zinc-300 dark:bg-stone-800 py-10 px-2 rounded-lg items-center  gap-2 border-1 border-transparent transition-all" />
      <Skeleton className="flex w-full h-5 bg-zinc-300 dark:bg-stone-800 py-5 px-2 rounded-lg items-center  gap-2 border-1 border-transparent transition-all" />
    </div>
  ))
}

export default MovieSearchSkeleton