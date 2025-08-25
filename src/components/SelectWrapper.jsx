import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select"

const SelectWrapper = ({ name, defaultValue, title, items, className }) => {
  return (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger
        className={`w-full border-1 border-border ${className}`}
        title={title}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem value={item}>{item}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectWrapper