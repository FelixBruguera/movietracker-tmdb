import { Link } from "react-router"
import Poster from "../shared/Poster"
import Review from "../reviews/Review"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const ProfileReview = ({ data, color, profileId }) => {
  const queryClient = useQueryClient()
  const path = data.media.id.includes("tv") ? "tv" : "movies"
  const id = data.media.id.split("_")[1]
  const linkTo = `/${path}/${id}`
  const likeMutation = useMutation({
    mutationFn: (id) => axios.post(`/api/reviews/like/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews", profileId] })
      toast("Like added")
    },
    onError: (error) =>
      toast(error.response.statusText) || toast("Something went wrong"),
  })
  const dislikeMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/reviews/like/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews", profileId] })
      toast("Like removed")
    },
    onError: (error) =>
      toast(error.response.statusText) || toast("Something went wrong"),
  })
  return (
    <div
      className="flex items-center lg:items-start flex-col md:flex-row max-w-500 mx-auto justify-start gap-2"
      key={data.id}
    >
      <Link to={linkTo} className="p-1 rounded-t-2xl  md:p-auto">
        <Poster src={data.media.poster_path} alt={data.media.title} size="xs" />
      </Link>
      <Review
        data={data}
        title={data.media.title}
        path={linkTo}
        color={color}
        className="w-full lg:!border-transparent hover:!border-border dark:hover:!border-border !shadow-none"
        likeMutation={likeMutation}
        dislikeMutation={dislikeMutation}
      />
    </div>
  )
}

export default ProfileReview
