import { Input } from "../../app/components/ui/input"
import { Label } from "../../app/components/ui/label"

const AuthInput = (props) => {
  const { labelText, ...inputProps } = props
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <Label
        htmlFor={inputProps.id}
        className="text-stone-600 dark:text-gray-300"
      >
        {labelText}
      </Label>
      <Input
        {...inputProps}
        required
        className="bg-transparent border-border dark:bg-transparent border-2 dark:border-ring 2xl:p-5"
      />
    </div>
  )
}

export default AuthInput
