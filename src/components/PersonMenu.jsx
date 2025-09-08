import MoviesMenuItem from "./MoviesMenuItem"
import MoviesFilters from "./MoviesFilters"
import filtersData from "../../lib/filters.json"
import SelectSortBy from "./SelectSortBy"
import SortOrderToggle from "./SortOrderToggle"
import { useState } from "react"
import { useSearchParams } from "react-router"
import MovieDetail from "./MovieDetail"
import MoviesWithParamTitle from "./MoviesWithParamTitle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select"
import { ArrowDownUp, Briefcase, Film } from "lucide-react"
import { Label } from "../../app/components/ui/label"

const PersonMenu = ({ title = null }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  console.log(searchParams)
  const currentScope = searchParams.get("scope") || "Movies"
  const currentDepartment = searchParams.get("department") || "All"
  const departments = filtersData.departments
  const scopes = ["Movies", "TV Shows"]
  const sortOptions = {
    "Best rated": "Best rated",
    "Most votes": "Most votes",
    "Most recent": "Most recent",
  }
  const currentSort = searchParams.get("sort_by") || "Most recent"
  const handleChange = (newValue, field) => {
    console.log(newValue)
    setSearchParams((prev) => {
      prev.set(field, newValue)
      return prev
    })
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row items-center justify-between w-full px-9 mx-auto">
      <div className="flex items-start justify-end gap-2 w-full">
        <div className="flex items-center justify-end gap-3">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="Credits type">Type</Label>
            <Select
              value={currentScope}
              onValueChange={(e) => handleChange(e, "scope")}
            >
              <SelectTrigger
                className="text-xs lg:text-sm w-40 bg-muted dark:bg-card border-1 border-border"
                name="Credits type"
                title="Credits type"
                aria-label="Credits type"
              >
                <SelectValue>
                  <Film />
                  {currentScope}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {scopes.map((scope) => (
                  <SelectItem key={scope} value={scope}>
                    {scope}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="Department">Department</Label>
            <Select
              value={currentDepartment}
              onValueChange={(e) => handleChange(e, "department")}
            >
              <SelectTrigger
                className="text-xs lg:text-sm w-40 bg-muted dark:bg-card border-1 border-border"
                name="Department"
                title="Department"
                aria-label="Department"
              >
                <SelectValue>
                  <Briefcase />
                  {currentDepartment}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="Sort By">Sort by</Label>
            <SelectSortBy
              value={currentSort}
              selectedValue={currentSort}
              title="Sort by"
              options={sortOptions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonMenu
