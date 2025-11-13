import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { authClient } from "@lib/auth-client"
import { toast } from "sonner"
import ReviewSkeleton from "../reviews/ReviewSkeleton"
import ErrorMessage from "../shared/ErrorMessage"
import UserLists from "./UserLists"

const ListMovieDialog = ({ mediaId }) => {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const currentUser = session.user
  const {
    data: lists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user_lists", currentUser.id, mediaId],
    queryFn: () =>
      axios.get(`/api/lists/user/${mediaId}`).then((response) => response.data),
  })

  const addToListMutation = useMutation({
    mutationFn: (listId) =>
      axios.post(`/api/lists/${listId}/media`, { mediaId: mediaId }),
    onSuccess: (data, listId) => {
      queryClient.invalidateQueries({
        queryKey: ["user_lists", currentUser.id, mediaId],
      })
      queryClient.invalidateQueries({
        queryKey: ["list_media", listId],
      })
      toast("Succesfully Added")
    },
    onError: (error) => {
      const message = error.response.data.error || error.response.statusText
      return toast(message)
    },
  })

  const removeFromListMutation = useMutation({
    mutationFn: (listId) =>
      axios.delete(`/api/lists/${listId}/media/${mediaId}`),
    onSuccess: (data, listId) => {
      queryClient.invalidateQueries({
        queryKey: ["user_lists", currentUser.id, mediaId],
      })
      queryClient.invalidateQueries({
        queryKey: ["list_media", listId],
      })
      toast("Succesfully removed")
    },
    onError: (error) => toast(error.response.statusText),
  })

  if (isLoading) {
    return (
      <div>
        <ReviewSkeleton />
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage />
  }

  return (
    <UserLists
      lists={lists}
      addToListMutation={addToListMutation}
      removeFromListMutation={removeFromListMutation}
    />
  )
}

export default ListMovieDialog
