import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../app/components/ui/dialog"
import MovieSearch from "./MovieSearch"
import { Plus } from "lucide-react"
import { useState, createContext } from "react"
import SelectedMovie from "./SelectedMovie"
import TriggerButton from "./TriggerButton"

export const DialogContext = createContext()

const DialogWrapper = (props) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(props.movie || "")
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-label={props.label}>
        <TriggerButton>
          <Plus />
        </TriggerButton>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll lg:min-w-3/5">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        {selected ? (
          <>
            <DialogContext.Provider value={{ selected, setSelected, setOpen }}>
              <SelectedMovie
                movie={selected}
                unselect={() => setSelected("")}
              />
              {props.children}
            </DialogContext.Provider>
          </>
        ) : (
          <MovieSearch setSelected={setSelected} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogWrapper