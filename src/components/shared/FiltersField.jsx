import { Label } from "@ui/label"

const FiltersField = (props) => {
  return (
    <div className="w-full flex flex-col gap-2 ">
      <Label htmlFor={props.labelFor}>{props.labelText}</Label>
      {props.children}
    </div>
  )
}

export default FiltersField
