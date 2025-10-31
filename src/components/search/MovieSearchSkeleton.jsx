import { Skeleton } from "@ui/skeleton"
import StyledSkeleton from "../shared/StyledSkeleton"

const MovieSearchSkeleton = ({}) => {
  const items = Array.from(Array(10).keys())
  return items.map((i) => (
    <div
      key={i}
      className="flex flex-col w-2/5 flex-wrap lg:w-1/5 gap-1 justify-center items-center p-2"
    >
      <StyledSkeleton styles="flex w-25 h-30 lg:h-40 py-10 px-2 items-center gap-2 border-1 border-transparent transition-colors" />
      <StyledSkeleton styles="flex w-20 h-5 py-5 px-2 items-center gap-2 border-1 border-transparent transition-colors" />
    </div>
  ))
}

export default MovieSearchSkeleton
