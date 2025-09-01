import MoviesMenuItem from "./MoviesMenuItem"
import MoviesFilters from "./MoviesFilters"
import filtersData from "../../lib/filters.json"
import SelectSortBy from "./SelectSortBy"
import SortOrderToggle from "./SortOrderToggle"
import { useState } from "react"
import { useSearchParams } from "react-router"
import MovieDetail from "./MovieDetail"
import MoviesWithParamTitle from "./MoviesWithParamTitle"

const MoviesMenu = ({ title = null }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentGenre = "All" || searchParams.genres
  const [filterOpen, setFilterOpen] = useState(false)
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
    console.log([data, new URLSearchParams(data).toString()])
    setSearchParams(new URLSearchParams(data).toString())
    setFilterOpen(false)
  }
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row items-center justify-between w-full px-9 mx-auto">
      {/* <ul className="hidden lg:flex w-full lg:w-full flex-wrap items-center justify-start lg:gap-5">
        {genres.map((genre) => (
          <li key={genre}>
            <MoviesMenuItem
              title={genre}
              onClick={handleGenre}
              isActive={currentGenre === genre}
            />
          </li>
        ))}
      </ul> */}
      {title && <MoviesWithParamTitle title={title} />}
      <div className="flex items-start justify-end gap-2 w-full">
        <MoviesFilters
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
