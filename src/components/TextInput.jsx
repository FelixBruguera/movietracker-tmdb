import FiltersField from "./FiltersField"
import { Input } from "../../app/components/ui/input"

const TextInput = ({ labelText, name, defaultValue }) => {
  return (
    <FiltersField labelText={labelText} labelFor={name}>
      <Input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="border-1 border-border"
      />
    </FiltersField>
  )
}

export default TextInput
