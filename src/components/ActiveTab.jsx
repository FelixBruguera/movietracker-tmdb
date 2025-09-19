import { Link } from "react-router"
import MovieServices from "./MovieServices"
import Poster from "./Poster"
import HorizontalList from "./HorizontalList"
import MovieListTitle from "./MovieListTitle"
import MovieItemList from "./MovieItemList"
import MovieDetailLink from "./MovieDetailLink"
import CompanyLink from "./CompanyLink"

const ItemList = (props) => {
  return (
    <ul className="px-3 py-2 lg:px-0 flex flex-wrap gap-2 lg:max-w-9/10">
      {props.children}
    </ul>
  )
}

const TabRenderer = ({ movie, tab }) => {
  switch (tab) {
    case "Cast":
      return (
        <MovieItemList
          path="./credits"
          title="Main Cast"
          items={movie.credits.cast}
        />
      )
    case "Directors":
      return (
        <MovieItemList
          path="./credits"
          title="Directors"
          items={movie.credits.directors}
        />
      )
    case "Crew":
      return (
        <MovieItemList
          path="./credits"
          title="Main Crew"
          items={movie.credits.crew}
        />
      )
    case "Companies":
      return (
        <>
          <MovieListTitle title="Production companies" />
          <ItemList>
            {movie.production_companies.map((item) => (
              <CompanyLink
                name={item.name}
                id={item.id}
                image={item.logo_path}
              />
            ))}
          </ItemList>
        </>
      )
    case "Keywords":
      return (
        <>
          <MovieListTitle title="Keywords" />
          <ItemList>
            {movie.keywords.keywords.map((keyword) => (
              <MovieDetailLink
                href={`/?with_keywords=${encodeURIComponent(JSON.stringify([keyword]))}`}
              >
                {keyword.name}
              </MovieDetailLink>
            ))}
          </ItemList>
        </>
      )
    case "Similar":
      return (
        <>
          <MovieListTitle title="Similar movies" />
          <HorizontalList>
            {movie.recommendations.results.map((item) => (
              <Link to={`/movies/${item.id}`} className="contents">
                <Poster src={item.poster_path} alt={item.title} size="small" />
              </Link>
            ))}
          </HorizontalList>
        </>
      )
    case "Services":
      return <MovieServices data={movie["watch/providers"]?.results} />
  }
}

const ActiveTab = ({ movie, tab }) => {
  return (
    <div className="min-h-60 w-full">
      <TabRenderer movie={movie} tab={tab} />
    </div>
  )
}

export default ActiveTab
