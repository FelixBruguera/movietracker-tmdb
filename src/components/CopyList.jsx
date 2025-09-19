import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../app/components/ui/dialog"
import { Copy, Edit } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import axios from "axios"
import TriggerButton from "./TriggerButton"
import ListForm from "./ListForm"
import { useState } from "react"

const CopyList = ({ list }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newEntry) =>
      axios.post(`/api/lists/copy/${list.id}`, newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"] })
      setOpen(false)
      toast("Succesfully Copied")
    },
    onError: (error) => toast(error.response.statusText),
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label="Create a copy of this list"
        title="Create a copy of this list"
      >
        <TriggerButton>
          <Copy />
        </TriggerButton>
      </DialogTrigger>
      <DialogContent className="overflow-auto w-150">
        <DialogHeader>
          <DialogTitle>Creating a copy of {list.name} </DialogTitle>
        </DialogHeader>
        <ListForm list={list} mutation={mutation} />
      </DialogContent>
    </Dialog>
  )
}

export default CopyList
