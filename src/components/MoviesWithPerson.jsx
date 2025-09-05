import { Link, useSearchParams, useParams } from "react-router"
import PaginationWrap from "./PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import MovieList from "./MovieList"
import PersonInfo from "./PersonInfo"
import PersonInfoSkeleton from "./PersonInfoSkeleton"

const MoviesWithPerson = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { person } = useParams()
  const {
    data: personData,
    isLoading: personDataLoading,
    isError: personDataError,
  } = useQuery({
    queryKey: ["person", person],
    queryFn: () =>
      axios.get(`/api/people/${person}`).then((response) => response.data),
  })
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", person, searchParams.toString()],
    queryFn: () =>
      axios
        .get(`/api/movies/people/${person}`, { params: searchParams })
        .then((response) => response.data),
  })
  console.log(data)

  if (isLoading || personDataLoading) {
    return (
      <div className="flex flex-col justify-between">
        <PersonInfoSkeleton />
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
      <title>{personData.name}</title>
      <PersonInfo data={personData} />
      <MoviesMenu />
      <MovieList movies={movies} />
      {totalPages > 1 && (
        <PaginationWrap currentPage={data.page} totalPages={totalPages} />
      )}
    </div>
  )
}

export default MoviesWithPerson
