import { useQuery } from "@tanstack/react-query"
import PaginationWrap from "./PaginationWrap"
import { useSearchParams } from "react-router"
import Review from "./Review"
import SortOrderToggle from "./SortOrderToggle"
import SelectSortBy from "./SelectSortBy"
import ReviewForm from "./ReviewForm"
import { authClient } from "../../lib/auth-client.ts"
import ReviewsSkeleton from "./ReviewsSkeleton"
import ErrorMessage from "./ErrorMessage"
import reviewsInfo from "../../lib/reviews.json"
import AverageRating from "./AverageRating"
import Total from "./Total"
import ListHeadingTitle from "./ListHeadingTitle"
import ListHeading from "./ListHeading"
import axios from "axios"
import { toast } from "sonner"

export default function Reviews({ movie }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: session } = authClient.useSession()
  const currentUser = session?.user
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", movie.id, searchParams.toString(), currentUser?.id],
    queryFn: () =>
      axios
        .get(`/api/reviews/${movie.id}`, { params: searchParams })
        .then((response) => response.data),
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
  const averageRating = data.averageRating
  const totalReviews = data.totalReviews
  const ratingColor = averageRating && ratingScale[Math.floor(averageRating)]
  console.log(averageRating)

  return (
    <div id="reviews" className="max-w-400 mt-10 mx-auto lg:w-8/10 2xl:w-7/10">
      <ListHeading>
        <ListHeadingTitle title="Reviews">
          <Total total={totalReviews} label="Total Reviews" />
          <AverageRating rating={averageRating} color={ratingColor} />
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
          <ul className="space-y-4">
            {data.reviews.map((review) => (
              <Review
                key={review.id}
                movieId={movie.id}
                data={review}
                color={ratingScale[review.rating]}
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
