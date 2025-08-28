import { ChevronDown } from "lucide-react"
import { PopoverTrigger } from "../../app/components/ui/popover"

const PopoverTriggerWrap = (props) => {
    return (
        <PopoverTrigger className="flex bg-transparent dark:bg-input/30 items-center shadow-xs h-9 justify-between text-sm border-1 border-border px-3 py-2 rounded-sm dark:hover:bg-input/50">
            {props.children}
            <ChevronDown className="text-muted-foreground"/>
        </PopoverTrigger>
    )
}

export default PopoverTriggerWrap
