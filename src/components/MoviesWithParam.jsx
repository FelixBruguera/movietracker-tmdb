import { Link, useSearchParams, useParams } from "react-router"
import PaginationWrap from "./PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import MovieList from "./MovieList"

const MoviesWithParam = ( { name, title, titleBeforeParam } ) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const params = useParams()
    const param = params[name]
    const { data: paramData, isLoading: paramDataLoading, isError: paramDataError } = useQuery({
        queryKey: [name, param],
        queryFn: () => axios.get(`/api/${name}/${param}`).then(response => response.data)
    })
    const { data, isLoading, isError } = useQuery({
        queryKey: ["movies", searchParams.toString()],
        queryFn: () => axios.get(`/api/movies/${name}/${param}`, { params: searchParams}).then(response => response.data)
    })
    console.log(data)

  if (isLoading || paramDataLoading) {
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
  const formattedTitle = titleBeforeParam ? `${title} ${paramData.name}` : `${paramData.name} ${title}`

  return (
    <div className="flex flex-col justify-between">
      <MoviesMenu title={paramData.name}/>
      <MovieList movies={movies} />
      {totalPages > 1 && <PaginationWrap currentPage={data.page} totalPages={totalPages} />}
    </div>
  )
}

export default MoviesWithParam