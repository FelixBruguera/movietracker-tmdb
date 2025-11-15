import { ChevronDown, CircleQuestionMark, SearchIcon } from "lucide-react"
import { Button } from "@ui/button"
import { Checkbox } from "@ui/checkbox"
import { Label } from "@ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover"
import TriggerWrap from "./TriggerWrap"
import RadioItem from "./RadioItem"
import AndOrContainer from "./AndOrContainer"

const CheckboxWrapper = ({
  title,
  items,
  selected,
  setSelected,
  selectAll,
  andOr,
  setAndOr,
}) => {
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
          <ul className="flex flex-wrap w-full">
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
                    onCheckedChange={() => {
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
          <AndOrContainer>
            <RadioItem
              name="and_or"
              value="or"
              labelText="Or"
              checked={andOr === "or"}
              onChange={setAndOr}
            />
            <RadioItem
              name="and_or"
              value="and"
              labelText="And"
              checked={andOr === "and"}
              onChange={setAndOr}
            />
          </AndOrContainer>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CheckboxWrapper
