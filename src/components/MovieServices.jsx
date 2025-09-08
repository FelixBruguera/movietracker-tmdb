import useRegion from "../stores/region"
import HorizontalList from "./HorizontalList"
import MovieListTitle from "./MovieListTitle"
import Poster from "./Poster"
import { Link } from "react-router"

const AvailabilityList = ({ title, services, path = "/" }) => {
  const region = useRegion((state) => state.details.code)
  console.log(services)
  return (
    services && (
      <div className="flex items-center py-3  border-b-2 border-b-input dark:border-b-muted">
        <h2 className="w-30 font-semibold text-lg">{title}</h2>
        <ul className="flex items-center justify-start overflow-x-auto">
          {services.map((service) => (
            <li key={service.provider_id}>
              <Link
                to={`${path}?watch_region=${region}&&with_watch_providers=${service.provider_id}`}
                className="flex flex-col items-center justify-center w-35 gap-2"
              >
                <Poster
                  src={service.logo_path}
                  alt={service.provider_name}
                  size="company"
                />
                <p className="text-muted-foreground dark:text-muted-foreground text-sm whitespace-nowrap text-ellipsis max-w-9/10 overflow-hidden">
                  {service.provider_name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  )
}

const MovieServices = ({ data, path }) => {
  if (!data) {
    return <h2 className="w-30 font-semibold text-lg">No data</h2>
  }
  return (
    <div>
      <MovieListTitle title="Service availability" />
      <AvailabilityList title="Free" services={data.free} path={path} />
      <AvailabilityList title="Free with ads" services={data.ads} path={path} />
      <AvailabilityList
        title="Subscription"
        services={data.flatrate}
        path={path}
      />
      <AvailabilityList title="Rent" services={data.rent} path={path} />
      <AvailabilityList title="Buy" services={data.buy} path={path} />
    </div>
  )
}

export default MovieServices
