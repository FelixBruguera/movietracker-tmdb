import { useVirtualizer } from "@tanstack/react-virtual"
import { useState } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../app/components/ui/dialog"
import { Input } from "../../app/components/ui/input"
import { Button } from "../../app/components/ui/button"
import Poster from "./Poster"
import { Switch } from "../../app/components/ui/switch"

const ServiceList = ({
  list,
  searchValue,
  setSearchValue,
  selected,
  setSelected,
  selectAll,
}) => {
  const [parentRef, setParentRef] = useState(null)
  const rowVirtualizer = useVirtualizer({
    count: list?.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 50,
  })
  const addItem = (id) =>
    setSelected((prev) => {
      const set = new Set(prev)
      set.add(id)
      return set
    })
  const removeItem = (id) =>
    setSelected((prev) => {
      const set = new Set(prev)
      set.delete(id)
      return set
    })
  return (
    <DialogContent
      ref={setParentRef}
      className="max-h-8/10 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground"
    >
      <DialogTitle>Services</DialogTitle>
      <Input
        placeholder="Search"
        value={searchValue}
        className="border-border"
        onChange={(e) => setSearchValue(e.target.value)}
      ></Input>
      <DialogDescription>
        <Button
          variant="outline"
          className="mr-4 px-3 py-1 text-xs"
          onClick={() => setSelected(new Set())}
        >
          Clear
        </Button>
        <Button className="mb-3 px-3 py-1 text-xs" onClick={selectAll}>
          Select All
        </Button>
      </DialogDescription>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const item = list[virtualItem.index]
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
              className="flex justify-between items-center w-full"
            >
              <div className="flex items-center gap-2">
                <Poster
                  src={item.logo_path}
                  alt={item.provider_name}
                  size="logo"
                />
                {item.provider_name}
              </div>
              <Switch
                className="data-[state=unchecked]:bg-ring"
                checked={selected.has(item.provider_id)}
                onCheckedChange={(e) =>
                  e ? addItem(item.provider_id) : removeItem(item.provider_id)
                }
              />
            </div>
          )
        })}
      </div>
    </DialogContent>
  )
}

export default ServiceList
