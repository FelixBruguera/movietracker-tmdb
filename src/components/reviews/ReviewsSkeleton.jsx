import StyledSkeleton from "../shared/StyledSkeleton"

const ReviewsSkeleton = () => {
  return (
    <div
      id="reviews"
      className="max-w-400 flex flex-col gap-3 mt-10 mx-auto lg:w-8/10 2xl:w-7/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StyledSkeleton styles="h-10 w-40 lg:w-80" />
        </div>
        <div className="flex items-center">
          <StyledSkeleton styles="h-10 w-20 lg:w-40" />
          <StyledSkeleton styles="h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <StyledSkeleton styles="h-30 w-90 lg:w-full" />
        <StyledSkeleton styles="h-30 w-90 lg:w-full" />
      </div>
    </div>
  )
}

export default ReviewsSkeleton
