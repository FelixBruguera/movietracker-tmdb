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
import filtersData from "../../../lib/filters.json"
import FiltersField from "../shared/FiltersField"
import RangeField from "../shared/RangeField"
import SelectWrapper from "../shared/SelectWrapper"
import { useSearchParams } from "react-router"
import { useMemo, useState } from "react"
import CheckboxWrapper from "../shared/CheckboxWrapper"
import { toast } from "sonner"
import moviesSchema from "../../utils/moviesSchema"
import tvSchema from "../../utils/tvSchema"
import FiltersTrigger from "../shared/FiltersTrigger"
import SelectFilter from "../shared/SelectFilter"
import NumberField from "../shared/NumberField"
import { profileReviewsSchema } from "../../utils/profileSchema"

const ReviewFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const maxYear = new Date().getFullYear()
    const genres = filtersData.genres
    const fullGenres = [{id: "0", name: "All"}].concat(genres)
    const mediaTypes = [{ id: "all", name: "All"}, {id: "movies", name: "Movies"}, {id: "tv", name: "TV" }]
    const { page, ...query } = Object.fromEntries(searchParams.entries())
  return (
    <Sheet>
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
            data.sort_by = searchParams.get("sort_by") || "date"
            console.log(data)
            const validation = profileReviewsSchema.safeParse(data)
            if (!validation.success) {
              console.log(validation.error)
              return (
                toast(validation.error._zod.def[0].message) ||
                toast("Invalid input")
              )
            }
            return setSearchParams(new URLSearchParams(data).toString())
          }}
        >
          <FiltersField labelText="Genre" labelFor="with_genres">
            <SelectWrapper
              name="with_genres"
              defaultValue={searchParams.get("with_genres") || "0"}
              title="Genre"
              items={fullGenres}
            />
          </FiltersField>
        <FiltersField labelText="Media type" labelFor="media_type">
            <SelectWrapper
              name="media_type"
              defaultValue={searchParams.get("media_type") || "all"}
              title="Media Type"
              items={mediaTypes}
            />
        </FiltersField>
          <RangeField
            labelText="Release year"
            fieldName="release_year"
            min={1896}
            max={maxYear}
            defaultMin={searchParams.get("release_year.gte")}
            defaultMax={searchParams.get("release_year.lte")}
          />
          <RangeField
            labelText="Rating"
            fieldName="rating"
            min={1}
            max={10}
            defaultMin={searchParams.get("rating.gte")}
            defaultMax={searchParams.get("rating.lte")}
          />
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

export default ReviewFilters
