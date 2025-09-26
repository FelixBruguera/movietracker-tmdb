import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router"
import PersonLink from "../people/PersonLink"
import MovieListTitle from "./MovieListTitle"
import CreditsSkeleton from "./CreditsSkeleton"

const CreditsList = ({ title, list }) => {
  return (
    <div className="flex flex-col items-center border-t-2 pt-2 border-t-ring-foreground">
      <MovieListTitle title={title} />
      <ul className="flex flex-wrap py-2 justify-center gap-y-2 items-center">
        {list.map((item) => (
          <PersonLink
            name={item.name}
            id={item.id}
            image={item.profile_path}
            role={item.job || item.character}
          />
        ))}
      </ul>
    </div>
  )
}

const MovieCredits = ({ path = "movies" }) => {
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: [path, "credits", id],
    queryFn: () =>
      axios.get(`/api/${path}/${id}/credits`).then((response) => response.data),
  })
  if (isLoading) {
    return <CreditsSkeleton />
  }
  const title = data.title || data.name
  const date = data.release_date || data.first_air_date
  return (
    <div className="lg:px-9 mx-auto">
      <div className="py-3">
        <h1 className="text-2xl lg:text-3xl font-bold text-center">
          {title} ({new Date(date).getFullYear()})
        </h1>
      </div>
      {data.credits.cast?.length > 0 && (
        <CreditsList title="Cast" list={data.credits.cast} />
      )}
      {data.credits.crew?.length > 0 && (
        <CreditsList title="Crew" list={data.credits.crew} />
      )}
    </div>
  )
}

export default MovieCredits
