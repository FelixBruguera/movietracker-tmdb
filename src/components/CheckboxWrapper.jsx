import { ChevronDown } from "lucide-react"
import { Button } from "../../app/components/ui/button"
import { Checkbox } from "../../app/components/ui/checkbox"
import { Label } from "../../app/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../app/components/ui/popover"
import TriggerWrap from "./TriggerWrap"

const CheckboxWrapper = ({
  title,
  items,
  selected,
  setSelected,
  selectAll,
}) => {
  console.log(selected)
  return (
    <Popover>
      <PopoverTrigger title={title} aria-label={title}>
        <TriggerWrap>{selected.length} Selected</TriggerWrap>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <Button
              variant="outline"
              className="text-xs"
              disabled={selected.length === 0}
              onClick={() => setSelected([])}
            >
              Clear
            </Button>
            <Button className="text-xs" onClick={() => selectAll()}>
              Select All
            </Button>
          </div>
          <ul className="flex flex-wrap">
            {items.map((item) => {
              return (
                <li
                  key={item.id}
                  className="w-1/2 flex items-center justify-between py-2 hover:bg-secondary px-2 transition-colors group"
                >
                  <Label
                    htmlFor={item.id}
                    className="hover:text-accent hover:cursor-pointer transition-colors"
                  >
                    {item.name}
                  </Label>
                  <Checkbox
                    className="group-hover:border-muted-foreground hover:cursor-pointer transition-colors"
                    checked={selected.includes(item.id)}
                    name="with_genres"
                    value={item.id}
                    id={item.id}
                    onCheckedChange={(checked) => {
                      console.log([
                        checked,
                        selected,
                        selected.includes(item.id),
                      ])
                      return selected.includes(item.id)
                        ? setSelected((previousItems) =>
                            previousItems.filter(
                              (previousItem) => previousItem !== item.id,
                            ),
                          )
                        : setSelected((previousItems) => [
                            ...previousItems,
                            item.id,
                          ])
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CheckboxWrapper
