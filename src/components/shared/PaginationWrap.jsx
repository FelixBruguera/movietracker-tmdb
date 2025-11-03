import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination"
import { Button } from "@ui/button"
import { memo } from "react"
import { useSearchParams } from "react-router"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

const PaginationButton = memo(
  ({ onClick, disabled, children, label, active }) => {
    return (
      <PaginationItem>
        <Button
          variant="ghost"
          className={`p-3 hover:bg-accent dark:hover:bg-accent/90 hover:cursor-pointer hover:text-white transition-colors ${disabled ? "pointer-events-none text-stone-500" : "pointer-events-auto"} ${active && "bg-accent text-white"}`}
          title={label}
          aria-label={label}
          onClick={() => onClick()}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          {children}
        </Button>
      </PaginationItem>
    )
  },
)

const PaginationWrap = memo(({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const handleChange = (newPage) => {
    setSearchParams((params) => {
      params.set("page", newPage)
      return params
    })
  }
  const currentPage = parseInt(searchParams.get("page")) || 1
  const maxPages = totalPages > 500 ? 500 : totalPages
  return (
    <div className="w-full">
      <Pagination className="p-2">
        <PaginationContent className="gap-2">
          <PaginationButton
            disabled={currentPage <= 1}
            onClick={() => handleChange(1)}
            label="First page"
          >
            <ChevronsLeft />
          </PaginationButton>
          <PaginationButton
            disabled={currentPage <= 1}
            onClick={() => handleChange(currentPage - 1)}
            label="Previous page"
          >
            <ChevronLeft />
          </PaginationButton>
          <PaginationButton
            onClick={() => handleChange(currentPage)}
            label={`Page ${currentPage}`}
            active={true}
          >
            {currentPage}
          </PaginationButton>
          <PaginationButton
            disabled={currentPage >= maxPages}
            onClick={() => handleChange(currentPage + 1)}
            label="Next page"
          >
            <ChevronRight />
          </PaginationButton>
          <PaginationButton
            disabled={currentPage >= maxPages}
            onClick={() => handleChange(maxPages)}
            label="Last page"
          >
            <ChevronsRight />
          </PaginationButton>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-xs md:text-sm text-muted-foreground">
        {maxPages} Pages
      </p>
    </div>
  )
})

export default PaginationWrap
