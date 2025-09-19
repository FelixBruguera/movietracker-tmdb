import { useQuery } from "@tanstack/react-query"
import MovieSkeleton from "./MovieSkeleton"
import {
  ActivitySquareIcon,
  Calendar,
  Clock4,
  Languages,
  LibraryBig,
  List,
  Star,
  Trophy,
} from "lucide-react"
import MovieDetail from "./MovieDetail"
import MovieDetailLink from "./MovieDetailLink"
import MovieDetailsList from "./MovieDetailsList"
import Reviews from "./Reviews"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
// import LogManager from "src/components/LogManager"
import { authClient } from "../../lib/auth-client.ts"
// import NewLog from "src/components/NewLog"
// import DialogWrapper from "src/components/DialogWrapper"
import MovieDescription from "./MovieDescription"
import axios from "axios"
import MovieRating from "./MovieRating"
import { Link, useParams } from "react-router"
import MovieListTitle from "./MovieListTitle.jsx"
import PersonLink from "./PersonLink.jsx"
import { useState } from "react"
import MovieTab from "./MovieTab.jsx"
import MovieItemList from "./MovieItemList.jsx"
import HorizontalList from "./HorizontalList.jsx"
import CompanyLink from "./CompanyLink.jsx"
import MovieList from "./PosterList.jsx"
import useRegion from "../stores/region.jsx"
import MovieServices from "./MovieServices.jsx"
import ActiveTab from "./ActiveTab.jsx"
import MovieDescriptionContainer from "./MovieDescriptionContainer.jsx"
import DialogWrapper from "./DialogWrapper.jsx"
import ReviewDialog from "./ReviewDialog.jsx"
import ListMovieDialog from "./ListMovieDialog.jsx"

const Movie = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("Cast")
  const region = useRegion((state) => state.details.code)
  console.log(id)
  const { data: session } = authClient.useSession()

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie", id, region],
    queryFn: () =>
      axios
        .get(`/api/movies/${id}`, { params: { region: region } })
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
  const tabs = [
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
  return (
    <div className="mx-auto w-full 2xl:w-9/10 p-4">
      <title>{movie.title}</title>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="mx-auto w-8/10 lg:w-3/10">
          <Poster src={movie.poster_path} alt={movie.title} size="large" />
        </div>
        <div className="w-full lg:w-7/10 2xl:w-8/10 flex flex-col gap-3">
          <div className="flex items-center justify-between w-full lg:w-11/12">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 mx-3 lg:mx-0">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 lg:gap-2">
              {session && (
                <>
                  {/* <LogManager movie={movie} /> */}
                  <DialogWrapper
                    title={`Your review of ${movie.title || movie.name}`}
                    label="Add or manage your review"
                    Icon={Star}
                    contentClass="min-w-1/3"
                  >
                    <ReviewDialog movie={movie} />
                  </DialogWrapper>
                  <DialogWrapper
                    title={`${movie.title || movie.name} in your lists`}
                    label="Add or remove from lists"
                    Icon={List}
                    contentClass="min-w-1/3 max-h-8/10 overflow-y-auto"
                  >
                    <ListMovieDialog movie={movie} />
                  </DialogWrapper>
                </>
              )}
            </div>
          </div>
          <MovieDetailsList>
            <MovieDetail title="Release year">
              <Calendar />
              {new Date(movie.release_date).getFullYear()}
            </MovieDetail>
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
                href={`/?with_original_language=${lang.iso_639_1}`}
              >
                <Languages />
                {lang.english_name}
              </MovieDetailLink>
            ))}
            {movie.genres?.map((genre) => (
              <MovieDetailLink
                key={genre.id}
                href={`/?with_genres=${genre.id}`}
              >
                <LibraryBig />
                {genre.name}
              </MovieDetailLink>
            ))}
          </MovieDetailsList>
          <MovieDescriptionContainer description={movie.overview} />
          <div className="flex flex-wrap pb-3 lg:pb-0 justify-start gap-3 mx-3 lg:mx-0">
            {tabs.map((tab) => (
              <MovieTab
                key={tab}
                title={tab}
                isActive={activeTab === tab}
                setActiveTab={setActiveTab}
              />
            ))}
          </div>
          <ActiveTab movie={movie} tab={activeTab} />
        </div>
      </div>
      <Reviews movie={movie} />
    </div>
  )
}

export default Movie
