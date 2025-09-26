const AverageRating = ({ rating, color }) => {
  if (!rating) {
    return null
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <p
        className={`px-3 py-1 ${color} dark:text-black font-bold rounded-lg`}
        aria-label="Average rating"
        title="Average rating"
      >
        {rating}
      </p>
    </div>
  )
}

export default AverageRating
