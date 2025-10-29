import { formatInTimeZone } from "date-fns-tz"
import Poster from "../shared/Poster"
import { Link } from "react-router"

const DiaryRow = ({ data, group }) => {
  console.log([data, group])
  const date =
    group === "yearly"
      ? formatInTimeZone(new Date(data.group), "UTC", "yyyy")
      : formatInTimeZone(new Date(data.group), "UTC", "MMMM u")
  return (
    <li key={date} className="flex flex-col items-center justify-start group">
      <p className="my-3 p-1 w-full text-center font-bold text-lg lg:text-xl border-b-1 border-border dark:border-border">
        {date}
      </p>
      <div className="flex flex-wrap w-full items-center justify-start gap-1 lg:gap-5">
        {data.entries.map((movie) => {
          const path = movie.mediaId.includes("tv") ? "tv" : "movies"
          const id = movie.mediaId.split("_")[1]
          const logDate =
            group === "yearly"
              ? formatInTimeZone(new Date(movie.date * 1000), "UTC", "MMMM do")
              : formatInTimeZone(new Date(movie.date * 1000), "UTC", "EEEE do")
          return (
            <Link
              key={movie.diaryId}
              to={`/${path}/${id}`}
              className="flex flex-col items-center gap-1"
            >
              <Poster src={movie.poster_path} alt={movie.title} size="small" />
              <p className="text-sm text-muted-foreground text-center">
                {logDate}
              </p>
            </Link>
          )
        })}
      </div>
    </li>
  )
}

export default DiaryRow
