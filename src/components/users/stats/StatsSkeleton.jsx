import StyledSkeleton from "../../shared/StyledSkeleton"

const StatsSkeleton = () => {
  return (
    <div className="flex flex-col w-full h-screen gap-5 pt-5">
      <StyledSkeleton className="h-1/14 w-full lg:w-100 mx-auto" />
      <StyledSkeleton className="h-4/10 w-full lg:w-4/10 mx-auto" />
    </div>
  )
}

export default StatsSkeleton
