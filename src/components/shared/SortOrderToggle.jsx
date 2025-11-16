import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react"
import { Button } from "@ui/button"
import { memo } from "react"
import { useSearchParams } from "react-router"

const SortOrderToggle = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isAscending = searchParams.get("sort_order") === "1"
  const handleSortOrder = () => {
    const newValue = isAscending ? -1 : 1
    setSearchParams((params) => {
      params.set("sort_order", newValue)
      params.set("page", 1)
      return params
    })
  }
  const label = isAscending ? "Ascending order" : "Descending order"
  return (
    <Button
      title={label}
      aria-label={label}
      onClick={() => handleSortOrder()}
      className="bg-muted dark:bg-card border-1 border-border hover:bg-input/50 dark:hover:bg-input/50 hover:cursor-pointer group transition-colors"
    >
      {isAscending ? (
        <ArrowUpWideNarrow className="!size-3.5 text-stone-900 dark:text-white group-hover:text-white transition-colors" />
      ) : (
        <ArrowDownWideNarrow className="!size-3.5 text-stone-900 dark:text-white group-hover:text-white transition-colors" />
      )}
    </Button>
  )
})

export default SortOrderToggle
