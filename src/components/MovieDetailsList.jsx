const MovieDetailsList = (props) => {
  return (
    <div className="flex gap-3 items-center justify-start flex-wrap mx-3 lg:mx-0">
      {props.children}
    </div>
  )
}

export default MovieDetailsList
