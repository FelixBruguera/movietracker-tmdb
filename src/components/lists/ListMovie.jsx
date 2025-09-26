import Poster from "../shared/Poster"
import { Link } from "react-router"
import { memo } from "react"

const ListMovie = memo(({ movie }) => {
  const path = movie.isTv ? "tv" : "movies"
  return (
    <li key={movie.id} className="group">
      <Link to={`/${path}/${movie.id}`} className="text-center">
        <Poster src={movie.poster} alt={movie.title} size="base" />
      </Link>
    </li>
  )
})

export default ListMovie
