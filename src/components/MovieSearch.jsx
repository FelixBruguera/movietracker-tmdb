import { Input } from "../../app/components/ui/input"
import { useState } from "react"
import useDebounce from "../../hooks/useDebounce"
import MovieSearchItem from "./MovieSearchItem"
import MovieSearchSkeleton from "./MovieSearchSkeleton"

const MovieSearch = ({ setSelected }) => {
  const [search, setSearch] = useState("")
  const { data, isLoading, isError } = useDebounce(search)
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
      <div className="mx-auto w-full lg:w-1/3 flex flex-col items-center gap-1">
        <Input
          type="text"
          id="movie"
          placeholder="Movie"
          value={search}
          className="border-border"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="h-100 w-full flex flex-wrap items-center justify-evenly gap-3 mt-2">
        {isLoading && <MovieSearchSkeleton />}
        {isError && <li>Something went wrong</li>}
        {data.length > 0
          ? data.map((movie) => (
              <MovieSearchItem
                key={movie._id}
                movie={movie}
                setSelected={setSelected}
              />
            ))
          : !isLoading && search.length > 2 && <li>No Results</li>}
      </ul>
    </form>
  )
}

export default MovieSearch