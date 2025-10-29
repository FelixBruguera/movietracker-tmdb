import { Calendar, Users, Lock, Eye } from "lucide-react"
import { Link } from "react-router"
import { memo } from "react"
import Avatar from "../shared/Avatar"
import { format } from "date-fns"

const UserLink = memo(({ user }) => {
  return (
    <Link
      to={`/users/${user.id}`}
      className="hover:text-accent transition-colors w-fit"
    >
      <ListDetail>
        <Avatar src={user.image} />
        <p className="flex">{user.username}</p>
      </ListDetail>
    </Link>
  )
})

const ListDetail = (props) => {
  return (
    <div
      title={props.label}
      aria-label={props.label}
      className="flex items-center justify-center gap-2 text-base lg:text-lg text-muted-foreground hover:text-primary transition-colors"
    >
      {props.children}
    </div>
  )
}

const ListDate = memo(({ date }) => {
  return (
    <ListDetail>
      <Calendar />
      <p className="text-sm lg:text-base" aria-label="Created at">
        {format(new Date(date), "MMMM u")}
      </p>
    </ListDetail>
  )
})

const ListDetails = ({ user, list }) => {
  const isPrivate = list.isPrivate
  return (
    <div className="flex items-center gap-3 w-full">
      <UserLink user={user} />
      <ListDate date={list.createdAt} />
      {list.isWatchlist && (
        <ListDetail label="Watchlist">
          <Eye />
        </ListDetail>
      )}
      <ListDetail label={isPrivate ? "Private list" : "Followers"}>
        {isPrivate ? (
          <Lock />
        ) : (
          <>
            <Users />
            <p className="text-stone-600 dark:text-stone-200 text-sm lg:text-base">
              {list.followers}
            </p>
          </>
        )}
      </ListDetail>
    </div>
  )
}

export default ListDetails
