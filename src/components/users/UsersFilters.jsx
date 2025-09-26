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

const UsersFilters = ({ filterOpen, setFilterOpen }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { page, sort_order, sort_by, ...query } = Object.fromEntries(searchParams.entries())
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
              params.set("reviews.gte", data["reviews.gte"])
              params.set("logs.gte", data["logs.gte"])
              return params
            })
            return setFilterOpen(false)
          }}
        >
          <FiltersField labelText="Reviews" labelFor="reviews">
            <NumberField
              fieldName="reviews"
              title="Min"
              denomination="gte"
              min={0}
              ariaLabel="Reviews minimum"
              defaultValue={searchParams.get("reviews.gte")}
            />
          </FiltersField>
          <FiltersField labelText="Diary logs" labelFor="logs">
            <NumberField
              fieldName="logs"
              title="Min"
              denomination="gte"
              min={0}
              ariaLabel="Diary logs minimum"
              defaultValue={searchParams.get("logs.gte")}
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

export default UsersFilters
