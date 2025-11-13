import MovieDetailsList from "./MovieDetailsList"
import StyledSkeleton from "../shared/StyledSkeleton"

const MovieSkeleton = () => {
  return (
    <div className="container">
      <div className="flex flex-col lg:flex-row gap-8 w-full h-dvh">
        <StyledSkeleton styles="h-100 lg:h-150 2xl:h-170 w-3/4 lg:w-100 2xl:w-120 mx-auto lg:mx-0" />
        <div className="w-full md:w-2/3 flex flex-col gap-3">
          <StyledSkeleton styles="h-10 w-90 lg:w-8/10 p-2" />
          <MovieDetailsList>
            <StyledSkeleton styles="h-10 w-1/8" />
            <StyledSkeleton styles="h-10 w-1/8" />
            <StyledSkeleton styles="h-10 w-1/8" />
            <StyledSkeleton styles="h-10 w-1/8" />
          </MovieDetailsList>
          <StyledSkeleton styles="h-20 w-90 lg:w-9/10 " />
          <StyledSkeleton styles="h-30 w-90 lg:w-9/10 " />
        </div>
      </div>
    </div>
  )
}

export default MovieSkeleton
