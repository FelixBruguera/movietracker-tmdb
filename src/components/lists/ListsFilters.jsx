import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@ui/sheet"
import { Button } from "@ui/button"
import FiltersField from "../shared/FiltersField"
import { useSearchParams } from "react-router"
import NumberField from "../shared/NumberField"
import FiltersTrigger from "../shared/FiltersTrigger"

const ListsFilters = ({ filterOpen, setFilterOpen }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { page, ...query } = Object.fromEntries(searchParams.entries())
  return (
    <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
      <SheetTrigger asChild>
        <FiltersTrigger query={query} />
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
            setSearchParams((params) => {
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
              onClick={() => setSearchParams("")}
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
