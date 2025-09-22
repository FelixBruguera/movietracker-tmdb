import SelectSortBy from "./SelectSortBy.jsx"
import SortOrderToggle from "./SortOrderToggle.jsx"
import ListDialog from "./ListDialog.jsx"
import MoviesMenuItem from "./MoviesMenuItem.jsx"
import { authClient } from "../../lib/auth-client.ts"
// import useListDebounce from "../../hooks/useListDebounce"
import { memo, useEffect, useMemo, useState } from "react"
import { Input } from "../../app/components/ui/input.tsx"
import { Button } from "../../app/components/ui/button.tsx"
import { useSearchParams } from "react-router"
import MoviesFilters from "./MoviesFilters.jsx"
import ListsFilters from "./ListsFIlters.jsx"

const ListsMenu = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const { data: session } = authClient.useSession()
  const sortOptions = useMemo(() => {
    return {
      followers: "Followers",
      date: "Creation date",
      movies: "Movies",
    }
  }, [])
  const sort = searchParams.get("sort_by") || "date"
  const filters = { "Your lists": "user", Following: "following" }
  const currentFilter = searchParams.get("filter")
  const handleFilter = (newValue) => {
    const value = filters[newValue]
    if (currentFilter === value) {
      setSearchParams((params) => {
        params.delete("filter")
        return params
      })
    } else {
      setSearchParams((params) => {
        params.set("filter", value)
        params.set("page", 1)
        return params
      })
    }
  }
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-2 lg:gap-0">
      <div className="w-full lg:w-2/10">
        <ul className="flex w-full lg:w-fit items-center justify-evenly gap-5 lg:justify-between">
          {session &&
            Object.keys(filters).map((filter) => (
              <li key={filter}>
                <MoviesMenuItem
                  title={filter}
                  onClick={handleFilter}
                  isActive={currentFilter === filters[filter]}
                />
              </li>
            ))}
        </ul>
      </div>
      <div className="flex items-center justify-end w-full gap-2 lg:w-fit">
        {session && <ListDialog />}
        <ListsFilters filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
        <SelectSortBy
          value={sort}
          selectedValue={sortOptions[sort]}
          title="Sort Lists"
          options={sortOptions}
        />
        <SortOrderToggle />
      </div>
    </div>
  )
})

export default ListsMenu
