import { useQuery } from "@tanstack/react-query"
import MovieSkeleton from "./MovieSkeleton.jsx"
import {
  Calendar,
  Clock4,
  Languages,
  LibraryBig,
  List,
  NotebookPen,
  Star,
  Tv,
} from "lucide-react"
import MovieDetail from "./MovieDetail.jsx"
import MovieDetailLink from "./MovieDetailLink.jsx"
import MovieDetailsList from "./MovieDetailsList.jsx"
import Reviews from "../reviews/Reviews.jsx"
import Poster from "../shared/Poster.jsx"
import ErrorMessage from "../shared/ErrorMessage.jsx"
import LogManager from "../diary/LogManager.jsx"
import { authClient } from "@lib/auth-client.ts"
import axios from "axios"
import MovieRating from "./MovieRating.jsx"
import { useLocation, useParams } from "react-router"
import { useState } from "react"
import MovieTab from "./MovieTab.jsx"
import useRegion from "@stores/region"
import ActiveTab from "./ActiveTab.jsx"
import MovieDescriptionContainer from "./MovieDescriptionContainer.jsx"
import DialogWrapper from "../shared/DialogWrapper.jsx"
import ReviewDialog from "../reviews/ReviewDialog.jsx"
import ListMovieDialog from "../lists/ListMovieDialog.jsx"
import DiaryLogForm from "../diary/DiaryLogForm.jsx"

const Media = ({ isTv }) => {
  const { id } = useParams()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("Cast")
  const region = useRegion((state) => state.details.code)
  console.log(id)
  const { data: session } = authClient.useSession()
  const endpoint = isTv ? "tv" : "movies"
  const cacheKey = isTv ? "tv" : "movie"
  const linkPath = isTv ? "tv" : ""

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [cacheKey, id, region],
    queryFn: () =>
      axios
        .get(`/api/${endpoint}/${id}`, { params: { region: region } })
        .then((response) => response.data),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col justify-between">
        <MovieSkeleton />
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage />
  }
  const tabs = isTv
    ? [
        "Cast",
        "Created by",
        "Crew",
        "Companies",
        "Networks",
        "Keywords",
        "Services",
        "Similar",
      ]
    : [
        "Cast",
        "Directors",
        "Crew",
        "Companies",
        "Keywords",
        "Services",
        "Similar",
      ]
  const hours = movie.runtime && Math.floor(movie.runtime / 60)
  const minutes = movie.runtime && Math.floor(movie.runtime % 60)
  const runtime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  const title = movie.title || movie.name
  const mediaId = location.pathname.includes("tv")
    ? `tv_${movie.id}`
    : `movies_${movie.id}`
  return (
    <div className="mx-auto w-9/10 lg:w-full">
      <title>{title}</title>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="mx-auto w-8/10 lg:w-3/10">
          <Poster src={movie.poster_path} alt={title} size="large" />
        </div>
        <div className="w-full lg:w-7/10 2xl:w-8/10 flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-2 lg:gap-0 mb-0">
            <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
            <div className="flex items-center gap-4 lg:gap-2">
              {session && (
                <>
                  <LogManager mediaId={mediaId} mediaTitle={title} />
                  <DialogWrapper
                    title={`Adding a log for ${title}`}
                    label="Add to your diary"
                    Icon={NotebookPen}
                    contentClass="min-w-1/3"
                  >
                    <DiaryLogForm mediaId={mediaId} />
                  </DialogWrapper>
                  <DialogWrapper
                    title={`Your review of ${title}`}
                    label="Add or manage your review"
                    Icon={Star}
                    contentClass="min-w-1/3"
                  >
                    <ReviewDialog mediaId={mediaId} />
                  </DialogWrapper>
                  <DialogWrapper
                    title={`${title} in your lists`}
                    label="Add or remove from lists"
                    Icon={List}
                    contentClass="min-w-1/3 max-h-8/10 overflow-y-auto"
                  >
                    <ListMovieDialog mediaId={mediaId} />
                  </DialogWrapper>
                </>
              )}
            </div>
          </div>
          <MovieDetailsList>
            <MovieDetail title="Release year">
              <Calendar />
              {new Date(
                movie.release_date || movie.first_air_date,
              ).getFullYear()}
            </MovieDetail>
            {movie.number_of_seasons && (
              <MovieDetail title="Seasons">
                <Tv />
                {movie.number_of_seasons} Seasons
              </MovieDetail>
            )}
            {movie.number_of_seasons && (
              <MovieDetail title="Episodes">
                <Tv />
                {movie.number_of_episodes} Episodes
              </MovieDetail>
            )}
            {movie.runtime > 0 && (
              <MovieDetail title="Runtime">
                <Clock4 />
                {runtime}
              </MovieDetail>
            )}
            <MovieRating
              source="TMDB"
              value={movie.vote_average.toFixed(2)}
              logo="/tmdb_short.svg"
            />
            <MovieRating
              source="TMDB"
              value={`${movie.vote_count} votes`}
              logo="/tmdb_short.svg"
            />
            {movie.spoken_languages?.map((lang) => (
              <MovieDetailLink
                key={lang.iso_639_1}
                href={`/${linkPath}?with_original_language=${lang.iso_639_1}`}
              >
                <Languages />
                {lang.english_name}
              </MovieDetailLink>
            ))}
            {movie.genres?.map((genre) => (
              <MovieDetailLink
                key={genre.id}
                href={`/${linkPath}?with_genres=${genre.id}`}
              >
                <LibraryBig />
                {genre.name}
              </MovieDetailLink>
            ))}
          </MovieDetailsList>
          <MovieDescriptionContainer description={movie.overview} />
          <div className="flex flex-wrap pb-3 lg:pb-0 justify-start gap-3">
            {tabs.map((tab) => (
              <MovieTab
                key={tab}
                title={tab}
                isActive={activeTab === tab}
                setActiveTab={setActiveTab}
              />
            ))}
          </div>
          <ActiveTab movie={movie} tab={activeTab} isTv={isTv} />
        </div>
      </div>
      <Reviews movie={movie} mediaId={mediaId} />
    </div>
  )
}

export default Media
