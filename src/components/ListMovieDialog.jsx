import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { authClient } from "../../lib/auth-client"
import { toast } from "sonner"
import { Button } from "../../app/components/ui/button"
import { Eye, Lock, Minus, MinusCircle, Plus, Trash } from "lucide-react"
import ReviewSkeleton from "./ReviewSkeleton"
import ErrorMessage from "./ErrorMessage"

const ListMovieDialog = ({ movie, isTv = false }) => {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const currentUser = session.user
  const movieData = {
    id: movie.id,
    title: movie.title || movie.name,
    poster: movie.poster_path,
    releaseDate: movie.release_date || movie.first_air_date,
    isTv: isTv,
  }
  const {
    data: lists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user_lists", currentUser.id, movie.id],
    queryFn: () =>
      axios
        .get(`/api/lists/user/${movie.id}`)
        .then((response) => response.data),
  })

  const addToListMutation = useMutation({
    mutationFn: (listId) => axios.post(`/api/lists/${listId}/media`, movieData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_lists", currentUser.id, movie.id],
      })
      toast("Succesfully Added")
    },
    onError: (error) =>
      toast(error.response.data.error || error.response.statusText),
  })

  const removeFromListMutation = useMutation({
    mutationFn: (listId) =>
      axios.delete(`/api/lists/${listId}/media/${movie.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_lists", currentUser.id, movie.id],
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
      {lists.map((list) => {
        return (
          <li key={list.id} className="flex justify-between items-center mb-2">
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
      })}
    </ul>
  )
}

export default ListMovieDialog
