import StyledSkeleton from "./StyledSkeleton"

const ListSkeleton = () => {
  const items = Array.from(Array(15).keys())
  return (
    <div className="p-5 w-full lg:w-9/10 mx-auto flex flex-col items-start justify-start max-w-500">
      <div className="w-9/10 pb-5 flex flex-col gap-2">
        <StyledSkeleton styles="w-3/4 lg:w-1/4 h-9" />
        <StyledSkeleton styles="w-2/4 lg:w-1/5 h-8" />
        <StyledSkeleton styles="w-full lg:w-3/5 h-14" />
      </div>
      <StyledSkeleton styles="w-3/8 lg:w-1/8 h-10" />
      <div className="flex items-center justify-start gap-1 w-full mx-auto mt-5 flex-wrap">
        {items.map((item) => (
          <StyledSkeleton key={item} styles="w-25 lg:w-50 h-40 lg:h-70" />
        ))}
      </div>
    </div>
  )
}

export default ListSkeleton
