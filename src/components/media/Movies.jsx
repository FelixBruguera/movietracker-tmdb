import { useSearchParams } from "react-router"
import PaginationWrap from "../shared/PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import ErrorMessage from "../shared/ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import PosterList from "../shared/PosterList"

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
      <div className="flex flex-col h-dvh">
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
      <title>Movie Tracker</title>
      <meta name="description" content="Discover, Track and Rate Movies and TV Shows"/>
      <MoviesMenu />
      <PosterList movies={movies} path={path} />
      {totalPages > 1 && <PaginationWrap totalPages={totalPages} />}
    </div>
  )
}

export default Movies
