import StyledSkeleton from "../shared/StyledSkeleton"

const KeywordSearchSkeleton = ({}) => {
  const items = Array.from(Array(15).keys())
  return (
    <div className="flex flex-wrap w-full gap-1 justify-start items-center">
      {items.map(() => (
        <StyledSkeleton styles="flex w-35 h-5 py-5 px-2 items-center  gap-2 border-1 border-transparent transition-colors" />
      ))}
    </div>
  )
}

export default KeywordSearchSkeleton
