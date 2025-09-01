import { Skeleton } from "../../app/components/ui/skeleton"

const MoviesSkeleton = () => {
  const items = Array.from(Array(14).keys())
  return (
    <div className="p-5 flex flex-wrap justify-center items-center gap-1">
      {items.map((item) => (
        <Skeleton
          key={item}
          className="h-60 lg:h-90 w-40 lg:w-58 rounded-sm bg-zinc-300 dark:bg-muted"
        />
      ))}
    </div>
  )
}

export default MoviesSkeleton
