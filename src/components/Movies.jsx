import { Link, useSearchParams } from "react-router"
import PaginationWrap from "./PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import PosterList from "./PosterList"

const Movies = ({ path = "movies" }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: [path, searchParams.toString()],
    queryFn: () =>
      axios
        .get(`/api/${path}`, { params: searchParams })
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
    <div className="flex flex-col justify-start min-h-dvh">
      <MoviesMenu />
      <PosterList movies={movies} path={path} />
      {totalPages > 1 && <PaginationWrap totalPages={totalPages} />}
    </div>
  )
}

export default Movies
