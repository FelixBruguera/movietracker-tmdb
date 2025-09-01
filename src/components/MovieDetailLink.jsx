import { Link } from "react-router"
import MovieDetail from "./MovieDetail"

const MovieDetailLink = (props) => {
  return (
    <Link
      to={props.href}
      title={props.title}
      aria-label={props.title}
      className="group"
    >
      <MovieDetail>{props.children}</MovieDetail>
    </Link>
  )
}

export default MovieDetailLink
