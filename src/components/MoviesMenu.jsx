import MoviesMenuItem from "./MoviesMenuItem"
import MoviesFilters from "./MoviesFilters"
import filtersData from "../../lib/filters.json"
import SelectSortBy from "./SelectSortBy"
import SortOrderToggle from "./SortOrderToggle"
import { useState } from "react"
import { useSearchParams } from "react-router"
import MovieDetail from "./MovieDetail"
import MoviesWithParamTitle from "./MoviesWithParamTitle"
import SavedSearch from "./SavedSearch"
import { authClient } from "../../lib/auth-client.ts"

const MoviesMenu = ({ title = null }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentGenre = "All" || searchParams.genres
  const [filterOpen, setFilterOpen] = useState(false)
  const { data: session } = authClient.useSession()
  const handleGenre = (newValue) => {
    if (searchParams.genres === newValue) {
      setSearchParams((params) => {
        params.delete("genres")
        params.set("page", 1)
        return params
      })
    } else {
      setSearchParams((params) => {
        params.set("genres", newValue)
        params.set("page", 1)
        return params
      })
    }
  }
  const ranges = filtersData.ranges
  const sort = searchParams.get("sort_by") || "popularity.desc"
  const genres = [
    "Drama",
    "Comedy",
    "Action",
    "Crime",
    "Romance",
    "Western",
    "Documentary",
    "Animation",
  ]
  const handleFilter = (data) => {
    setSearchParams(new URLSearchParams(data).toString())
    setFilterOpen(false)
  }
  return (
    <div className="flex gap-3 lg:gap-0 items-center justify-between w-full p-1 lg:p-0 mx-auto">
      {session && <SavedSearch />}
      {title && <MoviesWithParamTitle title={title} />}
      <div className="flex items-start justify-end gap-2 w-full">
        <MoviesFilters
          key={searchParams}
          handleFilter={handleFilter}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
        />
        <div className="flex items-center justify-end gap-2">
          <SelectSortBy
            value={sort}
            selectedValue={ranges[sort]}
            title="Sort Movies"
            options={ranges}
          />
          <SortOrderToggle />
        </div>
      </div>
    </div>
  )
}

export default MoviesMenu
