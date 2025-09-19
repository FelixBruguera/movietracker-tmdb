import useRegion from "../stores/region"
import data from "../../lib/filters.json"
import { Dialog } from "../../app/components/ui/dialog"
import { useState } from "react"
import { Button } from "../../app/components/ui/button"
import CountryList from "./CountryList"

const CountrySelector = () => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const region = useRegion((state) => state.details)
  const countries =
    searchValue.length > 1
      ? data.countries.filter((country) =>
          country.name.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : data.countries
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="hover:cursor-pointer hover:bg-transparent dark:hover:bg-transparent p-0"
        title="Your region"
        aria-label="Your region"
      >
        <img src={region.flag} alt={region.name} className="w-8" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <CountryList
          list={countries}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Dialog>
    </>
  )
}

export default CountrySelector
