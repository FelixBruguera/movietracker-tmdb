import { Input } from "../../app/components/ui/input"
import { useContext, useState } from "react"
import useDebounce from "../../hooks/useDebounce"
import SearchItem from "./SearchItem"
import MovieSearchSkeleton from "./MovieSearchSkeleton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { DialogContext } from "./DialogWrapper"

const Search = () => {
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
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
      <div className="mx-auto w-full lg:w-2/4 flex flex-col items-center gap-1">
        <Input
          type="text"
          id="search"
          placeholder="Search"
          value={search}
          className="border-border"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="h-100 w-full flex flex-wrap items-center justify-evenly gap-3 mt-2">
        {(isLoading || dataLoading) && <MovieSearchSkeleton />}
        {isError && <li>Something went wrong</li>}
        {data?.results.length > 0
          ? data.results.map((itemData) => (
              <SearchItem
                key={itemData.id}
                itemData={itemData}
                setOpen={setOpen}
              />
            ))
          : !isLoading && search.length > 2 && <li>No Results</li>}
      </ul>
    </form>
  )
}

export default Search
