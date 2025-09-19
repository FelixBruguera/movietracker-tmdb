import StyledSkeleton from "./StyledSkeleton"

const MoviesSkeleton = () => {
  const items = Array.from(Array(14).keys())
  return (
    <div className="p-5 flex flex-wrap justify-center items-center gap-3">
      {items.map((item) => (
        <StyledSkeleton key={item} styles="h-60 lg:h-90 w-40 lg:w-58" />
      ))}
    </div>
  )
}

export default MoviesSkeleton
