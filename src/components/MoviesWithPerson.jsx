import { Link, useSearchParams, useParams } from "react-router"
import PaginationWrap from "./PaginationWrap"
import MoviesMenu from "./MoviesMenu"
import MoviesSkeleton from "./MoviesSkeleton"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import PosterList from "./PosterList"
import PersonInfo from "./PersonInfo"
import PersonInfoSkeleton from "./PersonInfoSkeleton"
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
  console.log(data)

  if (isLoading || personDataLoading) {
    return (
      <div className="flex flex-col justify-between">
        <PersonInfo data={personData} />
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
    <div className="flex flex-col justify-between">
      <title>{personData.name}</title>
      <PersonInfo data={personData} />
      <PersonMenu />
      <PosterList movies={movies} path={type} keyPath="credit_id" />
      {totalPages > 1 && (
        <PaginationWrap currentPage={data.page} totalPages={totalPages} />
      )}
    </div>
  )
}

export default MoviesWithPerson
