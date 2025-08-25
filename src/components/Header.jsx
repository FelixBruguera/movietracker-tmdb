import { ModeToggle } from "../../app/components/ui/mode-toggle"
import { authClient } from "../../lib/auth-client.ts"
import { Clapperboard } from "lucide-react"
import { Link, useRouter } from "@tanstack/react-router"
import DialogWrapper from "./DialogWrapper"
import NavLink from "./NavLink"
// import NewLog from "./NewLog"
import UserDropdown from "./UserDropdown"

const Header = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  return (
    <nav className="flex flex-col lg:flex-row items-center justify-around h-30 lg:h-20 p-2 mb-2 w-dvw lg:w-full">
      <Link
        href={"/"}
        className="flex items-center gap-1 text-2xl font-bold w-fit"
      >
        <Clapperboard className="!size-8" />
        Movie Tracker
      </Link>
      <div className="flex gap-0 items-center justify-between w-full lg:w-8/10">
        <div className="flex items-center justify-evenly w-full">
          <NavLink
            href={"/"}
            title="Movies"
            isActive={router.pathname === "/"}
          />
          <NavLink
            href={"/lists"}
            title="Lists"
            isActive={router.pathname === "/lists"}
          />
          <NavLink
            href={"/users"}
            title="Users"
            isActive={router.pathname === "/users"}
          />
        </div>
        <div className="flex items-center lg:justify-between justify-evenly w-8/10 lg:w-3/10">
          {session && (
            <DialogWrapper title="New Log" label="Add a new log">
              {/* <NewLog /> */}
            </DialogWrapper>
          )}
          <ModeToggle />
          <UserDropdown />
        </div>
      </div>
    </nav>
  )
}

export default Header