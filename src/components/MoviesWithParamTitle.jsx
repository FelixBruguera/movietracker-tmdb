const MoviesWithParamTitle = ({ title }) => {
  return (
    <div
      className="h-10 text-xs lg:text-sm w-fit flex items-center justify-center py-1 px-2 lg:px-3
        shadow-sm bg-accent dark:bg-accent rounded-md text-white"
      title={title}
      aria-label={title}
    >
      <h2 className="whitespace-nowrap">{title}</h2>
    </div>
  )
}

export default MoviesWithParamTitle
