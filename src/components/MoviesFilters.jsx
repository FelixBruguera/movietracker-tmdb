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
import { useSearchParams } from "react-router"
import { useMemo, useState } from "react"
import CheckboxWrapper from "./CheckboxWrapper"
import NumberField from "./NumberField"
import PopoverTriggerWrap from "./PopoverTriggerWrap"
import { Popover, PopoverContent } from "../../app/components/ui/popover"
import { toast } from "sonner"
import moviesSchema from "../utils/moviesSchema"

const MoviesFilters = ({ handleFilter, filterOpen, setFilterOpen }) => {
  const [searchParams, setsearchParams] = useSearchParams()
  const maxYear = new Date().getFullYear()
  const genres = filtersData.genres
  const genreIds = useMemo(() => genres.map(genre => genre.id), [genres])
  const [selectedGenres, setSelectedGenres] = useState(searchParams.get("with_genres")?.split(',') || genreIds)
  const [minRating, setMinRating] = useState(searchParams.get("vote_average.gte") || "1")
  const [maxRating, setMaxRating] = useState(searchParams.get("vote_average.lte") || "10")
  const [voteCount, setVouteCount] = useState(searchParams.get("vote_count.gte") || "1")
  const [minDate, setMinDate] = useState(searchParams.get("release_date.gte") || "1850")
  const [maxDate, setMaxDate] = useState(searchParams.get("release_date.lte") || maxYear)
  const languages = filtersData.languages
  const types = ["All", "Movie", "Series"]
  const { page, ...query } = searchParams
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
            data.with_genres = selectedGenres
            data["vote_count.gte"] = voteCount
            data["vote_average.gte"] = minRating
            data["vote_average.lte"] = maxRating
            data["primary_release_date.gte"] = minDate
            data["primary_release_date.lte"] = maxDate
            const validation = moviesSchema.safeParse(data)
            if (!validation.success) {
              return toast("Invalid input")
            }
            return handleFilter(data)
          }}
        >
          {/* <TextInput
            labelText="query"
            name="query"
            defaultValue={searchParams.get('query') || ""}
          />
          <TextInput
            labelText="Search by actor"
            name="with_cast"
            defaultValue={searchParams.get('with_cast') || ""}
          />
          <TextInput
            labelText="Search by director"
            name="with_people"
            defaultValue={searchParams.get('with_people') || ""}
          /> */}
          <FiltersField labelText="Genres" labelFor="with_genres">
            <CheckboxWrapper
              title="Genres"
              items={genres}
              selected={selectedGenres}
              setSelected={setSelectedGenres}
              selectAll={() => setSelectedGenres(genreIds)}
            />
          </FiltersField>
          <FiltersField labelText="Language" labelFor="with_languages">
            <SelectWrapper
              name="with_original_language"
              defaultValue={searchParams.get('with_original_language') || "All"}
              title="Languages"
              items={languages}
            />
          </FiltersField>
          {/* <FiltersField labelText="Type" labelFor="type">
            <SelectWrapper
              name="type"
              defaultValue={searchParams.get('type || "All"}
              title="Type"
              items={types}
            />
          </FiltersField> */}
          <RangeField
            labelText="Release year"
            fieldName="primary_release_date"
            min={0}
            max={maxYear}
            minValue={minDate}
            maxValue={maxDate}
            setMin={setMinDate}
            setMax={setMaxDate}
          />
          <RangeField
            labelText="TMDB Average Rating (1-10)"
            fieldName="vote_average"
            min={1}
            max={10}
            minValue={minRating}
            maxValue={maxRating}
            setMin={setMinRating}
            setMax={setMaxRating}
          />
          <FiltersField labelText="TMDB Vote Count" labelFor="vote_count">
                <Popover>
      <PopoverTriggerWrap>
        {voteCount}
      </PopoverTriggerWrap>
      <PopoverContent>
            <NumberField
              className="w-1/3"
              fieldName="vote_count"
              title="Min"
              denomination="gte"
              min={1}
              value={voteCount}
              onChange={(newValue) => setVouteCount(newValue)}
            />
      </PopoverContent>
    </Popover>
          </FiltersField>
          {/* <RangeField
            labelText="Runtime (Minutes)"
            fieldName="with_runtime"
            min={1}
            max={1256}
            defaultMin={searchParams.get('with_runtime.gte') || 1}
            defaultMax={searchParams.get('with_runtime.lte') || 1256}
          /> */}
        </form>
         <SheetFooter>
            <Button type="submit" form="filters">
              Submit
            </Button>
           <SheetClose asChild>
             <Button
              type="button"
              variant="outline"
              onClick={() => setsearchParams('')}
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