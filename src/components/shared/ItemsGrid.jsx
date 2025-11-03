import ErrorMessage from "../shared/ErrorMessage"
import ListsSkeleton from "../lists/ListsSkeleton"

const ItemsGrid = ({ items, isLoading, isError, renderItem, ariaLabel }) => {
  if (isLoading) {
    return <ListsSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  const noResults = items.length === 0
  return (
    <div
      className={`py-5 flex flex-col items-start gap-2 w-full ${noResults && "mx-auto"}`}
    >
      <ul
        className="flex flex-wrap w-full items-center gap-5"
        aria-label={ariaLabel}
      >
        {noResults ? (
          <li className="h-100 w-full text-center mt-5">
            <h1 className="font-bold text-lg mx-auto w-full">
              No results found
            </h1>
          </li>
        ) : (
          items.map((item) => renderItem(item))
        )}
      </ul>
    </div>
  )
}

export default ItemsGrid
