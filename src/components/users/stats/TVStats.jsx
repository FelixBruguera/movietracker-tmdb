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
import NetworkRating from "./NetworkRating"
import RatingDistribution from "./RatingDistribution"
import ChartHeading from "./ChartHeading"
import Heatmap from "./Heatmap"

const TVStats = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["TVStats", id],
    queryFn: () =>
      axios.get(`/api/users/${id}/stats/tv`).then((response) => response.data),
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
      {Object.keys(data.monthlyHeatmap).length > 0 && (
        <ChartHeading title="Activity by month">
          <Heatmap
            data={data.monthlyHeatmap}
            values={months}
            tooltipTitle="Shows"
          />
        </ChartHeading>
      )}
      <RatingsByYear
        data={data.byYear}
        title="Average Rating by First Aired Year"
        xAxisDataKey="year"
        tooltipTitle="Shows"
      />
      <RatingsByYear
        data={data.byDecade}
        title="Average Rating by First Aired Decade"
        xAxisDataKey="decade"
        tooltipTitle="Shows"
      />
      <RatingDistribution data={data.ratingDistribution} tooltipTitle="Shows" />
      <RatingVerticalBarChart
        data={data.byGenre}
        title="Best rated genres (Min. 2 shows)"
        tooltipTitle="Shows"
      />
      <DiaryVerticalBarChart
        data={data.mostWatchedGenres}
        title="Most watched genres"
        yAxisKey="genre"
        tooltipTitle="Shows"
      />
      {data.bestRatedCreators.length > 0 && (
        <StatsList title="Best rated creators (Min. 2 shows)">
          {data.bestRatedCreators.map((creator) => (
            <PersonRating data={creator} scope="Shows" />
          ))}
        </StatsList>
      )}
      {data.mostWatchedCreators.length > 0 && (
        <StatsList title="Most watched creators">
          {data.mostWatchedCreators.map((creator) => (
            <PersonRating data={creator} scope="Shows" />
          ))}
        </StatsList>
      )}
      <LogsByYear
        data={data.logsByYear}
        title="Shows watched per year"
        tooltipTitle="Shows"
      />
      {data.mostWatchedActors.length > 0 && (
        <StatsList title="Most watched actors">
          {data.mostWatchedActors.map((actor) => (
            <PersonRating data={actor} scope="Shows" />
          ))}
        </StatsList>
      )}
      {data.bestRatedNetworks.length > 0 && (
        <StatsList title="Best rated networks">
          {data.bestRatedNetworks.map((actor) => (
            <NetworkRating data={actor} />
          ))}
        </StatsList>
      )}
      {data.mostWatchedNetworks.length > 0 && (
        <StatsList title="Most watched networks">
          {data.mostWatchedNetworks.map((actor) => (
            <NetworkRating data={actor} />
          ))}
        </StatsList>
      )}
      {data.mostWatchedShows.length > 0 && (
        <StatsList title="Most watched shows">
          {data.mostWatchedShows.map((movie) => (
            <MediaStat data={movie} />
          ))}
        </StatsList>
      )}
    </div>
  )
}

export default TVStats
