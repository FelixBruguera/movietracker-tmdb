import StyledSkeleton from "../shared/StyledSkeleton"

const ListsSkeleton = () => {
  const items = Array.from(Array(15).keys())
  return (
    <div className="flex flex-col gap-5 mt-5">
      <ul
        className="flex flex-wrap w-full items-center gap-5 mx-auto justify-evenly"
        aria-label="lists"
      >
        {items.map((item) => (
          <StyledSkeleton key={item} styles="w-8/10 lg:w-100 h-30 lg:h-25" />
        ))}
      </ul>
    </div>
  )
}

export default ListsSkeleton
