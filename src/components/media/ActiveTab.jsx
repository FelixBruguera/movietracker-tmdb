import { Link } from "react-router"
import MovieServices from "./MovieServices"
import Poster from "../shared/Poster"
import HorizontalList from "../shared/HorizontalList"
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
    case "Seasons":
      const SeasonDetail = ({ title, children }) => (
        <p
          className="text-xs lg:text-sm bg-card-bg px-2 py-1 rounded-sm text-muted-foreground hover:bg-accent hover:text-white active:bg-accent transition-colors group-hover:bg-background"
          title={title}
        >
          {children}
        </p>
      )
      return (
        <>
          <MovieListTitle title="Seasons" />
          <ul className="scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-muted flex flex-col gap-y-5">
            {movie.seasons?.map((season) => {
              const airYear = season.air_date?.slice(0, 4)
              return (
                <li
                  key={season.id}
                  className="flex flex-col lg:flex-row justify-start gap-6 lg:gap-2 py-1 hover:bg-card-bg rounded-md transition-colors lg:pr-5 group"
                >
                  <Poster src={season.poster_path} size="small" />
                  <div className="w-full lg:w-9/10 px-2 flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2 flex-wrap">
                      <h2 className="font-bold text-xl lg:text-2xl">
                        {season.name}
                      </h2>
                      <div className="flex items-center justify-start gap-2">
                        {airYear && (
                          <SeasonDetail title="Release year">
                            {airYear}
                          </SeasonDetail>
                        )}
                        {season.episode_count && (
                          <SeasonDetail>
                            {season.episode_count} Episodes
                          </SeasonDetail>
                        )}
                      </div>
                    </div>
                    <p className="text-sm lg:text-base text-muted-foreground text-justify w-full lg:max-w-19/20">
                      {season.overview}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
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
