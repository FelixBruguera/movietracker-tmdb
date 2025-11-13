import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { authClient } from "@lib/auth-client"
import { toast } from "sonner"
import ReviewSkeleton from "../reviews/ReviewSkeleton"
import ErrorMessage from "../shared/ErrorMessage"
import UserLists from "./UserLists"

const ListCollectionDialog = ({ collectionId }) => {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const currentUser = session.user
  const {
    data: lists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user_lists", currentUser.id],
    queryFn: () =>
      axios.get(`/api/lists/user/0`).then((response) => response.data),
  })

  const addToListMutation = useMutation({
    mutationFn: (listId) =>
      axios.post(`/api/lists/${listId}/collection`, {
        collectionId: collectionId,
      }),
    onSuccess: (data, listId) => {
      queryClient.invalidateQueries({
        queryKey: ["user_lists", currentUser.id],
      })
      queryClient.invalidateQueries({
        queryKey: ["list_media", listId],
      })
      toast("Succesfully Added")
    },
    onError: (error) => {
      const message = error.response.data || error.response.statusText
      return toast(message)
    },
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

  return <UserLists lists={lists} addToListMutation={addToListMutation} />
}

export default ListCollectionDialog
