const MoviesWithParamTitle = ({ title }) => {
  return (
    <div
      className="h-9 text-xs lg:text-sm w-fit max-w-5/10 flex items-center justify-center py-1 px-2 lg:px-3
        shadow-sm bg-accent dark:bg-accent rounded-md text-white mx-3"
      title={title}
      aria-label={title}
    >
      <h2 className="whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </h2>
    </div>
  )
}

export default MoviesWithParamTitle
