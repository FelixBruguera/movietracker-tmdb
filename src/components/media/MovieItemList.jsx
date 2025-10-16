import { Link } from "react-router"
import PersonLink from "../people/PersonLink"
import MovieListTitle from "./MovieListTitle"
import HorizontalList from "../shared/HorizontalList"

const MovieItemList = ({ path, title, items }) => {
  return (
    <div>
      <Link
        to={path}
        className="hover:text-accent hover:cursor-pointer transition-colors"
      >
        <MovieListTitle title={title} />
      </Link>
      <HorizontalList>
        {items.length > 0 ? (
          items.map((item) => (
            <PersonLink
              key={item.credit_id}
              name={item.name}
              id={item.id}
              image={item.profile_path}
              role={item.job || item.character}
            />
          ))
        ) : (
          <li>
            <p className="text-muted-foreground">No data</p>
          </li>
        )}
      </HorizontalList>
    </div>
  )
}

export default MovieItemList
