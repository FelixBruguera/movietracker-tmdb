import { Textarea } from "../../app/components/ui/textarea"
import { Input } from "../../app/components/ui/input"
import { Checkbox } from "../../app/components/ui/checkbox"
import { Label } from "../../app/components/ui/label"
import { useState } from "react"
import { Button } from "../../app/components/ui/button"
import DialogWrapper from "./DialogWrapper"
import {
  BadgeQuestionMark,
  CircleQuestionMark,
  FileQuestionMark,
} from "lucide-react"

const ListForm = ({ list, mutation }) => {
  const privateStartingValue = list?.isPrivate === false ? false : true
  const watchlistStartingValue = list?.isWatchlist === false ? false : true
  const [isPrivate, setIsPrivate] = useState(privateStartingValue)
  const [isWatchlist, setIsWatchlist] = useState(watchlistStartingValue)
  return (
    <form
      className="flex flex-col gap-10 w-full"
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate({
          name: e.target.name.value,
          description: e.target.description.value,
          isPrivate: isPrivate,
          isWatchlist: isWatchlist,
        })
      }}
    >
      <div className="flex flex-col gap-3 items-center">
        <Label htmlFor="name" className="text-stone-600 dark:text-stone-400">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          id="name"
          defaultValue={list?.name || ""}
          minLength="5"
          maxLength="80"
          className="w-fit text-sm p-2 rounded-lg border-1 border-stone-400 dark:border-stone-600"
          required
        />
      </div>
      <div className="flex flex-col gap-3 items-center">
        <Label
          htmlFor="description"
          className="text-stone-600 dark:text-stone-400"
        >
          Description
        </Label>
        <Textarea
          type="text"
          name="description"
          id="description"
          defaultValue={list?.description || ""}
          minLength="5"
          maxLength="400"
          className="w-2/4 text-sm p-2 rounded-lg border-1 border-stone-400 dark:border-stone-600"
          required
        />
      </div>
      <div className="flex gap-3 items-center justify-center">
        <Checkbox
          name="private"
          id="private"
          checked={isPrivate}
          onCheckedChange={() => setIsPrivate((prev) => !prev)}
        />
        <Label htmlFor="private" className="text-stone-600 dark:text-stone-400">
          Private
        </Label>
      </div>
      <div className="flex gap-3 items-center justify-center">
        <Checkbox
          name="watchlist"
          id="watchlist"
          checked={isWatchlist}
          onCheckedChange={() => setIsWatchlist((prev) => !prev)}
        />
        <Label
          htmlFor="watchlist"
          className="text-stone-600 dark:text-stone-400"
        >
          Watchlist
        </Label>
        <DialogWrapper
          Icon={CircleQuestionMark}
          title="Watchlist"
          label="What's this?"
        >
          <p className="text-muted-foreground">
            Automatically remove media from this list after you review or log it
          </p>
        </DialogWrapper>
      </div>
      <Button type="submit" className="w-2/4 m-auto">
        Save
      </Button>
    </form>
  )
}

export default ListForm
