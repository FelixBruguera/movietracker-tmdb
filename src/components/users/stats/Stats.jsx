import { useState } from "react"
import MovieStats from "./MovieStats"
import { Button } from "@ui/button"
import TVStats from "./TVStats"
import { Link, useParams } from "react-router"

const Stats = () => {
  const { id, scope } = useParams()
  return (
    <div>
      <div className="flex items-center mx-auto w-full justify-center gap-10 my-5">
        <Link to={`/users/${id}/stats/movies`}>
          <Button
            variant="outline"
            className={`transition-colors ${scope === "movies" && "!bg-accent text-white"}`}
          >
            Movies
          </Button>
        </Link>
        <Link to={`/users/${id}/stats/tv`}>
          <Button
            variant="outline"
            className={`transition-colors ${scope === "tv" && "!bg-accent text-white "}`}
          >
            TV
          </Button>
        </Link>
      </div>
      {scope === "movies" ? <MovieStats /> : <TVStats />}
    </div>
  )
}

export default Stats
