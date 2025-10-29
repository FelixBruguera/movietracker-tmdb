import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import PaginationWrap from "../shared/PaginationWrap.jsx"
import { useLocation, useSearchParams } from "react-router"
import Review from "./Review.jsx"
import SortOrderToggle from "../shared/SortOrderToggle.jsx"
import SelectSortBy from "../shared/SelectSortBy.jsx"
import { authClient } from "../../../lib/auth-client.ts"
import ReviewsSkeleton from "./ReviewsSkeleton"
import ErrorMessage from "../shared/ErrorMessage.jsx"
import reviewsInfo from "../../../lib/reviews.json"
import AverageRating from "./AverageRating.jsx"
import Total from "../shared/Total.jsx"
import ListHeadingTitle from "../shared/ListHeadingTitle"
import ListHeading from "../shared/ListHeading"
import axios from "axios"
import { toast } from "sonner"

export default function Reviews({ movie, mediaId }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: session } = authClient.useSession()
  const location = useLocation()
  const queryClient = useQueryClient()
  const currentUser = session?.user
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", mediaId, searchParams.toString(), currentUser?.id],
    queryFn: () =>
      axios
        .get(`/api/reviews/${mediaId}`, { params: searchParams })
        .then((response) => response.data),
  })
  const likeMutation = useMutation({
    mutationFn: (id) => axios.post(`/api/reviews/like/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", mediaId] })
      toast("Like added")
    },
    onError: (error) =>
      toast(error.response.statusText) || toast("Something went wrong"),
  })
  const dislikeMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/reviews/like/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", mediaId] })
      toast("Like removed")
    },
    onError: (error) =>
      toast(error.response.statusText) || toast("Something went wrong"),
  })
  console.log(data)
  const sortOptions = reviewsInfo.sortOptions
  const ratingScale = reviewsInfo.ratingScale

  if (isLoading) {
    return <ReviewsSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  const sortBy = searchParams.get("sort_by") || "date"
  const totalReviews = data.totalReviews
  const averageRating = data.averageRating && data.averageRating.toFixed(1)
  const averageRatingColor = data.averageRating && Math.ceil(data.averageRating)

  return (
    <div id="reviews" className="max-w-400 mt-10 mx-auto lg:w-8/10 2xl:w-7/10">
      <ListHeading>
        <ListHeadingTitle title="Reviews">
          <Total total={totalReviews} label="Total Reviews" />
          <AverageRating
            rating={averageRating}
            color={ratingScale[averageRatingColor]}
          />
        </ListHeadingTitle>
        <SelectSortBy
          value={sortBy}
          selectedValue={sortOptions[sortBy]}
          title="Sort Reviews"
          options={sortOptions}
        />
        <SortOrderToggle />
      </ListHeading>
      {data.reviews?.length > 0 ? (
        <>
          <ul className="space-y-4" aria-label="Reviews">
            {data.reviews.map((review) => (
              <Review
                key={review.id}
                data={review}
                title={review.user.username}
                avatar={review.user.image}
                path={`/users/${review.user.id}`}
                color={ratingScale[review.rating]}
                likeMutation={likeMutation}
                dislikeMutation={dislikeMutation}
              />
            ))}
          </ul>
          <div className="mt-4">
            {data.totalPages > 1 && (
              <PaginationWrap
                totalPages={data.totalPages}
                scrollTarget="reviews"
              />
            )}
          </div>
        </>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  )
}
