import { Funnel } from "lucide-react"
import { Button } from "@ui/button"

const FiltersTrigger = ({ query, ...props }) => 
{ return (
    <Button
        {...props}
        className={`text-xs lg:text-sm flex items-center justify-center gap-1 hover:cursor-pointer border-border hover:bg-accent bg-transparent border-1 dark:border-border transition-colors
        ${Object.keys(query).length > 0 ? "bg-accent text-white dark:bg-accent" : null}`}
        variant="ghost"
    >
        <Funnel />
        Filters
    </Button>
)}

export default FiltersTrigger