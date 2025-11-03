const MovieTab = ({ title, isActive, setActiveTab }) => {
  return (
    <div
      className={`text-sm lg:text-base bg-card-bg p-1 rounded-md lg:bg-transparent lg:p-0 lg:rounded-none text-muted-foreground flex items-center justify-center px-2 lg:px-2
        border-b-3 border-b-transparent dark:border-b-transparent group-hover:border-b-accent dark:group-hover:border-b-accent
        hover:border-b-accent dark:hover:border-b-accent hover:text-black dark:hover:text-white
         hover:cursor-pointer transition-colors ${isActive && "!bg-accent lg:!bg-transparent text-white lg:text-black lg:!border-b-accent dark:!text-white"} transition-colors`}
      onClick={() => setActiveTab(title)}
    >
      <p>{title}</p>
    </div>
  )
}

export default MovieTab
