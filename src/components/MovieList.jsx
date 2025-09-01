import { Link } from "react-router"
import Poster from "./Poster"

const MovieList = ({ movies }) => {
  return (
    <ul
      className="p-5 flex flex-wrap justify-evenly items-center gap-y-1"
      aria-label="movies"
    >
      {movies.length === 0 ? (
        <li className="h-100">
          <h1 className="font-bold text-lg">No results found</h1>
        </li>
      ) : (
        movies.map((movie) => (
          <li key={movie.id}>
            <Link
              to={`/movies/${movie.id}`}
              className="text-center"
              preventScrollReset={true}
            >
              <Poster src={movie.poster_path} alt={movie.title} />
            </Link>
          </li>
        ))
      )}
    </ul>
  )
}

export default MovieList
