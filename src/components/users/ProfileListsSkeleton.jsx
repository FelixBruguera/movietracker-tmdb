import StyledSkeleton from "../shared/StyledSkeleton"

const ProfileListSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 my-8 lg:my-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StyledSkeleton className="h-10 w-40 lg:w-40" />
        </div>
        <div className="flex items-center">
          <StyledSkeleton className="h-10 w-20 lg:w-40" />
          <StyledSkeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 h-screen flex-wrap">
        <StyledSkeleton className="h-2/14 w-full lg:w-100 mx-auto" />
        <StyledSkeleton className="h-2/14 w-full lg:w-100 mx-auto" />
        <StyledSkeleton className="h-2/14 w-full lg:w-100 mx-auto" />
      </div>
    </div>
  )
}

export default ProfileListSkeleton
