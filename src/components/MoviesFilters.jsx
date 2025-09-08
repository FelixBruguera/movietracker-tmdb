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
import { useSearchParams } from "react-router"
import { useEffect, useMemo, useRef, useState } from "react"
import CheckboxWrapper from "./CheckboxWrapper"
import NumberField from "./NumberField"
import TriggerWrap from "./TriggerWrap"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../app/components/ui/popover"
import { toast } from "sonner"
import moviesSchema from "../utils/moviesSchema"
import KeywordSearch from "./KeywordSearch"
import ServicesCommand from "./ServicesCommand"
import useRegion from "../stores/region"

const MoviesFilters = ({ handleFilter, filterOpen, setFilterOpen }) => {
  const [searchParams, setsearchParams] = useSearchParams()
  const region = useRegion((state) => state.details.code)
  const maxYear = new Date().getFullYear()
  const genres = filtersData.genres
  const genreIds = useMemo(() => genres.map((genre) => genre.id), [genres])
  const initialServices = searchParams.get("with_watch_providers")
    ? new Set(
        searchParams
          .get("with_watch_providers")
          .split(",")
          .map((item) => parseInt(item)),
      )
    : new Set()
  const initialKeywords = searchParams.get("with_keywords")
    ? JSON.parse(decodeURIComponent(searchParams.get("with_keywords")))
    : []
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.get("with_genres")?.split(",") || genreIds,
  )
  const [selectedServices, setSelectedServices] = useState(initialServices)
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      setSelectedServices(new Set())
    }
  }, [region])
  const [selectedKeywords, setSelectedKeywords] = useState(initialKeywords)
  const languages = filtersData.languages
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
            data.with_genres = selectedGenres
            data.watch_region = region
            data.with_watch_providers = [...selectedServices]
            data.with_keywords = encodeURIComponent(
              JSON.stringify(selectedKeywords),
            )
            data.sort_by = searchParams.get("sort_by") || "popularity.desc"
            const validation = moviesSchema.safeParse(data)
            if (!validation.success) {
              console.log(validation)
              return toast("Invalid input")
            }
            return handleFilter(data)
          }}
        >
          <FiltersField labelText="Genres" labelFor="with_genres">
            <CheckboxWrapper
              title="Genres"
              items={genres}
              selected={selectedGenres}
              setSelected={setSelectedGenres}
              selectAll={() => setSelectedGenres(genreIds)}
            />
          </FiltersField>
          <FiltersField labelText="Services" labelFor="with_watch_providers">
            <ServicesCommand
              selected={selectedServices}
              setSelected={setSelectedServices}
            />
          </FiltersField>
          <FiltersField labelText="Keywords" labelFor="with_keywords">
            <KeywordSearch
              selected={selectedKeywords}
              setSelected={setSelectedKeywords}
            />
          </FiltersField>
          <FiltersField labelText="Language" labelFor="with_languages">
            <SelectWrapper
              name="with_original_language"
              defaultValue={searchParams.get("with_original_language") || "xx"}
              title="Languages"
              items={languages}
            />
          </FiltersField>
          <RangeField
            labelText="Release year"
            fieldName="primary_release_date"
            min={1896}
            max={maxYear}
            defaultMin={searchParams.get("primary_release_date.gte")}
            defaultMax={searchParams.get("primary_release_date.lte")}
          />
          <RangeField
            labelText="TMDB Average Rating (1-10)"
            fieldName="vote_average"
            min={1}
            max={10}
            defaultMin={searchParams.get("vote_average.gte")}
            defaultMax={searchParams.get("vote_average.lte")}
          />
          <FiltersField labelText="TMDB Vote Count" labelFor="vote_count">
            <NumberField
              className="w-1/3"
              fieldName="vote_count"
              title="Min"
              denomination="gte"
              min={1}
              defaultValue={searchParams.get("vote_count.gte")}
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

export default MoviesFilters
