import { useQuery } from "@tanstack/react-query"
import MovieSkeleton from "./MovieSkeleton"
import { Calendar, Clock4, Languages, LibraryBig, Trophy } from "lucide-react"
import MovieDetail from "./MovieDetail"
import MovieDetailLink from "./MovieDetailLink"
import MovieDetailsList from "./MovieDetailsList"
// import Reviews from "src/components/Reviews"
import Poster from "./Poster"
import ErrorMessage from "./ErrorMessage"
// import LogManager from "src/components/LogManager"
import { authClient } from "../../lib/auth-client.ts"
// import NewLog from "src/components/NewLog"
// import DialogWrapper from "src/components/DialogWrapper"
import MovieDescription from "./MovieDescription"
import axios from "axios"
import MovieRating from "./MovieRating"
import { useParams } from "react-router"
import MovieListTitle from "./MovieListTitle.jsx"
import PersonLink from "./PersonLink.jsx"

export default function MoviePage() {
  const { id } = useParams()
  console.log(id)
  const { data: session } = authClient.useSession()

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () =>
      axios.get(`/api/movies/${id}`).then((response) => response.data),
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
  const hours = movie.runtime && Math.floor(movie.runtime / 60)
  const minutes = movie.runtime && Math.floor(movie.runtime % 60)
  const runtime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  return (
    <div className="mx-auto p-4">
      <title>{movie.title}</title>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-3/4 mx-auto lg:w-1/3">
          <Poster src={movie.poster_path} alt={movie.title} size="large" />
        </div>
        <div className="w-full lg:w-2/3 flex flex-col gap-3">
          <div className="flex items-center justify-between w-full lg:w-11/12">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 mx-3 lg:mx-0">
              {movie.title}
            </h1>
            {/* <div className="flex items-center gap-4 lg:gap-2">
              {session && (
                <>
                  <LogManager movie={movie} />
                  <DialogWrapper
                    title="New log"
                    label="Add a new log"
                    movie={movie}
                  >
                    <NewLog />
                  </DialogWrapper>
                </>
              )}
            </div>*/}
          </div>
          <MovieDetailsList>
            <MovieDetail title="Release year">
              <Calendar />
              {new Date(movie.release_date).getFullYear()}
            </MovieDetail>
            {movie.runtime && (
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
            {/* <MovieRating
              source="Rotten Tomatoes"
              value={movie.tomatoes?.critic?.rating}
              logo="/tomatoes.png"
            />
            <MovieRating
              source="Metacritic"
              value={movie.metacritic}
              logo="/metacritic.png"
            />
            <MovieDetail title="Awards">
              <Trophy fill="goldenrod" color="goldenrod" />
              {movie.awards.wins} Awards
            </MovieDetail> */}
            {movie.spoken_languages?.map((lang) => (
              <MovieDetailLink
                href={`/?with_original_language=${lang.iso_639_1}`}
              >
                <Languages />
                {lang.english_name}
              </MovieDetailLink>
            ))}
            {movie.genres?.map((genre) => (
              <MovieDetailLink href={`/?with_genres=${genre.id}`}>
                <LibraryBig />
                {genre.name}
              </MovieDetailLink>
            ))}
          </MovieDetailsList>
          <div className="flex flex-col items-start gap-3 text-base text-slate-800 dark:text-stone-300 text-justify w-9/10 my-1 mx-3 lg:mx-0">
            {movie.overview?.length > 1000 ? (
              <MovieDescription description={movie.overview} />
            ) : (
              <p>{movie.overview}</p>
            )}
          </div>
          {movie.credits.cast?.length > 0 && (
            <div>
              <MovieListTitle title="Main Cast" />
              <ul className="flex overflow-x-auto overflow-y-hidden py-2 justify-start items-center scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-muted">
                {movie.credits.cast.map((item) => (
                  <PersonLink
                    name={item.name}
                    id={item.id}
                    image={item.profile_path}
                  />
                ))}
              </ul>
            </div>
          )}
          {movie.credits.crew?.length > 0 && (
            <div>
              <MovieListTitle title="Main Crew" />
              <ul className="flex overflow-x-auto overflow-y-hidden py-2 justify-start items-center scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-muted">
                {movie.credits.crew.map((item) => (
                  <PersonLink
                    name={item.name}
                    id={item.id}
                    image={item.profile_path}
                    role={item.job}
                  />
                ))}
              </ul>
            </div>
          )}
          {movie.keywords?.keywords?.length > 0 && (
            <div>
              <MovieListTitle title="Keywords" />
              <ul className="px-3 lg:px-0 flex flex-wrap gap-2">
                {movie.keywords.keywords.map((keyword) => (
                  <MovieDetailLink
                    href={`/?with_keywords=${encodeURIComponent(JSON.stringify([keyword]))}`}
                  >
                    {keyword.name}
                  </MovieDetailLink>
                ))}
              </ul>
            </div>
          )}
          {/* {movie.directors?.length > 0 && (
            <MovieLinkList
              title="Directors"
              items={movie.directors}
              param="directors"
            />
          )} */}
        </div>
      </div>
      {/* <Reviews /> */}
    </div>
  )
}
