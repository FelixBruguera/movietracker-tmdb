import { Skeleton } from "../../app/components/ui/skeleton"
import StyledSkeleton from "./StyledSkeleton"

const MovieSearchSkeleton = ({}) => {
  const items = Array.from(Array(8).keys())
  return items.map((i) => (
    <div
      key={i}
      className="flex flex-col w-2/5 flex-wrap lg:w-1/5 gap-1 justify-center items-center"
    >
      <StyledSkeleton styles="flex w-2/3 h-30 lg:h-40 py-10 px-2 items-center gap-2 border-1 border-transparent transition-all" />
      <StyledSkeleton styles="flex w-2/4 h-5 py-5 px-2 items-center gap-2 border-1 border-transparent transition-all" />
    </div>
  ))
}

export default MovieSearchSkeleton
