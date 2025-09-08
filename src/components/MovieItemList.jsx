import { Link } from "react-router"
import PersonLink from "./PersonLink"
import MovieListTitle from "./MovieListTitle"
import HorizontalList from "./HorizontalList"

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
        {items.map((item) => (
          <PersonLink
            name={item.name}
            id={item.id}
            image={item.profile_path}
            role={item.job}
          />
        ))}
      </HorizontalList>
    </div>
  )
}

export default MovieItemList
