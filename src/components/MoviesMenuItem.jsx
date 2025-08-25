import { Button } from "../../app/components/ui/button"

const MoviesMenuItem = ({ title, onClick, isActive }) => {
  return (
    <Button
      onClick={() => onClick(title)}
      variant="ghost"
      className={`w-full text-xs lg:text-sm border-1 border-border dark:border-border hover:bg-accent hover:text-white hover:cursor-pointer transition-all
            ${isActive && "bg-accent text-white hover:text-black dark:hover:text-white hover:bg-transparent dark:hover:bg-transparent"}`}
    >
      {title}
    </Button>
  )
}

export default MoviesMenuItem