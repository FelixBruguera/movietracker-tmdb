import { Link, useSearchParams, useParams } from "react-router"
import PaginationWrap from "./PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import MovieList from "./MovieList"

const MoviesWithParam = ( { name, endpoint, title, titleBeforeParam } ) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const params = useParams()
    const param = params[name]
    const { data, isLoading, isError } = useQuery({
        queryKey: ["movies", searchParams.toString()],
        queryFn: () => axios.get(`/api/movies/${endpoint}/${param}`, { params: searchParams}).then(response => response.data)
    })
    console.log(data)
    const formattedTitle = titleBeforeParam ? `${title} ${param}` : `${param} ${title}`

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
      <MoviesMenu title={formattedTitle}/>
      <MovieList movies={movies} />
      {totalPages > 1 && <PaginationWrap currentPage={data.page} totalPages={totalPages} />}
    </div>
  )
}

export default MoviesWithParam