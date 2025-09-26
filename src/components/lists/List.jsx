import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ErrorMessage from "../shared/ErrorMessage"
import ListHeading from "../shared/ListHeading.jsx"
import ListHeadingTitle from "../shared/ListHeadingTitle.jsx"
import Total from "../shared/Total"
import { authClient } from "@lib/auth-client.ts"
import AddToList from "./AddToList"
import SelectSortBy from "../shared/SelectSortBy"
import SortOrderToggle from "../shared/SortOrderToggle"
import PaginationWrap from "../shared/PaginationWrap"
import axios from "axios"
import { toast } from "sonner"
import UpdateList from "./UpdateList"
import DeleteList from "./DeleteList"
import ListSkeleton from "./ListSkeleton"
import ListMovieWithContext from "./ListMovieWithContext"
import FollowList from "./FollowList"
import ListMovie from "./ListMovie"
import ListDetails from "./ListDetails"
import { useMemo } from "react"
import { useParams, useSearchParams } from "react-router"
import CopyList from "./CopyList.jsx"

export default function List() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["list", id],
    queryFn: () =>
      axios
        .get(`/api/lists/${id}`, { params: searchParams })
        .then((response) => response.data[0]),
  })
  const {
    data: media,
    isLoading: mediaLoading,
    isError: mediaError,
  } = useQuery({
    queryKey: ["list_media", id, searchParams.toString()],
    queryFn: () =>
      axios
        .get(`/api/lists/${id}/media`, { params: searchParams })
        .then((response) => response.data),
  })
  const mutation = useMutation({
    mutationFn: (mediaId) => axios.delete(`/api/lists/${id}/media/${mediaId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list_media", id] })
      toast("Succesfully removed")
    },
    onError: (error) => toast(error.response.statusText),
  })
  const sortOptions = useMemo(() => {
    return { date: "Added date" }
  }, [])
  if (isLoading || mediaLoading) {
    return <ListSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  const list = data
  const user = data.user
  console.log(media)
  const isFollowed = data.currentUserFollows === 1 ? true : false

  return (
    <div className="lg:py-3 min-h-dvh w-9/10 lg:w-full mx-auto">
      <title>{list.name}</title>
      <meta property="og:title" content={list.name} />
      <div className="w-full flex items-start justify-between">
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold">{list.name}</h1>
            <div className="flex gap-2 lg:w-fit">
              {session && <CopyList list={list} />}
              {session?.user.id === user.id && (
                  <>
                    <AddToList list={list} />
                    <UpdateList list={list} />
                    <DeleteList list={list} />
                  </>
              )}
              {session && session.user.id !== user.id && (
                <FollowList listId={list.id} isFollowed={isFollowed} />
              )}
            </div>
          </div>
          <ListDetails user={user} list={list} />
          <p className="text-base lg:text-lg w-8/10 text-stone-600 dark:text-stone-200 text-justify">
            {list.description}
          </p>
        </div>
      </div>
      <ListHeading>
        <ListHeadingTitle title="Media">
          <Total total={media.total} label="Total Media" />
        </ListHeadingTitle>
        <SelectSortBy
          value="date"
          selectedValue={sortOptions["date"]}
          title="Sort Movies"
          options={sortOptions}
        />
        <SortOrderToggle />
      </ListHeading>
      <ul
        className="py-5 flex flex-wrap justify-start gap-x-2 items-center gap-y-1"
        aria-label="Movies"
      >
        {media.media.length > 0 &&
          media.media.map((movie) =>
            session?.user.id === user.id ? (
              <ListMovieWithContext
                listName={list.name}
                movie={movie}
                mutation={mutation}
              />
            ) : (
              <ListMovie movie={movie} />
            ),
          )}
      </ul>
      {media.totalPages > 1 && <PaginationWrap totalPages={media.totalPages} />}
    </div>
  )
}
