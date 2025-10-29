import ErrorMessage from "../shared/ErrorMessage"
import ListHeading from "../shared/ListHeading"
import ListHeadingTitle from "../shared/ListHeadingTitle"
import SelectSortBy from "../shared/SelectSortBy"
import SortOrderToggle from "../shared/SortOrderToggle"
import Total from "../shared/Total"
import ListCard from "../lists/ListCard"
import PaginationWrap from "../shared/PaginationWrap"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import ProfileListSkeleton from "./ProfileListsSkeleton"
import { useMemo } from "react"
import { useParams, useSearchParams } from "react-router"

const ProfileLists = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user_lists", searchParams.toString()],
    queryFn: () =>
      axios
        .get(`/api/users/${id}/lists?`, { params: searchParams })
        .then((response) => response.data),
  })
  const sortOptions = useMemo(() => {
    return {
      followers: "Followers",
      date: "Creation date",
      media: "Media",
    }
  }, [])
  if (isLoading) {
    return <ProfileListSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  const sort = searchParams.get("sort_by") || "date"
  const lists = data.lists
  return (
    <div>
      <ListHeading>
        <ListHeadingTitle title="Public lists">
          <Total total={data.total} label="Total Public lists" />
        </ListHeadingTitle>
        <SelectSortBy
          value={sort}
          selectedValue={sortOptions[sort]}
          title="Sort Lists"
          options={sortOptions}
        />
        <SortOrderToggle />
      </ListHeading>
      {lists.length > 0 ? (
        <ul
          className="flex flex-wrap w-full items-center justify-start gap-5"
          aria-label="lists"
        >
          {lists?.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </ul>
      ) : (
        <p>No public lists yet</p>
      )}
      <div className="mt-4">
        {data.totalPages > 1 && <PaginationWrap totalPages={data.totalPages} />}
      </div>
    </div>
  )
}

export default ProfileLists
