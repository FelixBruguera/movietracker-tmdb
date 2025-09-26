import { Link } from "react-router"
import Avatar from "../shared/Avatar"
import { Calendar, List, MessageCircleMore, Notebook } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"

const UserInfo = ({ Icon, number }) => {
    return (
        <div className="flex items-center text-sm text-stone-600 dark:text-stone-400 gap-1">
            <Icon />
            <p className="text-stone-800 dark:text-stone-200 font-bold">
              {number}
            </p>
        </div>
    )
}

const UserCard = ({ user }) => {
  const date = formatInTimeZone(new Date(user.createdAt), "UTC", "MMMM u")
  return (
    <li
      key={user.id}
      className="w-9/10 mx-auto md:w-75 border-1 rounded-lg border-border dark:hover:border-stone-700 bg-zinc-200 dark:bg-secondary
            hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-white transition-colors group"
    >
      <Link to={`/users/${user.id}`} className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 w-full mb-1">
          <Avatar src={user.image} alt={`${user.username}'s avatar`} size="small" />
          <h3 className="text-lg md:text-xl text-nowrap max-w-7/10 md:max-w-8/10 overflow-hidden text-ellipsis font-bold">
            {user.username}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <UserInfo Icon={MessageCircleMore} number={user.reviews}/>
          <UserInfo Icon={Notebook} number={user.logs}/>
          <p className="flex items-center gap-1 text-sm text-stone-600 dark:text-stone-400 ">
            <Calendar /> {date}
          </p>
        </div>
      </Link>
    </li>
  )
}

export default UserCard