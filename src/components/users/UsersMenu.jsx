import SelectSortBy from "../shared/SelectSortBy"
import SortOrderToggle from "../shared/SortOrderToggle"
import { useSearchParams } from "react-router"
import UsersFilters from "./UsersFilters"
import { useState } from "react"

const UsersMenu = () => {
  const [searchParams, setsearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const sortOptions = { date: "Join Date", logs: "Diary logs", reviews: "Reviews" }
  const sort = searchParams.get("sort_by") || "date"
  return (
    <div className="flex items-center justify-end w-full">
      <div className="flex items-center justify-end w-full gap-2">
        <UsersFilters filterOpen={filterOpen} setFilterOpen={setFilterOpen}/>
        <SelectSortBy
          value={sort}
          selectedValue={sortOptions[sort]}
          title="Sort Users"
          options={sortOptions}
        />
        <SortOrderToggle />
      </div>
    </div>
  )
}

export default UsersMenu