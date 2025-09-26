import StyledSkeleton from "../shared/StyledSkeleton"

const ReviewsSkeleton = () => {
  return (
    <div id="reviews" className="flex flex-col gap-5 my-8 lg:my-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StyledSkeleton styles="h-10 w-40 lg:w-80" />
        </div>
        <div className="flex items-center">
          <StyledSkeleton styles="h-10 w-20 lg:w-40" />
          <StyledSkeleton styles="h-10 w-10" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <StyledSkeleton styles="h-15 w-50 lg:w-240" />
        <StyledSkeleton styles="h-10 w-20 lg:w-40" />
        <StyledSkeleton styles="h-10 w-15" />
      </div>
      <div className="flex flex-col gap-5">
        <StyledSkeleton styles="h-30 w-90 lg:w-full" />
        <StyledSkeleton styles="h-30 w-90 lg:w-full" />
      </div>
    </div>
  )
}

export default ReviewsSkeleton
