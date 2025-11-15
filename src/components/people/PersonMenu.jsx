import MoviesMenuItem from "../media/MoviesMenuItem"
import MoviesFilters from "../media/MoviesFilters"
import filtersData from "../../../lib/filters.json"
import SelectSortBy from "../shared/SelectSortBy"
import SortOrderToggle from "../shared/SortOrderToggle"
import { useState } from "react"
import { useSearchParams } from "react-router"
import MovieDetail from "../media/MovieDetail"
import MoviesWithParamTitle from "../media/MoviesWithParamTitle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select"
import { ArrowDownUp, Briefcase, Film } from "lucide-react"
import { Label } from "@ui/label"

const SelectTriggerWrapper = (props) => (
  <SelectTrigger
    className="text-xs lg:text-sm w-30 lg:w-40 bg-muted dark:bg-card border-1 border-border"
    name={props.name}
    title={props.name}
    aria-label={props.name}
  >
    <SelectValue>{props.children}</SelectValue>
  </SelectTrigger>
)

const PersonMenu = ({ title = null }) => {
  const [searchParams, setSearchParams] = useSearchParams()
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
    setSearchParams((params) => {
      params.set(field, newValue)
      params.set("page", "1")
      return params
    })
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row items-center justify-between w-full px-5 lg:px-0 mx-auto">
      <div className="flex items-start justify-end gap-2 w-full">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-start lg:justify-end gap-3">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="Credits type">Type</Label>
            <Select
              value={currentScope}
              onValueChange={(e) => handleChange(e, "scope")}
            >
              <SelectTriggerWrapper name="Credits type">
                <Film />
                {currentScope}
              </SelectTriggerWrapper>
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
              <SelectTriggerWrapper name="Department">
                <Briefcase />
                {currentDepartment}
              </SelectTriggerWrapper>
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
