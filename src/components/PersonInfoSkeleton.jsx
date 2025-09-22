import StyledSkeleton from "./StyledSkeleton"

const PersonInfoSkeleton = () => {
  return (
    <div className="px-5 flex items-start justify-start gap-2">
      <StyledSkeleton styles="h-40 lg:h-49 w-28 lg:w-35" />
      <div className="flex flex-col gap-5">
        <StyledSkeleton styles="h-8 w-28 lg:w-60" />
        <StyledSkeleton styles="h-25 lg:h-16 w-50 lg:w-100" />
        <StyledSkeleton styles="h-10 w-0 lg:w-90" />
      </div>
    </div>
  )
}

export default PersonInfoSkeleton
