import { useSearchParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import MovieSearchSkeleton from "./MovieSearchSkeleton"
import ErrorMessage from "../shared/ErrorMessage"
import SearchItem from "./SearchItem"
import PaginationWrap from "../shared/PaginationWrap"
import axios from "axios"
import MoviesSkeleton from "../media/MoviesSkeleton"

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { query, page } = Object.fromEntries(searchParams.entries())
  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", query, page],
    queryFn: () =>
      axios
        .get("/api/search", { params: { query: query, page: page } })
        .then((response) => response.data),
  })
  const title = `Results for "${query}"`
  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <h1 className="text-xl font-semibold text-center mb-5">{title}</h1>
        <ul className="flex flex-wrap">
          <MovieSearchSkeleton />
        </ul>
      </>
    )
  }
  if (isError) {
    return <ErrorMessage />
  }
  return (
    <section aria-label="search results" className="flex flex-col gap-5">
      <title>{title}</title>
      <h1 className="text-xl font-semibold text-center">{title}</h1>
      <ul className="flex flex-wrap">
        {data.results.map((itemData) => (
          <SearchItem
            key={[itemData.media_type, itemData.id]}
            itemData={itemData}
          />
        ))}
      </ul>
      <PaginationWrap totalPages={data.total_pages} />
    </section>
  )
}

export default SearchResults
