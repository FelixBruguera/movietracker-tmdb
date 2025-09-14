import MovieDescription from "./MovieDescription"

const MovieDescriptionContainer = ({ description }) => {
  return (
    <div className="flex flex-col items-start gap-3 text-base text-muted-foreground dark:text-muted-foreground text-justify w-8/10 my-1 mx-3 lg:mx-0">
      {description?.length > 1000 ? (
        <MovieDescription description={description} />
      ) : (
        <p>{description}</p>
      )}
    </div>
  )
}

export default MovieDescriptionContainer
