import StyledSkeleton from "../shared/StyledSkeleton"

const ProfileSkeleton = () => {
  const items = Array.from(Array(4).keys())
  return (
    <div>
      <div className="w-full mx-auto pb-10 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          <StyledSkeleton className="size-25" />
          <StyledSkeleton className="w-1/6 h-10" />
        </div>
      </div>
      <div className="flex items-center justify-evenly w-full mx-auto pb-2 lg:px-60">
        {items.map((item) => (
          <StyledSkeleton
            key={item}
            className="w-2/10 lg:w-1/10 h-9"
          />
        ))}
      </div>
    </div>
  )
}

export default ProfileSkeleton