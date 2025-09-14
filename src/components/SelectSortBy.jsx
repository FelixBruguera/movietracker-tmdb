import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select"
import { ArrowDownUp } from "lucide-react"
import { memo, useCallback } from "react"
import { useSearchParams } from "react-router"

const SelectSortBy = memo(({ value, selectedValue, title, options }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const onValueChange = useCallback((newValue) => {
    console.log(newValue)
    setSearchParams((params) => {
      params.set("sort_by", newValue)
      params.set("page", 1)
      return params
    })
  })
  return (
    <Select value={value} onValueChange={(e) => onValueChange(e)}>
      <SelectTrigger
        className="text-xs lg:text-sm w-35 lg:w-40 bg-muted dark:bg-card border-1 border-border"
        name={title}
        title={title}
        aria-label={title}
      >
        <SelectValue>
          <ArrowDownUp />
          {selectedValue}
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

export default SelectSortBy
