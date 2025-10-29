import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { authClient } from "@lib/auth-client"
import { toast } from "sonner"
import { Button } from "@ui/button"
import { Eye, Lock, Minus, MinusCircle, Plus, Trash } from "lucide-react"
import ReviewSkeleton from "../reviews/ReviewSkeleton"
import ErrorMessage from "../shared/ErrorMessage"

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
    <ul>
      {lists.length > 0 ? (
        lists.map((list) => {
          return (
            <li
              key={list.id}
              className="flex justify-between items-center mb-2"
            >
              <div className="flex items-center gap-2">
                <p>{list.name}</p>
                {list.isPrivate && <Lock aria-label="Private" />}
                {list.isWatchlist && <Eye aria-label="Watchlist" />}
              </div>
              {list.includesMedia ? (
                <Button
                  variant="ghost"
                  title="Remove from list"
                  aria-label="Remove from list"
                  className="text-accent"
                  onClick={() => removeFromListMutation.mutate(list.id)}
                >
                  <MinusCircle />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  title="Add to list"
                  aria-label="Add to list"
                  onClick={() => addToListMutation.mutate(list.id)}
                >
                  <Plus />
                </Button>
              )}
            </li>
          )
        })
      ) : (
        <li className="text-muted-foreground">No lists to show</li>
      )}
    </ul>
  )
}

export default ListMovieDialog
