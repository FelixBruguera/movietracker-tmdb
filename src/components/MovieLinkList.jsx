import { IDLE_FETCHER } from "react-router"
import MovieDetailLink from "./MovieDetailLink"
import MovieDetailList from "./MovieDetailsList"
import PersonLink from "./PersonLink"

const MovieLinkList = ({ title, items, param }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 lg:text-justify mx-3 lg:mx-0">
        {title}
      </h2>
      <ul className="flex overflow-x-auto overflow-y-hidden h-45 justify-start items-center scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-muted">
        {items.map((item) => (
          <PersonLink name={item.name} id={item.id} image={item.profile_path}/>
        ))}
      </ul>
    </div>
  )
}

export default MovieLinkList