import { Link, useSearchParams } from "react-router"
import PaginationWrap from "./PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import MovieList from "./MovieList"

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get("page")
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchParams.toString()],
    queryFn: () =>
      axios
        .get("/api/movies", { params: searchParams })
        .then((response) => response.data),
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

  if (isError) {
    return <ErrorMessage />
  }
  const movies = data.results
  const totalPages = data.total_pages

  return (
    <div className="flex flex-col justify-between">
      <MoviesMenu />
      <MovieList movies={movies} />
      {totalPages > 1 && (
        <PaginationWrap currentPage={data.page} totalPages={totalPages} />
      )}
    </div>
  )
}

export default Movies
