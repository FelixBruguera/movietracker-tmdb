import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../app/components/ui/context-menu"
import Remove from "./Remove"
import { MinusCircle, Trash } from "lucide-react"
import Poster from "./Poster"
import { Link } from "react-router"
import { memo } from "react"

const ListMovieWithContext = memo(({ listName, movie, mutation }) => {
  const path = movie.isTv ? "tv" : "movies"
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <li key={movie.id} className="group">
          <Link to={`/${path}/${movie.id}`} className="text-center">
            <Poster src={movie.poster} alt={movie.title} size="base" />
          </Link>
        </li>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem asChild>
          <Remove
            title={`Removing ${movie.title} from ${listName}`}
            mutation={() => mutation.mutate(movie.id)}
            className="w-full dark:hover:bg-stone-900 hover:cursor-pointer"
          >
            <div className="flex items-center text-sm dark:text-stone-300 gap-2">
              <MinusCircle />
              Remove
            </div>
          </Remove>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
})

export default ListMovieWithContext
