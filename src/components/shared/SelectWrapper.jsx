import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select"

const SelectWrapper = ({ name, defaultValue, title, items, className }) => {
  return (
    <div className="flex items-center justify-center">
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger
          className={`w-full border-1 border-border ${className}`}
          title={title}
          aria-label={title}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem value={item.id}>{item.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectWrapper
