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
          className={`p-4 hover:cursor-pointer hover:text-white hover:bg-accent dark:hover:bg-accent transition-all
                ${isCurrentRoute && "bg-accent text-white"}`}
        >
          <h3 className="font-bold text-sm lg:text-base">{title}</h3>
        </Button>
      </Link>
    </li>
  )
}

export default ProfileTab
