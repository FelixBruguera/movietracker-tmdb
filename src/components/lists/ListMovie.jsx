import Poster from "../shared/Poster"
import { Link } from "react-router"
import { memo } from "react"

const ListMovie = memo(({ movie }) => {
  const path = movie.id.includes("tv") ? "tv" : "movies"
  const id = movie.id.split("_")[1]
  return (
    <li className="group">
      <Link to={`/${path}/${id}`} className="text-center">
        <Poster src={movie.poster} alt={movie.title} size="base" />
      </Link>
    </li>
  )
})

export default ListMovie
