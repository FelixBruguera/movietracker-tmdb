import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu"
import { authClient } from "@lib/auth-client.ts"
import { Button } from "@ui/button"
import {
  ChevronDown,
  User,
  LogIn,
  LogOut,
  CircleUserRound,
  Notebook,
  Logs,
  ChartArea,
  ChartBar,
  ChartSpline,
} from "lucide-react"
import { Link } from "react-router"
import Avatar from "./Avatar"

const DropdownLink = (props) => (
  <DropdownMenuItem className="p-0">
    <Link
      to={props.to}
      className="flex items-center gap-2 w-full px-2 py-1.5 hover:text-white"
    >
      {props.children}
    </Link>
  </DropdownMenuItem>
)

const UserDropdown = () => {
  const { data: session } = authClient.useSession()
  const logout = async () => await authClient.signOut()
  if (!session) {
    return (
      <Button asChild aria-label="Login">
        <Link to="/users/login">
          <LogIn aria-label="Login" />
          <p className="hidden lg:block">Login</p>
        </Link>
      </Button>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="w-fit lg:max-w-50 border-zinc-300 dark:border-border lg:border-transparent dark:lg:border-transparent overflow-clip whitespace-nowrap flex items-center gap-3 border-1
            hover:bg-card rounded-lg p-2 hover:cursor-pointer transition-colors"
      >
        <Avatar src={session.user.image} />
        <p className="hidden lg:block">{session.user.username}</p>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownLink to={`/users/${session.user.id}`}>
          <CircleUserRound className="group-hover:text-white" />
          <p>Profile</p>
        </DropdownLink>
        <DropdownLink to={`/users/${session.user.id}/diary`}>
          <Notebook className="group-hover:text-white" />
          <p>Diary</p>
        </DropdownLink>
        <DropdownLink to={`/users/${session.user.id}/lists`}>
          <Logs className="group-hover:text-white" />
          <p>Your Lists</p>
        </DropdownLink>
        <DropdownLink to={`/users/${session.user.id}/stats`}>
          <ChartSpline className="group-hover:text-white" />
          <p>Stats</p>
        </DropdownLink>
        <DropdownMenuItem
          onClick={() => logout()}
          className="hover:cursor-pointer"
        >
          <LogOut className="group-hover:text-white" />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
