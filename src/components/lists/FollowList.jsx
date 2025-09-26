import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Heart, HeartOff } from "lucide-react"
import { Button } from "@ui/button"
import { toast } from "sonner"
import { useSearchParams } from "react-router"

const LikeButton = (props) => {
  return (
    <Button
      variant="ghost"
      className="hover:bg-transparent dark:hover:bg-transparent border-1 hover:text-black border-transparent hover:border-border cursor-pointer dark:hover:text-white transition-colors"
      title={props.label}
      aria-label={props.label}
      onClick={() => props.mutation.mutate()}
    >
      {props.children}
    </Button>
  )
}

const FollowList = ({ listId, isFollowed }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const createMutation = useMutation({
    mutationFn: () => axios.post(`/api/lists/${listId}/follow`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", listId] })
      toast("Succesfully followed")
    },
    onError: (error) =>
      toast(error.response.statusText || "Something went wrong"),
  })
  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/api/lists/${listId}/follow`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", listId] })
      toast("Succesfully unfollowed")
    },
    onError: (error) =>
      toast(error.response.statusText || "Something went wrong"),
  })
  return isFollowed ? (
    <LikeButton label="Unfollow list" mutation={deleteMutation}>
      <Heart className="fill-accent text-accent" />
    </LikeButton>
  ) : (
    <LikeButton label="Follow list" mutation={createMutation}>
      <Heart />
    </LikeButton>
  )
}

export default FollowList
