import reviewsInfo from "@lib/reviews.json"
import AverageRating from "../reviews/AverageRating"
import ProfileReview from "./ProfileReview"
import SortOrderToggle from "../shared/SortOrderToggle"
import SelectSortBy from "../shared/SelectSortBy"
import PaginationWrap from "../shared/PaginationWrap"
import Total from "../shared/Total"
import ListHeading from "../shared/ListHeading"
import ListHeadingTitle from "../shared/ListHeadingTitle"
import { useQuery } from "@tanstack/react-query"
import ErrorMessage from "../shared/ErrorMessage"
import axios from "axios"
import ReviewsSkeleton from "../reviews/ReviewsSkeleton"
import { useParams, useSearchParams } from "react-router"
import ReviewFilters from "./ReviewFilters"

const ProfileReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userReviews", id, searchParams.toString()],
    queryFn: () =>
      axios
        .get(`/api/users/${id}/reviews`, { params: searchParams })
        .then((response) => response.data),
  })
  if (isLoading) {
    return <ReviewsSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  const sortOptions = reviewsInfo.sortOptions
  const ratingScale = reviewsInfo.ratingScale
  const sortBy = searchParams.get("sort_by") || "date"
  const averageRating = data.averageRating && data.averageRating.toFixed(1)
  const averageRatingColor = data.averageRating && Math.ceil(data.averageRating)

  return (
    <div>
      <ListHeading>
        <ListHeadingTitle title="Reviews">
          <Total total={data.total} label="Total Reviews" />
          {averageRating && (
            <AverageRating
              rating={averageRating}
              color={ratingScale[averageRatingColor]}
            />
          )}
        </ListHeadingTitle>
        <div className="w-full flex items-center justify-between lg:justify-end gap-1">
          <ReviewFilters />
          <div className="flex items-center justify-center">
            <SelectSortBy
              value={sortBy}
              selectedValue={sortOptions[sortBy]}
              title="Sort Reviews"
              options={sortOptions}
            />
            <SortOrderToggle />
          </div>
        </div>
      </ListHeading>
      {data.reviews?.length > 0 ? (
        <>
          <ul className="space-y-4" aria-label="Reviews">
            {data.reviews.map((review) => (
              <ProfileReview
                key={review.id}
                data={review}
                color={ratingScale[review.rating]}
                profileId={id}
              />
            ))}
          </ul>
          <div className="mt-4">
            {data.totalPages > 1 && (
              <PaginationWrap totalPages={data.totalPages} />
            )}
          </div>
        </>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  )
}

export default ProfileReviews
