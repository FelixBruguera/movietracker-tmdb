import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react"
import { Button } from "../../app/components/ui/button"
import { memo } from "react"
import { useRouter, useRouterState } from "@tanstack/react-router"

const SortOrderToggle = memo(() => {
  const router = useRouter()
  const routerState = useRouterState()
  const { sortOrder } = routerState.location.search
  const isAscending = sortOrder === 1
  const handleSortOrder = () => {
    const newValue = isAscending ? -1 : 1
    router.navigate({ search: (prev) => {
        return { ...prev, sortOrder: newValue, page: 1 } }
    })
  }
  return (
    <Button
      title={isAscending ? "Ascending order" : "Descending order"}
      onClick={() => handleSortOrder()}
      className="bg-muted dark:bg-card border-1 border-border hover:bg-accent dark:hover:bg-accent hover:cursor-pointer group"
    >
      {isAscending ? (
        <ArrowUpWideNarrow className="!size-3.5 text-stone-900 dark:text-white group-hover:text-white transition-all" />
      ) : (
        <ArrowDownWideNarrow className="!size-3.5 text-stone-900 dark:text-white group-hover:text-white transition-all" />
      )}
    </Button>
  )
})

export default SortOrderToggle