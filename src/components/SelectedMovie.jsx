import { X } from "lucide-react"
import Poster from "./Poster"
import { Label } from "../../app/components/ui/label"

const SelectedMovie = ({ movie, unselect }) => {
  return (
    <div className="flex flex-col gap-3 items-center w-full lg:w-1/2 mx-auto">
      <Label className="text-stone-600 dark:text-stone-400">Movie</Label>
      <div className="w-full flex gap-5 items-center border-1 border-stone-400 dark:border-stone-800 rounded-lg p-3 hover:border-stone-900 transition-all">
        <div className="flex w-full items-center gap-3">
          <div>
            <Poster src={movie.poster} alt={movie.title} size="xs" />
          </div>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-sm lg:text-base">{movie.title}</h3>
            <p className="text-xs lg:text-sm dark:text-stone-300">
              {new Date(movie.released).getFullYear()}
            </p>
          </div>
        </div>
        <X
          className="hover:text-accent hover:cursor-pointer"
          onClick={() => unselect()}
        />
      </div>
    </div>
  )
}

export default SelectedMovie
