// import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import PaginationWrap from "../../src/components/PaginationWrap"
import { useRouter } from "@tanstack/react-router"
import MoviesMenu from "../../src/components/MoviesMenu"
import MoviesSkeleton from "../../src/components/MoviesSkeleton"
import Poster from "../../src/components/Poster"
import ErrorMessage from "../../src/components/ErrorMessage"
import axios from "axios"
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

async function RouteComponent() {
  const router = useRouter()
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["movies", router.query],
  //   queryFn: () =>
  //     axios
  //       .get(`/api/movies?${new URLSearchParams(router.query)}`)
  //       .then((response) => response.data),
  // })

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col justify-between">
  //       <MoviesMenu />
  //       <MoviesSkeleton />
  //     </div>
  //   )
  // }

  // if (isError) {
  //   return <ErrorMessage />
  // }
  // const movies = data[0].movies
  // const totalPages = data[0].info.totalPages

  return (
    <div className="flex flex-col justify-between">
      <MoviesMenu />
      {/* <ul
        className="p-5 flex flex-wrap justify-evenly items-center gap-y-1"
        aria-label="movies"
      >
        {movies.length === 0 ? (
          <li className="h-100">
            <h1 className="font-bold text-lg">No results found</h1>
          </li>
        ) : (
          movies.map((movie) => (
            <li key={movie._id}>
              <Link to={`/movies/${movie._id}`} className="text-center">
                <Poster src={movie.poster} alt={movie.title} />
              </Link>
            </li>
          ))
        )}
      </ul>
      {totalPages > 1 && <PaginationWrap totalPages={totalPages} />} */}
    </div>
  )
}
