const MovieDetailsList = (props) => {
  return (
    <div className="flex gap-3 items-center justify-start flex-wrap lg:max-w-9/10">
      {props.children}
    </div>
  )
}

export default MovieDetailsList
