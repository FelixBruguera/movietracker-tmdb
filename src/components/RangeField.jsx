import FiltersField from "./FiltersField"
import { Input } from "../../app/components/ui//input"
import { Label } from "../../app/components/ui//label"
import { useRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../../app/components/ui/popover"
import PopoverTriggerWrap from "./PopoverTriggerWrap"
import NumberField from "./NumberField"

const RangeField = ({
  labelText,
  fieldName,
  minValue,
  maxValue,
  min,
  max,
  setMin,
  setMax
}) => {
  // const onMinChange = (newValue) => {
  //   const parsedNewValue = parseInt(newValue)
  //   const parsedMaxValue = parseInt(maxValue)
  //   if (parsedNewValue < min || parsedNewValue > max) {
  //     return null
  //   }
  //   else if (parsedNewValue >= parsedMaxValue) {
  //     setMin(parsedNewValue)
  //     setMax(parsedNewValue)
  //   }
  //   else {
  //     setMin(parsedNewValue || "")
  //   }
  // }
  const onChange = (newValue, otherValue, setFunction, type) => {
    const parsedNewValue = parseInt(newValue)
    const parsedOtherValue = parseInt(otherValue)
    const crossover = type === "max" ? parsedNewValue <= parsedOtherValue : parsedNewValue >= parsedOtherValue
    if (parsedNewValue < min || parsedNewValue > max) {
      return null
    }
    else if (crossover) {
      setMax(parsedNewValue)
      setMin(parsedNewValue)
    }
    else {
      setFunction(parsedNewValue || "")
    }
  }
  return (
    <FiltersField labelText={labelText} className="flex flex-row">
    <Popover>
      <PopoverTriggerWrap>
        {minValue} - {maxValue}
      </PopoverTriggerWrap>
      <PopoverContent>
          <div className="flex">
            <NumberField fieldName={fieldName} value={minValue} onChange={setMin} title="Min" denomination="gte" min={min} max={max}/>
            <NumberField fieldName={fieldName} value={maxValue} onChange={setMax} title="Max" denomination="lte" min={min} max={max} />
          </div>
      </PopoverContent>
    </Popover>
    </FiltersField>
  )
}

export default RangeField