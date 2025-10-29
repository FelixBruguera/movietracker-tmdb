import { format } from "date-fns"
import { Calendar, Eye, FilmIcon, Lock, Users } from "lucide-react"
import { memo } from "react"
import { Link } from "react-router"

const ListCardItem = (props) => {
  return (
    <div className="flex items-center text-sm md:text-base gap-1 text-stone-600 dark:text-stone-300 dark:group-hover:text-stone-300 transition-colors">
      {props.children}
    </div>
  )
}

const ListCard = memo(({ list }) => {
  const date = format(new Date(list.createdAt), "MMMM u")
  return (
    <li
      key={list.id}
      className="w-9/10 mx-auto md:w-100 h-fit flex flex-col gap-1 border-1 rounded-lg border-border dark:hover:border-stone-700
      bg-zinc-200 dark:bg-secondary hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-white transition-colors group"
    >
      <Link
        to={`/lists/${list.id}`}
        className="p-4 flex flex-col gap-2"
        title={list.name}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 max-w-8/10">
            <h3 className="text-lg md:text-xl text-nowrap overflow-hidden text-ellipsis font-bold">
              {list.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {list.isPrivate && <Lock aria-label="Private list" />}
            {list.isWatchlist && <Eye aria-label="Watchlist" />}
          </div>
        </div>
        <p className="dark:text-stone-300 text-nowrap max-w-full overflow-hidden text-ellipsis">
          {list.description}
        </p>
        <div className="flex gap-3">
          <ListCardItem>
            <FilmIcon />
            <p aria-label="Media">{list.media}</p>
          </ListCardItem>
          {!list.isPrivate && (
            <ListCardItem>
              <Users />
              <p aria-label="Followers">{list.followers}</p>
            </ListCardItem>
          )}
          <ListCardItem>
            <Calendar />
            <p aria-label="Created at">{date}</p>
          </ListCardItem>
        </div>
      </Link>
    </li>
  )
})

export default ListCard
