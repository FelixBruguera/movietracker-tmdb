import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import UserReview from "./UserReview"
import ReviewForm from "./ReviewForm"
import ReviewsSkeleton from "./ReviewsSkeleton"
import axios from "axios"
import reviewsInfo from "../../lib/reviews.json"
import ReviewSkeleton from "./ReviewSkeleton"
import { useSearchParams } from "react-router"
import { authClient } from "../../lib/auth-client"
import { toast } from "sonner"

const ReviewDialog = ({ movie, isTv = false }) => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: session } = authClient.useSession()
  const currentUser = session.user
  const path = isTv ? "/tv" : ""
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user_review", movie.id],
    queryFn: () =>
      axios
        .get(`/api/reviews/user/${movie.id}`)
        .then((response) => response.data),
  })
  const mutation = useMutation({
    mutationFn: (newReview) => axios.post(`/api/reviews${path}`, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "reviews",
          movie.id,
          searchParams.toString(),
          currentUser.id,
        ],
        exact: true,
      })
      queryClient.invalidateQueries({ queryKey: ["user_review", movie.id] })
      return toast("Review created")
    },
    onError: (error) => toast(error.response.statusText),
  })
  if (isLoading) {
    return <ReviewSkeleton />
  }
  const sortOptions = reviewsInfo.sortOptions
  const ratingScale = reviewsInfo.ratingScale
  const review = data[0]
  return review ? (
    <UserReview
      movieId={movie.id}
      data={review}
      color={ratingScale[review.rating]}
    />
  ) : (
    <ReviewForm movie={movie} mutation={mutation} />
  )
}

export default ReviewDialog
