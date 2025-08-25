import Poster from "./Poster.jsx"

const MovieSearchItem = ({ movie, setSelected }) => {
  return (
    <li
      key={movie._id}
      onClick={() => setSelected(movie)}
      title={movie.title}
      className="flex w-full lg:w-1/4 flex-col p-2 rounded-lg items-center h-2/4 gap-2 border-transparent border-1
            group hover:border-border hover:cursor-pointer transition-all"
    >
      <Poster src={movie.poster} alt={movie.title} size="xs" />
      <div className="flex justify-between items-center w-full max-w-80 gap-2">
        <h3 className="text-sm font-bold text-nowrap max-w-9/10 overflow-hidden text-ellipsis group-hover:text-accent transition-all">
          {movie.title}
        </h3>
        <p className="text-xs dark:text-gray-300">
          {new Date(movie.released).getFullYear()}
        </p>
      </div>
    </li>
  )
}

export default MovieSearchItem