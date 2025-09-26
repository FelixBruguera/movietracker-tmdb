const ReviewRating = ({ rating, color }) => {
    return (
    <div className="flex gap-1 items-center">
          <p
            className={`font-bold text-base ${color} px-3 py-1 dark:text-black rounded-lg`}
          >
            {rating}
          </p>
    </div>
    )
}

export default ReviewRating
