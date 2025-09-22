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
    <ul className="py-2 px-0 flex flex-wrap gap-2 lg:max-w-8/10">
      {props.children}
    </ul>
  )
}

const TabRenderer = ({ movie, tab, isTv }) => {
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
      const companyPath = isTv ? "tv/company" : "movies/company"
      return (
        <>
          <MovieListTitle title="Production companies" />
          <ItemList>
            {movie.production_companies.map((item) => (
              <CompanyLink
                name={item.name}
                id={item.id}
                image={item.logo_path}
                path={companyPath}
              />
            ))}
          </ItemList>
        </>
      )
    case "Keywords":
      const keywords = movie.keywords.keywords || movie.keywords.results
      const keywordPath = isTv ? "tv" : ""
      return (
        <>
          <MovieListTitle title="Keywords" />
          <ItemList>
            {keywords.map((keyword) => (
              <MovieDetailLink
                href={`/${keywordPath}?with_keywords=${encodeURIComponent(JSON.stringify([keyword]))}`}
              >
                {keyword.name}
              </MovieDetailLink>
            ))}
          </ItemList>
        </>
      )
    case "Similar":
      const title = isTv ? "Shows" : "Movies"
      const path = isTv ? "tv" : "movies"
      return (
        <>
          <MovieListTitle title={`Similar ${title}`} />
          <HorizontalList>
            {movie.recommendations.results.map((item) => (
              <Link to={`/${path}/${item.id}`} className="contents">
                <Poster src={item.poster_path} alt={item.title} size="small" />
              </Link>
            ))}
          </HorizontalList>
        </>
      )
    case "Services":
      const servicesPath = isTv ? "/tv" : "/"
      return (
        <MovieServices
          data={movie["watch/providers"]?.results}
          path={servicesPath}
        />
      )
    case "Created by":
      return (
        <MovieItemList
          path="./credits"
          title="Created by"
          items={movie.created_by}
        />
      )
    case "Networks":
      return (
        <div>
          <MovieListTitle title="Networks" />
          <ItemList>
            {movie.networks.map((item) => (
              <CompanyLink name={item.name} id={item.id} path="tv/network" />
            ))}
          </ItemList>
        </div>
      )
  }
}

const ActiveTab = ({ movie, tab, isTv }) => {
  return (
    <div className="min-h-60 w-full">
      <TabRenderer movie={movie} tab={tab} isTv={isTv} />
    </div>
  )
}

export default ActiveTab
