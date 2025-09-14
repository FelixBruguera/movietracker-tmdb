import { Link } from "react-router"
import Poster from "./Poster.jsx"

const SearchItem = ({ itemData, setOpen }) => {
  const path =
    itemData.media_type === "person"
      ? "people"
      : itemData.media_type === "movie"
        ? "movies"
        : "tv"
  const name = itemData.title || itemData.name
  const imgSettings =
    path === "people"
      ? { type: "person", src: itemData.profile_path }
      : { type: "movie", src: itemData.poster_path }
  return (
    <li
      className="w-1/3 lg:w-1/4 p-2 rounded-lg items-center h-2/4 border-transparent border-1
            group hover:border-border hover:cursor-pointer transition-all"
    >
      <Link
        to={`/${path}/${itemData.id}`}
        title={name}
        className="w-full flex flex-col gap-2"
        onClick={() => setOpen(false)}
      >
        <Poster src={imgSettings.src} type={imgSettings.type} size="xs" />
        <div className="flex flex-col justify-between items-center w-full gap-2">
          <h3 className="text-sm font-bold text-nowrap max-w-10/10 overflow-hidden text-ellipsis group-hover:text-accent transition-all">
            {name}
          </h3>
          <p className="text-xs dark:text-gray-300">{itemData.media_type}</p>
        </div>
      </Link>
    </li>
  )
}

export default SearchItem
