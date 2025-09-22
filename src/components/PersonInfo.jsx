import { BriefcaseBusiness, Cake, MapPin } from "lucide-react"
import Poster from "./Poster"
import MovieDetail from "./MovieDetail"
import MovieDescription from "./MovieDescription"
import PersonInfoSkeleton from "./PersonInfoSkeleton"
import MovieDescriptionContainer from "./MovieDescriptionContainer"

const PersonInfo = ({ data, isLoading }) => {
  if (isLoading) {
    return <PersonInfoSkeleton />
  }
  return (
    <div className="mb-5 lg:mb-0">
      <div className="items-start gap-2 grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_5fr] grid-rows-[4fr_15%] lg:w-7/10">
        <Poster
          src={data.profile_path}
          size="small"
          alt={data.name}
          type="person"
        />
        <div className="flex flex-col gap-5 justify-between col-start-2 row-start-1">
          <div className="flex flex-col gap-1 row-start-2 col-start-2">
            <h1 className="font-bold text-xl lg:text-2xl">{data.name}</h1>
            <MovieDescriptionContainer
              description={data.biography}
              length={250}
            />
          </div>
        </div>
        <div className="flex col-span-full row-start-2 items-center justify-start lg:justify-items-start lg:justify-start gap-2 lg:gap-2 lg:col-start-2">
          {data.birthday && (
            <MovieDetail title="Birthday">
              <Cake />
              <p className="text-xs lg:text-sm text-muted-foreground">
                {data.birthday}
              </p>
            </MovieDetail>
          )}
          {data.place_of_birth && (
            <MovieDetail title="Place of birth">
              <MapPin />
              <p className="text-xs lg:text-sm text-muted-foreground">
                {data.place_of_birth}
              </p>
            </MovieDetail>
          )}
          {data.known_for_department && (
            <MovieDetail title="Main role">
              <BriefcaseBusiness />
              <p className="text-xs lg:text-sm text-muted-foreground">
                {data.known_for_department}
              </p>
            </MovieDetail>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonInfo
