import { useState } from "react"
import Review from "./Review"
import { Edit, Trash } from "lucide-react"
import ReviewForm from "./ReviewForm"
import Remove from "../shared/Remove"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import axios from "axios"
import { useSearchParams } from "react-router"
import { authClient } from "../../../lib/auth-client"

const UserReviewButton = (props) => {
  const label = props.isActive ? "Cancel" : props.label
  return (
    <div
      onClick={props.onClick}
      aria-label={label}
      title={label}
      className={`p-2 rounded-md bg-transparent dark:text-muted-foreground
                ${props.isActive && "dark:bg-card bg-zinc-300"}
                hover:dark:bg-card hover:bg-zinc-300 hover:cursor-pointer transition-colors`}
    >
      {props.children}
    </div>
  )
}

const UserReview = ({ movieId, data, color }) => {
  const { data: session } = authClient.useSession()
  const currentUser = session.user
  const [isEditing, setIsEditing] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/api/reviews/${data.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", movieId, searchParams.toString(), currentUser.id],
        exact: true,
      })
      queryClient.resetQueries({
        queryKey: ["user_review", movieId],
      })
      return toast("Review deleted")
    },
    onError: (error) => toast(error.response.statusText),
  })
  const updateMutation = useMutation({
    mutationFn: (newReview) =>
      axios.patch(`/api/reviews/${data.id}`, newReview),
    onSuccess: (response) => {
      const newReview = response.data
      queryClient.invalidateQueries({
        queryKey: ["reviews", movieId, searchParams.toString(), currentUser.id],
        exact: true,
      })
      queryClient.setQueryData(["user_review", movieId], (oldData) => [
        { ...oldData[0], text: newReview.text, rating: newReview.rating },
      ])
      queryClient.invalidateQueries({ queryKey: ["diary", movieId] })
      setIsEditing(false)
      return toast("Review updated")
    },
    onError: (error) => toast(error.response.statusText),
  })
  return (
    <div className="flex flex-col gap-2 my-1">
      <div className="flex items-center gap-5">
        <div className="flex items-center justify-start w-full gap-2">
          <UserReviewButton
            onClick={() => setIsEditing((prevState) => !prevState)}
            isActive={isEditing}
            label="Edit your review"
          >
            <Edit />
          </UserReviewButton>
          <Remove
            title={"Deleting your review"}
            mutation={() => deleteMutation.mutate()}
          >
            <UserReviewButton label="Delete your review">
              <Trash />
            </UserReviewButton>
          </Remove>
        </div>
      </div>
      {isEditing ? (
        <ReviewForm
          previousReview={data}
          movie={{ id: movieId }}
          mutation={updateMutation}
        />
      ) : (
        <Review
          data={data}
          title={currentUser.username}
          avatar={currentUser.image}
          path={`/users/${currentUser.id}`}
          color={color}
          displayLikes={false}
        />
      )}
    </div>
  )
}

export default UserReview
