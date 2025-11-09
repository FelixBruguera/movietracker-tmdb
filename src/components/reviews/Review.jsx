import { Link } from "react-router"
import Avatar from "../shared/Avatar"
import { Heart, ThumbsUp } from "lucide-react"
import { Button } from "@ui/button"
import { authClient } from "../../../lib/auth-client"
import ReviewRating from "./ReviewRating"
import { formatInTimeZone } from "date-fns-tz"

const Likes = ({ currentUserLiked, count, onLike, onDislike }) => {
  const verb = count === 1 ? "Like" : "Likes"
  return (
    <div className="flex gap-1 items-center justify-center">
      {currentUserLiked === 1 ? (
        <Button
          variant="ghost"
          title="Dislike"
          aria-label="Dislike"
          onClick={onDislike}
          className={`!px-2 h-8 !bg-accent text-white hover:cursor-pointer hover:!bg-accent/50 transition-colors `}
        >
          <Heart />
        </Button>
      ) : (
        <Button
          variant="ghost"
          title="Like"
          aria-label="Like"
          onClick={onLike}
          className={`!px-2 h-8 hover:cursor-pointer transition-colors`}
        >
          <Heart />
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
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
      className={`grid grid-cols-24 auto-rows-min items-center border px-4 py-3 gap-1 rounded-lg bg-muted dark:bg-card hover:border-ring dark:hover:border-ring transition-colors ${className}`}
    >
      <div className="col-span-3 lg:col-span-1 row-span-1">
        <ReviewRating rating={data.rating} color={color} />
      </div>
      <div
        className={`flex w-full gap-2 ${data.text > 0 ? "items-start" : "items-start"} col-span-16 lg:col-span-16`}
      >
          <div className="flex gap-2 items-center flex-wrap">
            <Link
              to={path}
              className="flex items-center gap-2 justify-center font-bold hover:text-accent transition-colors"
            >
              {avatar && <Avatar src={avatar} />}
              <p className="max-w-50 lg:max-w-full overflow-hidden overflow-ellipsis">{title}</p>
            </Link>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {formatInTimeZone(data.createdAt, "UTC", "dd-MM-u")}
            </p>
          </div>
      </div>
      <p className="w-full lg:w-full text-sm lg:text-base text-justify row-start-2 col-start-4 lg:col-start-2 col-span-22">
        {data.text}
      </p>
      <div className="flex justify-end gap-2 items-start w-full col-start-20 col-span-8 lg:col-start-22 lg:col-span-3 row-span-1">
        {session && displayLikes && (
          <Likes
            currentUserLiked={data.currentUserLiked}
            count={data.likes}
            onLike={() => likeMutation.mutate(data.id)}
            onDislike={() => dislikeMutation.mutate(data.id)}
          />
        )}
      </div>
    </li>
  )
}

export default Review
