import { useQuery } from "@tanstack/react-query"
import PaginationWrap from "../shared/PaginationWrap"
import UsersMenu from "./UsersMenu"
import UserCard from "./UserCard"
import axios from "axios"
import ItemsGrid from "../shared/ItemsGrid"
import { useSearchParams } from "react-router"

export default function UserList() {
  const [searchParams, setsearchParams] = useSearchParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", searchParams.toString()],
    queryFn: () =>
      axios
        .get("/api/users", { params: searchParams })
        .then((response) => response.data),
  })
  const users = data?.users
  const totalPages = data?.totalPages

  return (
    <div className="flex flex-col justify-start items-start min-h-dvh">
      <title>Movie Tracker</title>
      <UsersMenu />
      <ItemsGrid
        items={users}
        isLoading={isLoading}
        isError={isError}
        ariaLabel={"users"}
        renderItem={(user) => <UserCard user={user} />}
      />
      {totalPages > 1 && <PaginationWrap totalPages={totalPages} />}
    </div>
  )
}
