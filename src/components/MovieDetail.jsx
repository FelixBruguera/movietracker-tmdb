const MovieDetail = (props) => {
  return (
    <div
      className="h-9 text-xs lg:text-sm max-w-45 lg:max-w-80 whitespace-nowrap flex items-center justify-center gap-2 py-1 px-2 lg:px-3
        shadow-sm bg-muted dark:bg-muted rounded-lg group-hover:bg-accent dark:group-hover:bg-accent group-hover:text-white group-active:text-white transition-colors group-active:bg-accent dark:group-active:bg-accent"
      title={props.title}
      aria-label={props.title}
    >
      {props.children}
    </div>
  )
}

export default MovieDetail
