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
import filtersData from "../../lib/filters.json"
import FiltersField from "./FiltersField"
import RangeField from "./RangeField"
import SelectWrapper from "./SelectWrapper"
import TextInput from "./TextInput"
import { useRouter } from "@tanstack/react-router"

const MoviesFilters = ({ handleFilter, filterOpen, setFilterOpen }) => {
  const router = useRouter()
  const { search, cast, directors, genre, language, type, released_min, 
    released_max, runtime_min, runtime_max} = router.latestLocation.search
  const genres = filtersData.genres
  const languages = filtersData.languages
  const types = ["All", "Movie", "Series"]
  const { page, ...query } = router.latestLocation.search
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
          className="w-9/10 mx-auto flex flex-col items-start justify-center gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData.entries())
            console.log(data)
            return handleFilter(data)
          }}
        >
          <TextInput
            labelText="Search"
            name="search"
            defaultValue={search || ""}
          />
          <TextInput
            labelText="Search by actor"
            name="cast"
            defaultValue={cast || ""}
          />
          <TextInput
            labelText="Search by director"
            name="directors"
            defaultValue={directors || ""}
          />
          <FiltersField labelText="Genre" labelFor="genres">
            <SelectWrapper
              name="genres"
              defaultValue={genre || "All"}
              title="Genre"
              items={genres}
            />
          </FiltersField>
          <FiltersField labelText="Language" labelFor="languages">
            <SelectWrapper
              name="languages"
              defaultValue={language || "All"}
              title="Language"
              items={languages}
            />
          </FiltersField>
          <FiltersField labelText="Type" labelFor="type">
            <SelectWrapper
              name="type"
              defaultValue={type || "All"}
              title="Type"
              items={types}
            />
          </FiltersField>
          <RangeField
            labelText="Release year"
            fieldName="released"
            min={1896}
            max={2016}
            defaultMin={released_min || 1896}
            defaultMax={released_max || 2016}
          />
          <RangeField
            labelText="IMDB Rating"
            fieldName="imdb.rating"
            min={1}
            max={10}
            defaultMin={ 1}
            defaultMax={10}
          />
          <RangeField
            labelText="Runtime (Minutes)"
            fieldName="runtime"
            min={1}
            max={1256}
            defaultMin={runtime_min || 1}
            defaultMax={runtime_max || 1256}
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
              onClick={() => router.updateLatestLocation({ query: {} })}
            >
              Clear filters
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MoviesFilters