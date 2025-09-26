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

const MobileMenu = () => {
    return (
        <div className="fixed bottom-0 h-15 bg-background w-full flex lg:hidden items-center lg:justify-between justify-evenly mx-auto lg:mx-0 lg:w-2/10">
            <DialogWrapper
            title="Search Movies, TV Shows and People"
            label="Search"
            Icon={SearchIcon}
            contentClass="overflow-auto min-w-3/4 "
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
                <ModeToggle />
                <CountrySelector />
            <UserDropdown />
        </div>
    )
}

export default MobileMenu