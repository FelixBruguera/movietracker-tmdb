import Poster from "../shared/Poster"

const SearchItemContent = ({ name, imgSettings, mediaType }) => {
  return (
    <>
      <Poster src={imgSettings.src} type={imgSettings.type} size="xs" />
      <div className="flex flex-col justify-between items-center w-full gap-2">
        <h3 className="text-xs lg:text-sm font-bold max-w-9/10 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-accent transition-colors">
          {name.slice(0,50)}
        </h3>
        <p className="text-xs text-muted-foreground bg-input dark:bg-muted py-1 px-2 rounded-lg">{mediaType}</p>
      </div>
    </>
  )
}

export default SearchItemContent
