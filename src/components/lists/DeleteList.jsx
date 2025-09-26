import { Trash } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import axios from "axios"
import TriggerButton from "../shared/TriggerButton"
import Remove from "../shared/Remove"
import { useNavigate } from "react-router"

const DeleteList = ({ list }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => axios.delete(`/api/lists/${list.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] })
      queryClient.removeQueries({ queryKey: ["list", list.id] })
      navigate("/lists")
      toast("Succesfully Deleted")
    },
    onError: (error) => toast(error.response.statusText),
  })
  return (
    <Remove title={`Deleting ${list.name}`} mutation={() => mutation.mutate()}>
      <TriggerButton>
        <Trash />
      </TriggerButton>
    </Remove>
  )
}

export default DeleteList
