import { Button } from "../../app/components/ui/button"
import { NavLink, useLocation } from "react-router"

const NavLinkWrapper = ({ to, title }) => {
  const location = useLocation()
  const isActive = location.pathname.includes(title.toLowerCase())
  const defaultRouteCheck = location.pathname === "/" && title === "Movies"
  return (
    <Button asChild variant="outline">
      <NavLink
        to={to}
        className={`border-1 border-border lg:dark:border-transparent lg:border-transparent bg-transparent
           text-black dark:text-white transition-colors hover:text-white hover:bg-accent hover:dark:bg-accent
          dark:hover:border-gray-800 ${(isActive || defaultRouteCheck) && "!bg-accent text-white"}`}
      >
        <p className="text-sm lg:text-lg">{title}</p>
      </NavLink>
    </Button>
  )
}

export default NavLinkWrapper
