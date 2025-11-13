import { format } from "date-fns"
import { Calendar, Eye, FilmIcon, Lock, Users } from "lucide-react"
import { memo } from "react"
import { Link } from "react-router"
import Poster from "../shared/Poster"
import Avatar from "../shared/Avatar"

const ListCardItem = (props) => {
  return (
    <div className="flex items-center text-sm md:text-base gap-1 text-stone-600 dark:text-stone-300 dark:group-hover:text-stone-300 transition-colors">
      {props.children}
    </div>
  )
}

const fillPosters = (posters) => {
  if (posters.length < 5) {
    for (let i = posters.length; i < 5; i++) {
      posters.push(null)
    }
  }
  return posters
}

const ListCard = memo(({ list }) => {
  const date = format(new Date(list.createdAt), "MMMM u")
  const posters = JSON.parse(list.posters)
  const filledPosters = fillPosters(posters)
  return (
    <li
      key={list.id}
      className="w-9/10 mx-auto md:w-4/10 lg:w-32/100 h-fit flex flex-col gap-1 border-1 rounded-lg border-border dark:hover:border-stone-700
      bg-card-bg hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-white transition-colors group shadow-sm"
    >
      <Link
        to={`/lists/${list.id}`}
        className="p-4 flex flex-col gap-2"
        title={list.name}
      >
        <ul className="flex">
          {filledPosters?.map((poster, i) => (
            <li key={i} className="min-w-1/5">
              {poster === null ? (
                <div className="border-1 border-neutral-200 dark:border-neutral-800 h-30 lg:h-34 w-21 lg:w-23 rounded-sm"></div>
              ) : (
                <Poster src={poster} size="listPoster" />
              )}
            </li>
          ))}
        </ul>
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
            <Avatar src={list.userAvatar}/>
            <p>{list.user}</p>
          </ListCardItem>
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
