import { Link } from "react-router"
import Poster from "../../shared/Poster"
import ItemDetail from "./ItemDetail"

const MediaStat = ({ data }) => {
  const mediaId = data.id.split("_")[1]
  const path = data.id.includes("tv") ? "tv" : "movies"
  return (
    <Link
      to={`/${path}/${mediaId}`}
      className="flex flex-col items-center px-2 group"
    >
      <Poster src={data.poster_path} size="xs" type="media" />
      <h3 className="text-base my-1 group-hover:text-accent transition-colors">
        {data.title}
      </h3>
      <ItemDetail name="Times" value={data.total} />
    </Link>
  )
}

export default MediaStat
