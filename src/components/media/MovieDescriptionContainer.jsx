import Description from "../shared/Description"
import MovieDescription from "./MovieDescription"

const MovieDescriptionContainer = ({ description, length = 800 }) => {
  return (
    <div className="flex flex-col items-start gap-3 text-base text-muted-foreground dark:text-muted-foreground text-justify w-9/10 lg:w-8/10 my-1">
      {description?.length > length ? (
        <MovieDescription description={description} length={length} />
      ) : (
        <Description text={description} />
      )}
    </div>
  )
}

export default MovieDescriptionContainer
