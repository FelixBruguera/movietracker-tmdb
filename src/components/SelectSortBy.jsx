import { useRouter } from "@tanstack/react-router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select"
import { ArrowDownUp } from "lucide-react"
import { memo, useCallback } from "react"

const SelectSortBy = memo(({ value, selectedValue, title, options }) => {
  const router = useRouter()
  const onValueChange = useCallback((newValue) => {
    router.navigate({ search: (prev) => {
        return { ...prev, sortBy: newValue, page: 1 } }
    })
  })
  return (
    <Select value={value} onValueChange={(e) => onValueChange(e)}>
      <SelectTrigger
        className="text-xs lg:text-sm w-40 bg-muted dark:bg-card border-1 border-border"
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