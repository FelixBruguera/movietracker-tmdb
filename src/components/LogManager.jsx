import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../app/components/ui/dialog"
import {
  NotebookPen,
  Notebook,
  Save,
  Trash,
  Send,
  CircleDashed,
  Edit,
} from "lucide-react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import axios from "axios"
import TriggerButton from "./TriggerButton"
import Remove from "./Remove"
import { format } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { Button } from "../../app/components/ui/button"
import { useState } from "react"

const LogManagerItem = ({ log, update, remove }) => {
  const initialDate = formatInTimeZone(
    log.date.split("T")[0],
    "UTC",
    "yyy-MM-dd",
  )
  const [date, setDate] = useState(initialDate)
  const [isEditing, setIsEditing] = useState(false)
  return (
    <li
      key={log._id}
      className="flex items-center justify-start w-full gap-3 px-2"
    >
      <form
        className="w-full flex items-center justify-between"
        onSubmit={(e) => {
          e.preventDefault()
          setIsEditing(false)
          update.mutate({ date: date, logId: log.id })
        }}
      >
        {isEditing ? (
          <input
            type="date"
            name="date"
            className="p-2 w-2/4 text-sm border-1 border-border rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
          />
        ) : (
          <p className="text-sm">{formatInTimeZone(date, "UTC", "MMMM d u")}</p>
        )}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                variant="default"
                disabled={date === initialDate}
                className="text-xs"
              >
                Save
              </Button>
              <Button
                type="submit"
                variant="secondary"
                className="text-xs"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <Button
                variant="ghost"
                aria-label="Edit"
                title="Edit"
                onClick={() => setIsEditing(true)}
                className="hover:bg-transparent dark:hover:bg-transparent"
              >
                <TriggerButton>
                  <Edit />
                </TriggerButton>
              </Button>
              <Remove
                title="Deleting your log"
                mutation={() => remove.mutate({ logId: log.id })}
              >
                <TriggerButton>
                  <Trash />
                </TriggerButton>
              </Remove>
            </div>
          )}
        </div>
      </form>
    </li>
  )
}

const LogManager = ({ mediaId, mediaTitle }) => {
  const url = "/api/diary"
  const queryClient = useQueryClient()
  const {
    data: logs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["diary", mediaId],
    queryFn: () =>
      axios.get(`${url}/user/${mediaId}`).then((response) => response.data),
  })
  const updateMutation = useMutation({
    mutationFn: (data) => axios.patch(`${url}/${data.logId}`, data),
    onSuccess: (response) => {
      const newLog = response.data[0]
      queryClient.setQueryData(["diary", mediaId], (logs) =>
        logs.map((log) => (log.id === newLog.id ? newLog : log)),
      )
      toast("Succesfully updated")
    },
    onError: (error) => toast(error.message),
  })
  const deleteMutation = useMutation({
    mutationFn: (data) => axios.delete(`${url}/${data.logId}`),
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(["diary", mediaId], (logs) =>
        logs.filter((log) => log.id !== variables.logId),
      )
      toast("Succesfully deleted")
    },
    onError: (error) => toast(error.message),
  })
  return (
    <Dialog>
      <DialogTrigger aria-label="Manage your logs" title="Manage your logs">
        <TriggerButton>
          <Notebook />
        </TriggerButton>
      </DialogTrigger>
      <DialogContent className="overflow-auto w-fit min-w-90 max-h-8/10 scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Your logs for {mediaTitle}</DialogTitle>
        </DialogHeader>
        <ul className="flex flex-col gap-3 items-center">
          {isLoading && <li>Loading..</li>}
          {isError && <li>Someting went wrong</li>}
          {logs?.length > 0 ? (
            logs.map((log) => (
              <LogManagerItem
                key={log.id}
                log={log}
                update={updateMutation}
                remove={deleteMutation}
              />
            ))
          ) : (
            <li>No logs</li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default LogManager
