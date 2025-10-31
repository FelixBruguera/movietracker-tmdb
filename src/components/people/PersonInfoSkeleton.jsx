import StyledSkeleton from "../shared/StyledSkeleton"

const PersonInfoSkeleton = () => {
  return (
    <div className="px-5 flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-between gap-2 mb-5">
      <StyledSkeleton styles="h-60 w-45 lg:w-50" />
      <div className="flex flex-col lg:flex-row lg:justify-between gap-5 w-full">
        <div className="flex flex-col gap-2 items-start">
          <StyledSkeleton styles="h-12 w-35 lg:w-60" />
          <StyledSkeleton styles="h-25 w-75 lg:w-100" />
        </div>
        <div className="flex lg:flex-col items-center justify-evenly w-full lg:w-1/3 lg:gap-3">
          <StyledSkeleton styles="h-12 w-22 lg:w-60" />
          <StyledSkeleton styles="h-12 w-22 lg:w-60" />
          <StyledSkeleton styles="h-12 w-22 lg:w-60" />
        </div>
      </div>
    </div>
  )
}

export default PersonInfoSkeleton
