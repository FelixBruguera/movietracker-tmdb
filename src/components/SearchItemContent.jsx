import Poster from "./Poster"

const SearchItemContent = ({ name, imgSettings, mediaType }) => {
  return (
    <>
      <Poster src={imgSettings.src} type={imgSettings.type} size="xs" />
      <div className="flex flex-col justify-between items-center w-full gap-2">
        <h3 className="text-sm font-bold text-nowrap max-w-10/10 overflow-hidden text-ellipsis group-hover:text-accent transition-all">
          {name}
        </h3>
        <p className="text-xs dark:text-gray-300">{mediaType}</p>
      </div>
    </>
  )
}

export default SearchItemContent
