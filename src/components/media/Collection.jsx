import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Link, useParams } from "react-router"
import Poster from "../shared/Poster"
import MovieSkeleton from "./MovieSkeleton"
import ErrorMessage from "../shared/ErrorMessage"
import PosterList from "../shared/PosterList"
import ListHeading from "../shared/ListHeading"
import ListHeadingTitle from "../shared/ListHeadingTitle"
import Total from "../shared/Total"
import MediaCard from "./MediaCard"
import CollectionSkeleton from "./CollectionSkeleton"
import MediaCardDetail from "./MediaCardDetail"
import ListCollectionDialog from "../lists/ListCollectionDialog"
import DialogWrapper from "../shared/DialogWrapper"
import { List } from "lucide-react"

const Collection = ({}) => {
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["collection", id],
    queryFn: () =>
      axios
        .get(`/api/movies/collection/${id}`)
        .then((response) => response.data),
  })
  const baseUrl = "https://image.tmdb.org/t/p/"
  if (isLoading) {
    return <CollectionSkeleton />
  }
  if (isError) {
    return <ErrorMessage />
  }
  const backdropUrl = `${baseUrl}w1280${data.backdrop_path}`
  return (
    <div className="min-h-dvh py-5 lg:w-300 mx-auto">
      <title>{data.name}</title>
      <div
        className="relative w-full bg-no-repeat bg-center aspect-16/9 lg:aspect-16/4 flex items-center justify-start"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <span className="absolute left-0 w-full bg-linear-to-b from-transparent to-background h-full z-0"></span>
      </div>
      <div className="flex items-start justify-between gap-3 mt-3 mx-auto w-full">
        <div className="flex items-start gap-4">
          <span className="flex items-end w-4/10 md:w-fit">
            <Poster src={data.poster_path} size="small" type="movie" />
          </span>
          <div className="w-fit flex-col">
            <h2 className="text-2xl lg:text-3xl font-bold w-fit">
              {data.name}
            </h2>
            {data.overview && (
              <p className="text-muted-foreground text-sm lg:text-base text-justify w-full lg:max-w-7/10">
                {data.overview}
              </p>
            )}
          </div>
        </div>
        <DialogWrapper
          title={`${data.name} in your lists`}
          label="Add or remove from lists"
          Icon={List}
          contentClass="min-w-1/3 max-h-8/10 overflow-y-auto"
        >
          <ListCollectionDialog collectionId={id} />
        </DialogWrapper>
      </div>
      <ListHeading>
        <ListHeadingTitle title="Movies">
          <Total total={data.parts.length} label="Total Movies" />
        </ListHeadingTitle>
      </ListHeading>
      {data.parts?.map((movie) => {
        return (
          <Link to={`/movies/${movie.id}`}>
            <MediaCard
              id={movie.id}
              title={movie.title}
              src={movie.poster_path}
              overview={movie.overview}
            >
              {movie.release_date && (
                <MediaCardDetail title="Release year">
                  {new Date(movie.release_date).getFullYear()}
                </MediaCardDetail>
              )}
            </MediaCard>
          </Link>
        )
      })}
    </div>
  )
}

export default Collection
