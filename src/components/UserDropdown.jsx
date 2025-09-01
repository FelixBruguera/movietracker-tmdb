import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../app/components/ui/dropdown-menu"
import { authClient } from "../../lib/auth-client.ts"
import { Button } from "../../app/components/ui/button"
import { ChevronDown, User, LogIn, LogOut, CircleUserRound } from "lucide-react"
import { Link } from "react-router"

const UserDropdown = () => {
  const { data: session } = authClient.useSession()
  console.log(session)
  const logout = async () => await authClient.signOut()
  if (!session) {
    return (
      <Button asChild aria-label="Login">
        <Link to="/users/login">
          <LogIn aria-label="Log in" />
          <p className="hidden lg:block">Login</p>
        </Link>
      </Button>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="w-fit lg:max-w-50 border-zinc-300 dark:border-border lg:border-transparent dark:lg:border-transparent overflow-clip whitespace-nowrap flex items-center gap-3 border-1 
            hover:bg-card rounded-lg p-2 hover:cursor-pointer transition-all"
      >
        <User />
        <p className="hidden lg:block">{session.user.username}</p>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="p-0">
          <Link
            to={`/users/${session.user.id}`}
            className="flex items-center gap-2 w-full px-2 py-1.5"
          >
            <CircleUserRound />
            <p>Profile</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => logout()}
          className="hover:cursor-pointer"
        >
          <LogOut />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
