import { Link, useSearchParams, useParams } from "react-router"
import PaginationWrap from "./PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import MovieList from "./MovieList"

const MoviesWithKeyword = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { keyword } = useParams()
  const {
    data: paramData,
    isLoading: paramDataLoading,
    isError: paramDataError,
  } = useQuery({
    queryKey: ["keyword", keyword],
    queryFn: () =>
      axios.get(`/api/keyword/${keyword}`).then((response) => response.data),
    staleTime: 34560 * 60000,
    gcTime: 34560 * 60000, // 24 days
  })
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchParams.toString()],
    queryFn: () =>
      axios
        .get(`/api/movies/keyword/${keyword}`, { params: searchParams })
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
    <div className="flex flex-col justify-between">
      <MoviesMenu title={paramData.name} />
      <MovieList movies={movies} />
      {totalPages > 1 && (
        <PaginationWrap currentPage={data.page} totalPages={totalPages} />
      )}
    </div>
  )
}

export default MoviesWithKeyword
