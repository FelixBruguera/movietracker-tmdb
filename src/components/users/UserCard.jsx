import { Link } from "react-router"
import Avatar from "../shared/Avatar"
import { Calendar, List, MessageCircleMore, Notebook } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"

const UserInfo = ({ Icon, number }) => {
  return (
    <div className="flex items-center text-sm text-stone-600 dark:text-stone-400 gap-1">
      <Icon />
      <p className="text-stone-800 dark:text-stone-200 font-bold">{number}</p>
    </div>
  )
}

const UserCard = ({ user }) => {
  const date = formatInTimeZone(new Date(user.createdAt), "UTC", "MMM u")
  return (
    <li
      key={user.id}
      className="w-9/10 mx-auto md:w-75 border-1 rounded-lg border-border dark:border-stone-800 bg-card-bg
            hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-white transition-colors group shadow-sm"
    >
      <Link to={`/users/${user.id}`} className="p-3 flex flex-col h-full">
        <div className="flex items-center gap-3 w-full mb-1 h">
          <Avatar
            src={user.image}
            alt={`${user.username}'s avatar`}
            size="large"
          />
          <div className="flex flex-col gap-8 justify-between">
            <h3 className="text-lg md:text-xl text-nowrap max-w-7/10 md:max-w-8/10 overflow-hidden text-ellipsis font-bold">
              {user.username}
            </h3>
            <div className="flex items-center gap-3">
              <UserInfo Icon={MessageCircleMore} number={user.reviews} />
              <UserInfo Icon={Notebook} number={user.logs} />
              <p className="flex items-center gap-1 text-sm text-stone-600 dark:text-stone-400 ">
                <Calendar /> {date}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default UserCard
