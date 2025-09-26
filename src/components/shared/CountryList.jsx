import { useVirtualizer } from "@tanstack/react-virtual"
import { useState } from "react"
import { DialogContent, DialogTitle } from "@ui/dialog"
import useRegion from "@stores/region"
import { Input } from "@ui/input"

const CountryList = ({ list, searchValue, setSearchValue, setOpen }) => {
  const updateRegion = useRegion((state) => state.updateRegion)
  const [parentRef, setParentRef] = useState(null)
  const rowVirtualizer = useVirtualizer({
    count: list.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 45,
  })
  return (
    <DialogContent
      ref={setParentRef}
      className="max-h-8/10 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground"
    >
      <DialogTitle>Select your country</DialogTitle>
      <Input
        placeholder="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      ></Input>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const country = list[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="flex gap-2 items-center w-full hover:bg-card hover:cursor-pointer transition-colors py-3 px-1 rounded-lg"
              onClick={() => {
                updateRegion(country)
                setOpen(false)
              }}
            >
              <img src={country.flag} alt={country.name} className="w-10" />
              {country.name}
            </div>
          )
        })}
      </div>
    </DialogContent>
  )
}

export default CountryList
