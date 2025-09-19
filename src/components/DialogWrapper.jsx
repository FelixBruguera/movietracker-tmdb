import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../app/components/ui/dialog"
import Search from "./Search"
import { Plus } from "lucide-react"
import { useState, createContext } from "react"
import SelectedMovie from "./SelectedMovie"
import TriggerButton from "./TriggerButton"

export const DialogContext = createContext()

const DialogWrapper = (props) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-label={props.label} title={props.label}>
        <TriggerButton>
          <props.Icon />
        </TriggerButton>
      </DialogTrigger>
      <DialogContent
        className={`scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground ${props.contentClass}`}
      >
        <DialogHeader>
          <DialogTitle className="max-w-9/10">{props.title}</DialogTitle>
        </DialogHeader>
        <DialogContext.Provider value={{ setOpen }}>
          {props.children}
        </DialogContext.Provider>
      </DialogContent>
    </Dialog>
  )
}

export default DialogWrapper
