import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../../app/components/ui/sheet"
import { Button } from "../../app/components/ui/button"
import { Funnel } from "lucide-react"
import FiltersField from "./FiltersField"
import { useLocation, useSearchParams } from "react-router"
import NumberField from "./NumberField"

const ListsFilters = ({ handleFilter, filterOpen, setFilterOpen }) => {
  const [searchParams, setsearchParams] = useSearchParams()
  const { page, ...query } = Object.fromEntries(searchParams.entries())
  return (
    <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
      <SheetTrigger asChild>
        <Button
          className={`text-xs lg:text-sm flex items-center justify-center gap-1 hover:cursor-pointer border-border hover:bg-accent bg-transparent border-1 dark:border-border transition-all
            ${Object.keys(query).length > 0 ? "bg-accent text-white dark:bg-accent" : null}`}
          variant="ghost"
        >
          <Funnel />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <form
          id="filters"
          className="w-9/10 mx-auto flex flex-col items-center justify-center gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData.entries())
            console.log(data)
            setsearchParams((params) => {
              params.set("followers.gte", data["followers.gte"])
              params.set("media.gte", data["media.gte"])
              return params
            })
            return setFilterOpen(false)
          }}
        >
          <FiltersField labelText="Followers" labelFor="followers">
            <NumberField
              fieldName="followers"
              title="Min"
              denomination="gte"
              min={0}
              ariaLabel="Followers minimum"
              defaultValue={searchParams.get("followers.gte")}
            />
          </FiltersField>
          <FiltersField labelText="Media" labelFor="media">
            <NumberField
              fieldName="media"
              title="Min"
              denomination="gte"
              min={0}
              ariaLabel="Media minimum"
              defaultValue={searchParams.get("media.gte")}
            />
          </FiltersField>
        </form>
        <SheetFooter>
          <Button type="submit" form="filters">
            Submit
          </Button>
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => setsearchParams("")}
            >
              Clear filters
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default ListsFilters
