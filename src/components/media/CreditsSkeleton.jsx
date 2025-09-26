import StyledSkeleton from "../shared/StyledSkeleton"

const CreditsSkeleton = () => {
  const items = Array.from(Array(25).keys())
  return (
    <div className="flex flex-col items-center mx-auto px-9 h-screen">
      <StyledSkeleton styles="h-30 lg:h-20 w-40 lg:w-1/3" />
      <div className="p-5 flex flex-wrap justify-center items-center gap-1">
        {items.map((item) => (
          <StyledSkeleton key={item} styles="h-30 lg:h-32 w-21 lg:w-23" />
        ))}
      </div>
    </div>
  )
}

export default CreditsSkeleton
