import { Link } from "react-router"
import MovieDetail from "./MovieDetail"
import Poster from "./Poster"

const PersonLink = ({ name, image, id, role = null }) => {
  return (
    <Link
      to={`/movies/people/${id}`}
      title={name}
      aria-label={name}
      className="group"
    >
      <li className="text-sm flex flex-col items-center gap-1 rounded-sm group w-30">
        <Poster src={image} size="xs" alt={name} type="person" />
        <p className="group-hover:text-accent transition-colors whitespace-nowrap text-ellipsis overflow-hidden max-w-9/10">
          {name}
        </p>
        {role && (
          <p className="text-muted-foreground whitespace-nowrap text-ellipsis overflow-hidden max-w-9/10">
            {role}
          </p>
        )}
      </li>
    </Link>
  )
}

export default PersonLink
