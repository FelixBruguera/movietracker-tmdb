import { Link, useSearchParams, useParams } from "react-router"
import PaginationWrap from "../shared/PaginationWrap"
import MoviesSkeleton from "../media/MoviesSkeleton"
import ErrorMessage from "../shared/ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import PosterList from "../shared/PosterList"
import PersonInfo from "./PersonInfo"
import PersonMenu from "./PersonMenu"

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
        .get(`/api/people/${person}/credits`, { params: searchParams })
        .then((response) => response.data),
  })

  if (isLoading || personDataLoading) {
    return (
      <div className="flex flex-col justify-between">
        <PersonInfo data={personData} isLoading={personDataLoading} />
        <PersonMenu />
        <MoviesSkeleton />
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage />
  }
  const movies = data.results
  const totalPages = data.total_pages
  const scope = searchParams.get("scope")
  const type = scope === "TV Shows" ? "tv" : "movies"

  return (
    <div className="flex flex-col justify-start min-h-dvh">
      <title>{personData.name}</title>
      <PersonInfo data={personData} isLoading={personDataLoading} />
      <PersonMenu />
      <PosterList movies={movies} path={type} keyPath="credit_id" />
      {totalPages > 1 && <PaginationWrap totalPages={totalPages} />}
    </div>
  )
}

export default MoviesWithPerson
