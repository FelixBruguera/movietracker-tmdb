import { Skeleton } from "../../app/components/ui/skeleton"

const MoviesSkeleton = () => {
  const items = Array.from(Array(14).keys())
  return (
    <div className="p-5 flex flex-wrap justify-center items-center gap-2 gap-y-2">
      {items.map((item) => (
        <Skeleton
          key={item}
          className="h-40 lg:h-68 w-28 lg:w-45 rounded-sm bg-zinc-300 dark:bg-muted"
        />
      ))}
    </div>
  )
}

export default MoviesSkeleton