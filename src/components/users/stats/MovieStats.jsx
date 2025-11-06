import { useQuery } from "@tanstack/react-query"
import ErrorMessage from "../../shared/ErrorMessage"
import axios from "axios"
import { useParams } from "react-router"
import RatingsByYear from "./RatingsByYear"
import RatingVerticalBarChart from "./RatingVerticalBarChart"
import StatsSkeleton from "./StatsSkeleton"
import StatsList from "./StatsList"
import PersonRating from "./PersonRating"
import DiaryVerticalBarChart from "./DiaryVerticalBarChart"
import LogsByYear from "./LogsByYear"
import MediaStat from "./MediaStat"
import RatingDistribution from "./RatingDistribution"
import Heatmap from "./Heatmap"
import ChartHeading from "./ChartHeading"

const MovieStats = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movieStats", id],
    queryFn: () =>
      axios
        .get(`/api/users/${id}/stats/movies`)
        .then((response) => response.data),
  })
  if (isLoading) {
    return <StatsSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  return (
    <div className="flex flex-wrap">
      {Object.keys(data.dayOfWeekHeatmap).length > 0 && (
        <ChartHeading title="Activity by day of the week">
          <Heatmap
            data={data.dayOfWeekHeatmap}
            values={daysOfWeek}
            tooltipTitle="Movies"
          />
        </ChartHeading>
      )}
      {Object.keys(data.monthlyHeatmap).length > 0 && (
        <ChartHeading title="Activity by month">
          <Heatmap
            data={data.monthlyHeatmap}
            values={months}
            tooltipTitle="Movies"
          />
        </ChartHeading>
      )}
      <RatingsByYear
        data={data.byYear}
        title="Average Rating by Premiered Year"
        xAxisDataKey="year"
        tooltipTitle="Movies"
      />
      <RatingsByYear
        data={data.byDecade}
        title="Average Rating by Premiered Decade"
        xAxisDataKey="decade"
        width="base"
        tooltipTitle="Movies"
      />
      <RatingDistribution
        data={data.ratingDistribution}
        tooltipTitle="Movies"
      />
      <RatingVerticalBarChart
        data={data.byGenre}
        title="Best rated genres (Min. 2 movies)"
        tooltipTitle="Movies"
      />
      <DiaryVerticalBarChart
        data={data.mostWatchedGenres}
        title="Most watched genres"
        yAxisKey="genre"
        tooltipTitle="Movies"
      />
      {data.byDirector.length > 0 && (
        <StatsList title="Best rated directors (Min. 2 movies)">
          {data.byDirector.map((director) => (
            <PersonRating data={director} scope="Movies" />
          ))}
        </StatsList>
      )}
      {data.mostWatchedDirectors.length > 0 && (
        <StatsList title="Most watched directors">
          {data.mostWatchedDirectors.map((director) => (
            <PersonRating data={director} scope="Movies" />
          ))}
        </StatsList>
      )}
      <LogsByYear
        data={data.logsByYear}
        title="Movies watched per year"
        tooltipTitle="Movies"
      />
      {data.mostWatchedActors.length > 0 && (
        <StatsList title="Most watched actors">
          {data.mostWatchedActors.map((actor) => (
            <PersonRating data={actor} scope="Movies" />
          ))}
        </StatsList>
      )}
      {data.mostWatchedMovies.length > 0 && (
        <StatsList title="Most watched movies">
          {data.mostWatchedMovies.map((movie) => (
            <MediaStat data={movie} />
          ))}
        </StatsList>
      )}
    </div>
  )
}

export default MovieStats
