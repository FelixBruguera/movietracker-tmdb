import { useQuery } from "@tanstack/react-query"
import ErrorMessage from "../../shared/ErrorMessage"
import axios from "axios"
import { useParams } from "react-router"
import { useLocation } from "react-router"
// import RatingsByDecade from "./RatingsByDecade"
// import RatingVerticalBarChart from "./RatingVerticalBarChart"
// import StatsSkeleton from "./StatsSkeleton"
// import StatsList from "./StatsList"
// import RatingDifference from "./RatingDifference"

const ReviewsStats = () => {
  const location = useLocation()
  const path = location.pathname.includes("tv") ? "tv" : "movies"
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviewsStats", id],
    queryFn: () =>
      axios
        .get(`/api/users/${id}/stats/reviews/${path}`)
        .then((response) => response.data[0]),
  })
  if (isLoading) {
    // return <StatsSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  return (
    <div>
      {/* <RatingsByDecade data={data.byDecade} />
      <RatingVerticalBarChart
        data={data.byGenre}
        title="Best rated genres (Min. 2 movies)"
      />
      <RatingVerticalBarChart
        data={data.byDirectors}
        title="Best rated directors (Min. 2 movies)"
      />
      {data.higherThanIMDB.length > 0 && (
        <StatsList title="Rated higher than IMDB">
          {data.higherThanIMDB.map((movie) => (
            <RatingDifference movie={movie} isRatedHigher={true} />
          ))}
        </StatsList>
      )}
      {data.lowerThanIMDB.length > 0 && (
        <StatsList title="Rated lower than IMDB">
          {data.lowerThanIMDB.map((movie) => (
            <RatingDifference movie={movie} isRatedHigher={false} />
          ))}
        </StatsList>
      )}*/}
    </div>
  )
}

export default ReviewsStats
