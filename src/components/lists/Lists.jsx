import { useQuery } from "@tanstack/react-query"
import PaginationWrap from "../shared/PaginationWrap"
import ListsMenu from "./ListsMenu"
import axios from "axios"
import ItemsGrid from "../shared/ItemsGrid"
import ListCard from "./ListCard"
import { useSearchParams } from "react-router"

const Lists = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["lists", searchParams.toString()],
    queryFn: () =>
      axios
        .get("/api/lists", { params: searchParams })
        .then((response) => response.data),
  })
  const lists = data?.lists
  const totalPages = data?.totalPages

  return (
    <div className="flex flex-col justify-start h-dvh">
      <ListsMenu />
      <ItemsGrid
        items={lists}
        isLoading={isLoading}
        isError={isError}
        ariaLabel={"lists"}
        renderItem={(list) => <ListCard key={list.id} list={list} />}
      />
      {totalPages > 1 && <PaginationWrap totalPages={totalPages} />}
    </div>
  )
}

export default Lists
