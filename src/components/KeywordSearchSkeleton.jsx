import { Skeleton } from "../../app/components/ui/skeleton"

const KeywordSearchSkeleton = ({}) => {
  const items = Array.from(Array(15).keys())
  return (
    <div className="flex flex-wrap w-full gap-1 justify-start items-center">
      {items.map(() => (
        <Skeleton className="flex w-35 h-5 bg-zinc-300 dark:bg-stone-800 py-5 px-2 rounded-lg items-center  gap-2 border-1 border-transparent transition-all" />
      ))}
    </div>
  )
}

export default KeywordSearchSkeleton
