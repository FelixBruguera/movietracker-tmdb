import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select"
import { ArrowDownUp, ListFilter } from "lucide-react"
import { memo, useCallback } from "react"
import { useSearchParams } from "react-router"

const SelectFilter = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams()
  const onValueChange = useCallback((newValue) => {
    console.log(newValue)
    setSearchParams((params) => {
      params.set("filter", newValue)
      params.set("page", 1)
      return params
    })
  })
  const options = { all: "All", movies: "Movies", tv: "TV" }
  const value = searchParams.get("filter") || "all"
  return (
    <Select value={value} onValueChange={(e) => onValueChange(e)}>
      <SelectTrigger
        className="text-xs lg:text-sm w-35 lg:w-40 bg-muted dark:bg-card border-1 border-border"
        name="Filter"
        title="Filter"
        aria-label="Filter"
      >
        <SelectValue>
          <ListFilter />
          {options[value]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(options).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})

export default SelectFilter
