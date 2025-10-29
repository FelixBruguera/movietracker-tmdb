import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@ui/context-menu"
import Remove from "../shared/Remove"
import { MinusCircle } from "lucide-react"
import { memo } from "react"
import ListMovie from "./ListMovie"

const ListMovieWithContext = memo(({ listName, movie, mutation }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ListMovie movie={movie} />
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
