import { ChevronDown } from "lucide-react"

const TriggerWrap = (props) => {
  return (
    <div className="flex gap-2 bg-transparent dark:bg-input/30 items-center shadow-xs h-9 justify-between text-sm border-1 border-border px-3 py-2 rounded-sm dark:hover:bg-input/50">
      {props.children}
      <ChevronDown className="text-muted-foreground" />
    </div>
  )
}

export default TriggerWrap
