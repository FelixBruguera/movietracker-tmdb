import { Link } from "react-router"
import Avatar from "./Avatar"
import { ThumbsUp } from "lucide-react"
import { Button } from "../../app/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { authClient } from "../../lib/auth-client"
import { toast } from "sonner"

const Likes = ({ reviewId, movieId, currentUserLiked, count }) => {
  const queryClient = useQueryClient()
  const likeMutation = useMutation({
    mutationKey: ["likeMutation"],
    mutationFn: () => axios.post(`/api/reviews/like/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] })
      toast("Like added")
    },
    onError: (error) =>
      toast(error.response.statusText) || toast("Something went wrong"),
  })
  const dislikeMutation = useMutation({
    mutationKey: ["dislikeMutation"],
    mutationFn: () => axios.delete(`/api/reviews/like/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] })
      toast("Like removed")
    },
    onError: (error) =>
      toast(error.response.statusText) || toast("Something went wrong"),
  })
  const verb = count === 1 ? "Like" : "Likes"
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      {currentUserLiked === 1 ? (
        <Button
          variant="outline"
          title="Dislike"
          aria-label="Dislike"
          onClick={() => dislikeMutation.mutate()}
          className={`!px-2 h-8 !bg-accent text-white hover:cursor-pointer hover:!bg-accent/50 transition-colors `}
        >
          <ThumbsUp />
        </Button>
      ) : (
        <Button
          variant="outline"
          title="Like"
          aria-label="Like"
          onClick={() => likeMutation.mutate()}
          className={`!px-2 h-8 hover:cursor-pointer transition-colors`}
        >
          <ThumbsUp />
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        {count} {verb}
      </p>
    </div>
  )
}

const Review = ({ movieId, data, userInfo = null, color }) => {
  const { data: session } = authClient.useSession()
  const user = data.user || userInfo
  console.log(user)
  return (
    <li
      key={data._id}
      className="border px-4 py-3 gap-1 rounded-lg bg-muted dark:bg-card hover:border-stone-400 dark:hover:border-stone-600 flex items-center justify-between transition-all"
    >
      <div className="flex gap-3 items-center">
        <p
          className={`font-bold text-base ${color} px-3 py-1 h-fit dark:text-black rounded-lg`}
        >
          {data.rating}
        </p>
      </div>
      <div className="flex items-start w-full gap-2">
        <div className="flex flex-col gap-1 w-full px-3">
          <div className="flex gap-2 items-center">
            <Link
              to={`/users/${user.id}`}
              className="flex items-center gap-2 justify-center font-bold hover:text-accent transition-all"
            >
              <Avatar src={user.image} size="miniature" />
              {user.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="w-full lg:w-full text-sm lg:text-base text-justify">
            {data.text}
          </p>
        </div>
        <div className="flex justify-end gap-2 items-start w-5/10 lg:w-2/10">
          {/* <div className="flex gap-3 items-center">
              <p
                className={`font-bold text-base ${color} px-3 py-1 dark:text-black rounded-lg`}
              >
                {data.rating}
              </p>
            </div> */}
          {session && !userInfo && (
            <Likes
              reviewId={data.id}
              movieId={movieId}
              currentUserLiked={data.currentUserLiked}
              count={data.likes}
            />
          )}
        </div>
      </div>
    </li>
  )
}

export default Review
