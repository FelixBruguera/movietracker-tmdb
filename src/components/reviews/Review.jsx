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
      className={`flex items-start border-1 rounded-lg bg-transparent px-4 py-3 gap-3 dark:bg-transparent hover:border-ring dark:hover:border-border-foreground border-border shadow-sm transition-colors ${className}`}
    >
      <ReviewRating rating={data.rating} color={color} />
      <div className="flex flex-col w-full gap-2">
        <div className="flex gap-2 items-center justify-between flex-wrap">
          <div className="flex gap-2 flex-wrap lg:flex-nowrap items-center max-w-7/10 lg:w-8/10">
            <Link
              to={path}
              className="flex items-center gap-2 justify-center font-bold hover:text-accent transition-colors"
            >
              {avatar && <Avatar src={avatar} />}
              <p className="overflow-hidden overflow-ellipsis">
                {title}
              </p>
            </Link>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {formatInTimeZone(data.createdAt, "UTC", "dd-MM-u")}
            </p>
          </div>
          <div className="flex justify-end gap-2 items-start w-fit">
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
      <p className="w-full text-sm lg:text-base text-justify lg:w-full">
        {data.text}
      </p>
      </div>
    </li>
  )
}

export default Review
