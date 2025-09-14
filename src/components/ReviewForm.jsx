import { Textarea } from "../../app/components/ui/textarea"
import { Button } from "../../app/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select"
import { useState } from "react"
import { Checkbox } from "../../app/components/ui/checkbox"
import { Label } from "../../app/components/ui/label"

const ReviewForm = ({ previousReview, movie, mutation }) => {
  const previousText = previousReview?.text
  const previousRating = previousReview?.rating
  const [text, setText] = useState(previousText || "")
  const [rating, setRating] = useState(previousRating || 1)
  const [createLog, setCreateLog] = useState(false)
  const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return (
    <form
      className="flex gap-2 items-center justify-center my-2"
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate({
          text: text,
          rating: rating,
          movie: !previousReview && {
            id: movie.id,
            title: movie.title || movie.name,
            releaseDate: movie.release_date || movie.first_air_date,
            poster: movie.poster_path,
            credits: movie.credits,
            genres: movie.genres,
            created_by: movie.created_by,
            networks: movie.networks,
          },
          create_log: createLog,
        })
      }}
    >
      <div className="flex flex-col gap-2 w-full">
        <Textarea
          className="border-2 bg-input dark:bg-transparent border-ring w-full lg:w-full h-fit max-h-45 field-sizing-content transition-all"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Optional"
          maxLength="400"
        />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center w-8/10 gap-10 justify-start">
            <div className="flex items-center gap-2">
              <Checkbox
                className="border-stone-600"
                id="log"
                name="log"
                checked={createLog}
                onCheckedChange={() => setCreateLog((prev) => !prev)}
              />
              <Label htmlFor="log" className="text-muted-foreground">
                Add to diary
              </Label>
            </div>
            <div className="flex items-center justify-center gap-2 w-1/3">
              <Label htmlFor="rating" className="text-muted-foreground">
                Rating
              </Label>
              <Select
                id="rating"
                value={rating}
                onValueChange={(e) => setRating(parseInt(e))}
              >
                <SelectTrigger
                  className="w-1/3 lg:w-3/5 text-xs lg:text-sm border-1 bg-card dark:bg-card border-border"
                  title="Your Rating"
                >
                  {rating}
                </SelectTrigger>
                <SelectContent>
                  {ratings.map((rating) => (
                    <SelectItem key={rating} value={rating}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            disabled={text === previousText && rating === previousRating}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ReviewForm
