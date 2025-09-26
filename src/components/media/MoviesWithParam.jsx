import { Link, useSearchParams, useParams } from "react-router"
import PaginationWrap from "../shared/PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import ErrorMessage from "../shared/ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import PosterList from "../shared/PosterList"

const MoviesWithParam = ({ endpoint, path = "movies" }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { id } = useParams()
  const {
    data: paramData,
    isLoading: paramDataLoading,
    isError: paramDataError,
  } = useQuery({
    queryKey: [endpoint, id],
    queryFn: () =>
      axios.get(`/api/${endpoint}/${id}`).then((response) => response.data),
    staleTime: 34560 * 60000,
    gcTime: 34560 * 60000, // 24 days
  })
  const { data, isLoading, isError } = useQuery({
    queryKey: [path, id, searchParams.toString()],
    queryFn: () =>
      axios
        .get(`/api/${path}/${endpoint}/${id}`, { params: searchParams })
        .then((response) => response.data),
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

  return (
    <div className="flex flex-col justify-start min-h-dvh">
      <MoviesMenu title={paramData.name} />
      <PosterList movies={movies} path={path} />
      {totalPages > 1 && <PaginationWrap totalPages={totalPages} />}
    </div>
  )
}

export default MoviesWithParam
