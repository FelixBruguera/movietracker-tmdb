import MovieDetail from "./MovieDetail"

const MovieRating = ({ value, source, logo }) => {
  return (
    value && (
      <MovieDetail title={`${source} Rating`}>
        <img src={logo} alt={source} className="w-12" />
        {value}
      </MovieDetail>
    )
  )
}

export default MovieRating
