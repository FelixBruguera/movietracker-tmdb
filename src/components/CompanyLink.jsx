import { Link } from "react-router"
import Poster from "./Poster"
import MovieDetailLink from "./MovieDetailLink"
import MovieDetail from "./MovieDetail"

const CompanyLink = ({ name, id, path = "movies/company" }) => {
  return (
    <Link
      to={`/${path}/${id}`}
      title={name}
      aria-label={name}
      className="group"
    >
      <li className="text-sm items-center gap-1 rounded-sm group">
        <MovieDetail>{name}</MovieDetail>
      </li>
    </Link>
  )
}

export default CompanyLink
