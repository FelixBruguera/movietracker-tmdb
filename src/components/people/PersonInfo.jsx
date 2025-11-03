import Poster from "../shared/Poster"
import MovieDetail from "../media/MovieDetail"
import PersonInfoSkeleton from "./PersonInfoSkeleton"
import MovieDescriptionContainer from "../media/MovieDescriptionContainer"
import { format } from "date-fns"

const PersonDetail = ({ name, detail }) => {
  if (!detail) {
    return null
  }
  return (
    <li className="flex flex-col w-full items-start hover:bg-card-bg px-2 py-1 rounded-md group transition-colors">
      <h3 className="text-base font-semibold border-b-2 border-b-stone-300 dark:border-b-stone-700 group-hover:border-b-accent dark:group-hover:border-b-accent transition-colors">
        {name}
      </h3>
      <p className="text-sm mt-1">{detail}</p>
    </li>
  )
}

const PersonInfo = ({ data, isLoading }) => {
  if (isLoading) {
    return <PersonInfoSkeleton />
  }
  const imageBaseUrl = "https://image.tmdb.org/t/p/w185"
  const formattedBirthday = data.birthday && format(data.birthday, "MMMM d Y")
  return (
    <div className="mb-5 lg:mb-0">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 w-full px-5">
        <img
          src={
            data.profile_path
              ? `${imageBaseUrl}${data.profile_path}`
              : "/person-fallback.webp"
          }
          className="rounded-sm"
          alt={data.name}
        />
        <div className="flex flex-col gap-5 justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-xl lg:text-2xl w-fit">{data.name}</h1>
            <MovieDescriptionContainer
              description={data.biography}
              length={400}
            />
          </div>
        </div>
        <ul className="flex flex-row lg:flex-col items-start lg:items-end justify-evenly lg:justify-end gap-2 w-full lg:w-1/4 xl:w-1/5">
          <PersonDetail name="Known for" detail={data.known_for_department} />
          <PersonDetail name="Birthday" detail={formattedBirthday} />
          <PersonDetail name="Place of birth" detail={data.place_of_birth} />
        </ul>
      </div>
    </div>
  )
}

export default PersonInfo
