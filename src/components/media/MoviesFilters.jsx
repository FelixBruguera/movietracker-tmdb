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
import { Funnel } from "lucide-react"
import filtersData from "../../../lib/filters.json"
import FiltersField from "../shared/FiltersField"
import RangeField from "../shared/RangeField"
import SelectWrapper from "../shared/SelectWrapper"
import { useLocation, useSearchParams } from "react-router"
import { useEffect, useMemo, useRef, useState } from "react"
import CheckboxWrapper from "../shared/CheckboxWrapper"
import NumberField from "../shared/NumberField"
import TriggerWrap from "../shared/TriggerWrap"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/popover"
import { toast } from "sonner"
import moviesSchema from "../../utils/moviesSchema"
import KeywordSearch from "./KeywordSearch"
import ServicesCommand from "./ServicesCommand"
import useRegion from "@stores/region"
import tvSchema from "../../utils/tvSchema"
import FiltersTrigger from "../shared/FiltersTrigger"

const MoviesFilters = ({ handleFilter, filterOpen, setFilterOpen }) => {
  const [searchParams, setsearchParams] = useSearchParams()
  const region = useRegion((state) => state.details.code)
  const location = useLocation()
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
  const isTV = location.pathname.includes("tv")
  const dateField = isTV ? "first_air_date" : "primary_release_date"
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
            data.with_genres = selectedGenres
            data.watch_region = region
            data.with_watch_providers = [...selectedServices]
            data.with_keywords = encodeURIComponent(
              JSON.stringify(selectedKeywords),
            )
            data.sort_by = searchParams.get("sort_by") || "popularity.desc"
            const validation = isTV
              ? tvSchema.safeParse(data)
              : moviesSchema.safeParse(data)
            if (!validation.success) {
              console.log(validation.error)
              return (
                toast(validation.error._zod.def[0].message) ||
                toast("Invalid input")
              )
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
              title="Services"
              selected={selectedServices}
              setSelected={setSelectedServices}
            />
          </FiltersField>
          <FiltersField labelText="Keywords" labelFor="with_keywords">
            <KeywordSearch
              title="Keywords"
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
            fieldName={dateField}
            min={1896}
            max={maxYear}
            defaultMin={searchParams.get(`${dateField}.gte`)}
            defaultMax={searchParams.get(`${dateField}.lte`)}
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
              fieldName="vote_count"
              title="Min"
              denomination="gte"
              min={1}
              ariaLabel="TMDB Vote Count minimum"
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
