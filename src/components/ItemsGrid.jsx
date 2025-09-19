import ErrorMessage from "./ErrorMessage"
import ListsSkeleton from "./ListsSkeleton"

const ItemsGrid = ({ items, isLoading, isError, renderItem, ariaLabel }) => {
  if (isLoading) {
    return <ListsSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  return (
    <div className="p-5 flex flex-col items-center gap-2">
      <ul
        className="flex flex-wrap w-full items-center gap-5"
        aria-label={ariaLabel}
      >
        {items.length === 0 ? (
          <li className="h-100 w-full text-center mt-5">
            <h1 className="font-bold text-lg">No results found</h1>
          </li>
        ) : (
          items.map((item) => renderItem(item))
        )}
      </ul>
    </div>
  )
}

export default ItemsGrid
