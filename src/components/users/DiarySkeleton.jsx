import StyledSkeleton from "../shared/StyledSkeleton"

const DiarySkeleton = () => {
  return (
    <div className="flex flex-col gap-5 my-8 lg:my-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StyledSkeleton className="h-10 w-40 lg:w-80" />
        </div>
        <div className="flex items-center">
          <StyledSkeleton className="h-10 w-20 lg:w-40" />
          <StyledSkeleton className="h-10 w-10" />
        </div>
      </div>
      <StyledSkeleton className="h-10 w-50 mx-auto" />
      <div className="flex gap-1 flex-wrap">
        <StyledSkeleton className="h-40 lg:h-50 w-28 lg:w-35" />
        <StyledSkeleton className="h-40 lg:h-50 w-28 lg:w-35" />
        <StyledSkeleton className="h-40 lg:h-50 w-28 lg:w-35" />
        <StyledSkeleton className="h-40 lg:h-50 w-28 lg:w-35" />
        <StyledSkeleton className="h-40 lg:h-50 w-28 lg:w-35" />
      </div>
      <StyledSkeleton className="h-10 w-50 mx-auto" />
      <div className="flex gap-5">
        <StyledSkeleton className="h-50 w-35" />
        <StyledSkeleton className="h-50 w-35" />
      </div>
    </div>
  )
}

export default DiarySkeleton