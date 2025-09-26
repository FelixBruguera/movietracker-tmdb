import StyledSkeleton from "../shared/StyledSkeleton"

const MoviesSkeleton = () => {
  const items = Array.from(Array(14).keys())
  return (
    <div className="pt-3 flex flex-wrap justify-center items-center gap-1">
      {items.map((item) => (
        <StyledSkeleton key={item} styles="h-60 lg:h-90 w-40 lg:w-58" />
      ))}
    </div>
  )
}

export default MoviesSkeleton
