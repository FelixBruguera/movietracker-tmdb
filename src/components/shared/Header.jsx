import { ModeToggle } from "@ui/mode-toggle"
import { Clapperboard, Search as SearchIcon, Settings } from "lucide-react"
import { Link } from "react-router"
import DialogWrapper from "./DialogWrapper"
import NavLinkWrapper from "./NavLinkWrapper.jsx"
import UserDropdown from "./UserDropdown.jsx"
import CountrySelector from "./CountrySelector.jsx"
import Search from "../search/Search.jsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu.js"
import SearchItem from "../search/SearchItem.jsx"

const Header = () => {
  return (
    <nav className="flex flex-col lg:flex-row items-center justify-evenly lg:justify-between h-25 lg:h-20 mb-2 lg:mb-2 w-dvw lg:w-full">
      <Link
        to={"/"}
        className="flex items-center gap-1 text-2xl font-bold w-fit"
      >
        <img src="/icon.ico" className="!size-10 text-accent" />
        <h1 className="transition-colors hover:text-accent">
          Movie Tracker
        </h1>
      </Link>
      <div className="flex gap-0 items-center justify-between w-full lg:w-8/10">
        <div className="flex items-center justify-evenly w-full lg:w-8/10">
          <NavLinkWrapper to={"/"} title="Movies" />
          <NavLinkWrapper to={"/tv"} title="TV" />
          <NavLinkWrapper to={"/lists"} title="Lists" />
          <NavLinkWrapper to={"/users"} title="Users" />
        </div>
        <div className="hidden lg:flex items-center lg:justify-between justify-evenly w-6/10 mx-auto lg:mx-0 lg:w-2/10">
          <DialogWrapper
            title="Search Movies, TV Shows and People"
            label="Search"
            Icon={SearchIcon}
            contentClass="overflow-auto min-w-2/4"
          >
            <Search
              renderFn={(items, setOpen) =>
                items.map((itemData) => (
                  <SearchItem
                    key={[itemData.media_type, itemData.id]}
                    itemData={itemData}
                    setOpen={setOpen}
                  />
                ))
              }
            />
          </DialogWrapper>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="border-1 border-transparent p-2 rounded-md hover:bg-card hover:border-border transition-colors"
              aria-label="Settings"
              title="Settings"
            >
              <Settings />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex items-center justify-evenly">
              <ModeToggle />
              <CountrySelector />
            </DropdownMenuContent>
          </DropdownMenu>
          <UserDropdown />
        </div>
      </div>
    </nav>
  )
}

export default Header
