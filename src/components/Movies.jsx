import { Link, useSearchParams } from "react-router"
import PaginationWrap from "./PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const Movies = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = searchParams.get("page")
    const { data, isLoading, isError } = useQuery({
        queryKey: ["movies", searchParams.toString()],
        queryFn: () => axios.get("/api/movies", { params: searchParams}).then(response => response.data)
    })
    console.log(data)

  if (isLoading) {
    return (
      <div className="flex flex-col justify-between">
        <MoviesMenu />
        <MoviesSkeleton />
      </div>
    )
  }

  // if (isError) {
  //   return <ErrorMessage />
  // }
  const movies = data.results
  const totalPages = data.total_pages

  return (
    <div className="flex flex-col justify-between">
      <MoviesMenu />
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
              <Link to={`/movies/${movie.id}`} className="text-center">
                <Poster src={movie.poster_path} alt={movie.title} />
              </Link>
            </li>
          ))
        )}
      </ul>
      {totalPages > 1 && <PaginationWrap currentPage={data.page} totalPages={totalPages} />}
    </div>
  )
}

export default Movies