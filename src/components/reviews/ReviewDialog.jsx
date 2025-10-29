import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import UserReview from "./UserReview"
import ReviewForm from "./ReviewForm"
import ReviewsSkeleton from "./ReviewsSkeleton"
import axios from "axios"
import reviewsInfo from "../../../lib/reviews.json"
import ReviewSkeleton from "./ReviewSkeleton"
import { useLocation, useSearchParams } from "react-router"
import { authClient } from "../../../lib/auth-client"
import { toast } from "sonner"

const ReviewDialog = ({ mediaId }) => {
  const queryClient = useQueryClient()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: session } = authClient.useSession()
  const currentUser = session.user
  const path = location.pathname.includes("tv") ? "/tv" : ""
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user_review", mediaId],
    queryFn: () =>
      axios
        .get(`/api/reviews/user/${mediaId}`)
        .then((response) => response.data),
  })
  const mutation = useMutation({
    mutationFn: (newReview) => axios.post(`/api/reviews${path}`, newReview),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "reviews",
            mediaId,
            searchParams.toString(),
            currentUser.id,
          ],
          exact: true,
        }),
        queryClient.invalidateQueries({ queryKey: ["user_review", mediaId] }),
        queryClient.invalidateQueries({ queryKey: ["diary", mediaId] }),
      ])
      return toast("Review created")
    },
    onError: (error) => {
      const message = error.response.data.error || error.response.statusText
      return toast(message)
    },
  })
  if (isLoading) {
    return <ReviewSkeleton />
  }
  const sortOptions = reviewsInfo.sortOptions
  const ratingScale = reviewsInfo.ratingScale
  const review = data[0]
  return review ? (
    <UserReview
      mediaId={mediaId}
      data={review}
      color={ratingScale[review.rating]}
    />
  ) : (
    <ReviewForm mediaId={mediaId} mutation={mutation} />
  )
}

export default ReviewDialog
