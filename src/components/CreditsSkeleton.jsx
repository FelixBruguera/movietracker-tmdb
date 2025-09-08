import { Skeleton } from "../../app/components/ui/skeleton"

const CreditsSkeleton = () => {
  const items = Array.from(Array(25).keys())
  return (
    <div className="flex flex-col items-center mx-auto px-9">
      <Skeleton className="h-30 lg:h-20 w-40 lg:w-1/3 rounded-sm bg-zinc-300 dark:bg-muted" />
      <div className="p-5 flex flex-wrap justify-center items-center gap-1">
        {items.map((item) => (
          <Skeleton
            key={item}
            className="h-30 lg:h-32 w-21 lg:w-23 rounded-sm bg-zinc-300 dark:bg-muted"
          />
        ))}
      </div>
    </div>
  )
}

export default CreditsSkeleton
