import FiltersField from "./FiltersField"
import { Input } from "@ui//input"
import { Label } from "@ui//label"
import { useRef, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/popover"
import TriggerWrap from "./TriggerWrap"
import NumberField from "./NumberField"

const RangeField = ({
  labelText,
  fieldName,
  min,
  max,
  defaultMin,
  defaultMax,
}) => {
  return (
    <FiltersField labelText={labelText} className="flex flex-row">
      <div className="flex">
        <NumberField
          fieldName={fieldName}
          title="Min"
          denomination="gte"
          min={min}
          max={max}
          ariaLabel={`${labelText} minimum`}
          defaultValue={defaultMin || min}
        />
        <NumberField
          fieldName={fieldName}
          title="Max"
          denomination="lte"
          min={min}
          max={max}
          ariaLabel={`${labelText} maximum`}
          defaultValue={defaultMax || max}
        />
      </div>
    </FiltersField>
  )
}

export default RangeField
