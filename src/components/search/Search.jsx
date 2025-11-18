import { Input } from "@ui/input"
import { useContext, useState } from "react"
import useDebounce from "../../../hooks/useDebounce"
import MovieSearchSkeleton from "./MovieSearchSkeleton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { DialogContext } from "../shared/DialogWrapper"
import { Button } from "@ui/button"
import { Link } from "react-router"

const SearchRenderer = ({
  isLoading,
  dataLoading,
  isError,
  data,
  renderFn,
  linkPath,
  setOpen,
}) => {
  if (isLoading || dataLoading) {
    return <MovieSearchSkeleton />
  }
  if (isError) {
    return <li>Something went wrong</li>
  }
  return data?.results.length > 0 ? (
    <>
      {renderFn()}
      {data.total_pages > 1 && (
        <Link to={linkPath} className="pb-3">
          <Button onClick={() => setOpen(false)}>More results</Button>
        </Link>
      )}
    </>
  ) : data?.results ? (
    <li>No Results</li>
  ) : null
}

const Search = ({ renderFn }) => {
  const [search, setSearch] = useState("")
  const { debouncedValue, isLoading } = useDebounce(search, 1000)
  const {
    data,
    isLoading: dataLoading,
    isError,
  } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: () =>
      axios
        .get("/api/search", { params: { query: debouncedValue } })
        .then((response) => response.data),
    enabled: debouncedValue.length > 2,
  })
  const { setOpen } = useContext(DialogContext)
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-2 lg:w-full"
    >
      <div className="mx-auto w-3/4 lg:w-2/4 flex flex-col items-center gap-1">
        <Input
          type="text"
          id="search"
          placeholder="Search"
          value={search}
          className="border-border"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="h-100 2xl:h-150 w-full flex flex-wrap items-start justify-evenly gap-3">
        <SearchRenderer
          isLoading={isLoading}
          dataLoading={dataLoading}
          isError={isError}
          data={data}
          renderFn={() => renderFn(data.results, setOpen)}
          linkPath={`/search?query=${debouncedValue}&page=2`}
          setOpen={setOpen}
        />
      </ul>
    </form>
  )
}

export default Search
