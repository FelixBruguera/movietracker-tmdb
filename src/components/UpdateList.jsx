import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../app/components/ui/dialog"
import { Edit } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import axios from "axios"
import TriggerButton from "./TriggerButton"
import ListForm from "./ListForm"
import { useState } from "react"
import { useSearchParams } from "react-router"

const UpdateList = ({ list }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newEntry) => axios.patch(`/api/lists/${list.id}`, newEntry),
    onSuccess: (response) => {
      queryClient.setQueryData(["list", list.id], (oldData) => {
        const newData = response.data[0]
        return {
          ...oldData,
          name: newData.name,
          description: newData.description,
          isPrivate: newData.isPrivate,
          isWatchlist: newData.isWatchlist,
        }
      })
      setOpen(false)
      toast("Succesfully Updated")
    },
    onError: (error) =>
      toast(error.response.data) || toast("Something went wrong"),
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-label="Update your list" title="Update your list">
        <TriggerButton>
          <Edit />
        </TriggerButton>
      </DialogTrigger>
      <DialogContent className="overflow-auto w-150">
        <DialogHeader>
          <DialogTitle>Updating {list.name} </DialogTitle>
        </DialogHeader>
        <ListForm list={list} mutation={mutation} />
      </DialogContent>
    </Dialog>
  )
}

export default UpdateList
