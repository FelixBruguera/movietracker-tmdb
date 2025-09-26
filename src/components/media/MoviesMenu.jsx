import MoviesMenuItem from "./MoviesMenuItem.jsx"
import MoviesFilters from "./MoviesFilters.jsx"
import filtersData from "../../../lib/filters.json"
import SelectSortBy from "../shared/SelectSortBy.jsx"
import SortOrderToggle from "../shared/SortOrderToggle.jsx"
import { useState } from "react"
import { useSearchParams } from "react-router"
import MovieDetail from "./MovieDetail.jsx"
import MoviesWithParamTitle from "./MoviesWithParamTitle.jsx"
import SavedSearch from "./SavedSearch.jsx"
import { authClient } from "../../../lib/auth-client.ts"

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
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 items-center lg:items-center lg:justify-between w-full p-1 lg:p-0 mx-auto">
      <div className="w-full flex items-center justify-center lg:justify-between gap-5 lg:gap-0">
        {session && <SavedSearch />}
        {title && <MoviesWithParamTitle title={title} />}
      </div>
      <div className="flex items-start justify-end gap-2 w-fit">
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
