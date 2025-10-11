import DiaryRow from "./DiaryRow"
import ListHeading from "../shared/ListHeading"
import ListHeadingTitle from "../shared/ListHeadingTitle"
import PaginationWrap from "../shared/PaginationWrap"
import SelectSortBy from "../shared/SelectSortBy"
import SortOrderToggle from "../shared/SortOrderToggle"
import Total from "../shared/Total"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import ErrorMessage from "../shared/ErrorMessage"
import DiarySkeleton from "./DiarySkeleton"
import ProfileHeader from "./ProfileHeader"
import { useParams, useSearchParams } from "react-router"
import PosterList from "../shared/PosterList"

const Diary = () => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["diary", id, searchParams.toString()],
    queryFn: () =>
      axios
        .get(`/api/users/${id}/diary`, { params: searchParams })
        .then((response) => response.data),
  })
  if (isLoading) {
    return <DiarySkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  const sortOptions = { monthly: "Monthly", yearly: "Yearly" }
  const sortBy = searchParams.get("sort_by") || "monthly"
  return (
    <div>
      <ListHeading>
        <ListHeadingTitle title="Diary Logs">
          <Total total={data.total} label="Total logs" />
        </ListHeadingTitle>
        <SelectSortBy
          value={sortBy}
          selectedValue={sortOptions[sortBy]}
          title="Group logs"
          options={sortOptions}
        />
        <SortOrderToggle />
      </ListHeading>
      {data.media?.length > 0 ? (
        <>
          <ul className="flex flex-col gap-5 justify-end w-full max-w-500 mx-auto">
            {data.media.map((row) => (
              <DiaryRow key={row.group} data={row} group={sortBy} />
            ))}
          </ul>
        </>
      ) : (
        <p>No logs yet.</p>
      )}
      <div className="mt-4">
        {data.totalPages > 1 && <PaginationWrap totalPages={data.totalPages} />}
      </div>
    </div>
  )
}

export default Diary
