import { Button } from "@ui/button"
import { Label } from "@ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { format } from "date-fns"
import axios from "axios"
import { useContext } from "react"
import { DialogContext } from "../shared/DialogWrapper"

const DiaryLogForm = ({ movie, isTv }) => {
  const queryClient = useQueryClient()
  const { setOpen } = useContext(DialogContext)
  const endpoint = isTv ? "/api/diary/tv" : "/api/diary"
  const mutation = useMutation({
    mutationFn: (newEntry) => axios.post(endpoint, newEntry),
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ["diary", movie.id] })
      toast("Succesfully Added")
    },
    onError: (error) => toast(error.response.data),
  })
  const todaysDate = format(new Date(), "yyyy-MM-dd")
  return (
    <form
      className="flex flex-col gap-10 w-full"
      onSubmit={(e) => {
        e.preventDefault()
        const movieDate = movie.release_date || movie.first_air_date
        mutation.mutate({
          date: e.target.date.value,
          movie: {
            id: movie.id,
            title: movie.title || movie.name,
            releaseDate: new Date(movieDate).getFullYear(),
            poster: movie.poster_path,
            cast: movie.credits.cast,
            directors: movie.credits.directors,
            genres: movie.genres,
            created_by: movie.created_by,
            networks: movie.networks,
          },
        })
      }}
    >
      <div className="flex flex-col gap-3 items-center">
        <Label htmlFor="date" className="text-muted-foreground">
          Date
        </Label>
        <input
          type="date"
          name="date"
          id="date"
          defaultValue={todaysDate}
          max={todaysDate}
          className="w-fit text-sm p-2 rounded-lg border-1 border-border"
        />
      </div>
      <Button type="submit" className="w-2/4 m-auto">
        Save
      </Button>
    </form>
  )
}

export default DiaryLogForm
