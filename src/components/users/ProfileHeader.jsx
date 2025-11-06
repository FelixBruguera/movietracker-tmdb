import ProfileTab from "./ProfileTab"
import { Outlet, useParams } from "react-router"
import Avatar from "../shared/Avatar"
import ProfileSkeleton from "./ProfileSkeleton"
import ErrorMessage from "../shared/ErrorMessage"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const ProfileHeader = () => {
  const tabs = {
    Reviews: "",
    Diary: "diary",
    Lists: "lists",
    Stats: "stats/movies",
  }
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      axios.get(`/api/users/${id}`).then((response) => response.data[0]),
    staleTime: 1440 * 60000,
    gcTime: 1440 * 60000, // 1 day
  })
  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }
  return (
    <section className="min-h-dvh px-2 lg:px-0">
      <title>{data.username}</title>
      <meta property="og:title" content={data.username} />
      <div className="w-full mx-auto pb-6 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-3 flex-col">
          <Avatar
            src={data.image}
            alt={`${data.username}'s avatar`}
            size="large"
          />
          <h1 className="font-bold text-3xl">{data.username}</h1>
        </div>
      </div>
      <ul className="flex items-center justify-evenly w-full mx-auto border-b-1 lg:px-100">
        {Object.entries(tabs).map(([key, value]) => (
          <ProfileTab key={key} title={key} href={`/users/${id}/${value}`} />
        ))}
      </ul>
      <Outlet />
    </section>
  )
}

export default ProfileHeader
