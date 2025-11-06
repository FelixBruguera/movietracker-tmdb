import { Button } from "@ui/button"
import { Link, useMatch } from "react-router"

const ProfileTab = ({ title, href }) => {
  const isCurrentRoute = useMatch(href)
  return (
    <li>
      <Link to={href}>
        <Button
          asChild
          variant="ghost"
          className={`p-4 hover:cursor-pointer hover:text-black dark:hover:text-white hover:bg-transparent dark:hover:bg-transparent hover:border-b-accent  transition-colors border-b-3 rounded-none border-b-transparent
                ${isCurrentRoute && "!border-b-accent dark:text-white"}`}
        >
          <h3 className="font-bold text-sm lg:text-base">{title}</h3>
        </Button>
      </Link>
    </li>
  )
}

export default ProfileTab
