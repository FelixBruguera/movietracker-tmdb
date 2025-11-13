import StyledSkeleton from "../shared/StyledSkeleton"

const CollectionSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-8 w-full items-center lg:w-300 lg:mx-auto">
        <StyledSkeleton styles="h-70 lg:h-100 w-9/10 lg:w-full mx-auto lg:mx-0" />
        <div className="flex w-full items-start justify-start gap-3">
            <StyledSkeleton styles="h-40 w-30 mx-auto lg:mx-0" />
            <div className="flex flex-col items-start gap-3">
              <StyledSkeleton styles="h-10 w-50 lg:w-60 p-2" />
              <StyledSkeleton styles="h-20 w-60 lg:w-70 " />
            </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionSkeleton
