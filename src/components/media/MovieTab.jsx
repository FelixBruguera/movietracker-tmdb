const MovieTab = ({ title, isActive, setActiveTab }) => {
  return (
    <div
      className={`h-9 text-sm lg:text-base flex items-center justify-center px-2 lg:px-3
         shadow-sm bg-muted dark:bg-muted rounded-lg hover:bg-accent dark:hover:bg-accent hover:text-white 
         hover:cursor-pointer transition-colors ${isActive && "!bg-accent text-white"}`}
      onClick={() => setActiveTab(title)}
    >
      <p>{title}</p>
    </div>
  )
}

export default MovieTab
