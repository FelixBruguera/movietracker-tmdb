import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog"
import { Plus } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import axios from "axios"
import TriggerButton from "../shared/TriggerButton"
import ListForm from "./ListForm"
import { memo, useState } from "react"

const ListDialog = memo(() => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const mutation = useMutation({
    mutationFn: (newEntry) => axios.post("/api/lists", newEntry),
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ["lists"] })
      toast("Succesfully Added")
    },
    onError: (error) => {
      const message = error.response.data || error.response.statusText
      toast(message)
    },
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-label="Create a new list">
        <TriggerButton>
          <Plus />
        </TriggerButton>
      </DialogTrigger>
      <DialogContent className="overflow-auto w-150">
        <DialogHeader>
          <DialogTitle>New List</DialogTitle>
        </DialogHeader>
        <ListForm mutation={mutation} />
      </DialogContent>
    </Dialog>
  )
})

export default ListDialog
