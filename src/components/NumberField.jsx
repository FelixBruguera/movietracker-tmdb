import { Label } from "../../app/components/ui/label"
import { Input } from "../../app/components/ui/input"

const NumberField = ({
  fieldName,
  title,
  denomination,
  min,
  max,
  defaultValue,
  className,
}) => {
  return (
    <div className="flex w-full justify-evenly">
      <Label
        className="text-muted-foreground text-xs lg:text-sm"
        htmlFor={`${fieldName}.${denomination}`}
      >
        {title}
      </Label>
      <Input
        name={`${fieldName}.${denomination}`}
        id={`${fieldName}.${denomination}`}
        type="number"
        className={`w-3/5 text-sm border-1 border-border ${className}`}
        min={min}
        max={max}
        defaultValue={defaultValue || min}
        required
      ></Input>
    </div>
  )
}

export default NumberField
