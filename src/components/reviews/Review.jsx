import { Link } from "react-router"
import Avatar from "../shared/Avatar"
import { ThumbsUp } from "lucide-react"
import { Button } from "@ui/button"
import { authClient } from "../../../lib/auth-client"
import ReviewRating from "./ReviewRating"
import { formatInTimeZone } from "date-fns-tz"

const Likes = ({ currentUserLiked, count, onLike, onDislike }) => {
  const verb = count === 1 ? "Like" : "Likes"
  return (
    <div className="flex flex-col gap-1 items-center justify-center">
      {currentUserLiked === 1 ? (
        <Button
          variant="ghost"
          title="Dislike"
          aria-label="Dislike"
          onClick={onDislike}
          className={`!px-2 h-8 !bg-accent text-white hover:cursor-pointer hover:!bg-accent/50 transition-colors `}
        >
          <ThumbsUp />
        </Button>
      ) : (
        <Button
          variant="ghost"
          title="Like"
          aria-label="Like"
          onClick={onLike}
          className={`!px-2 h-8 hover:cursor-pointer transition-colors`}
        >
          <ThumbsUp />
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        {count} {verb}
      </p>
    </div>
  )
}

const Review = ({
  data,
  title,
  avatar,
  path,
  color,
  displayLikes = true,
  className,
  likeMutation,
  dislikeMutation,
}) => {
  const { data: session } = authClient.useSession()
  return (
    <li
      key={data.id}
      className={`border px-4 py-3 gap-1 rounded-lg bg-muted dark:bg-card hover:border-ring dark:hover:border-ring flex items-center justify-between transition-colors ${className}`}
    >
      <ReviewRating rating={data.rating} color={color} />
      <div
        className={`flex w-full gap-2 ${data.text > 0 ? "items-start" : "items-center"}`}
      >
        <div className="flex flex-col gap-1 w-full px-3">
          <div className="flex gap-2 items-center">
            <Link
              to={path}
              className="flex items-center gap-2 justify-center font-bold hover:text-accent transition-colors"
            >
              {avatar && <Avatar src={avatar} />}
              {title}
            </Link>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {formatInTimeZone(data.createdAt, "UTC", "dd-MM-u")}
            </p>
          </div>
          <p className="w-full lg:w-full text-sm lg:text-base text-justify">
            {data.text}
          </p>
        </div>
        <div className="flex justify-end gap-2 items-start w-2/10 lg:w-1/10">
          {session && displayLikes && (
            <Likes
              currentUserLiked={data.currentUserLiked}
              count={data.likes}
              onLike={() => likeMutation.mutate(data.id)}
              onDislike={() => dislikeMutation.mutate(data.id)}
            />
          )}
        </div>
      </div>
    </li>
  )
}

export default Review
