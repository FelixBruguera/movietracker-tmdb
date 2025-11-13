import Poster from "../shared/Poster"

const MediaCard = ({ id, src, title, overview, children }) => {
  return (
    <li
      key={id}
      className="flex flex-col lg:flex-row justify-start gap-6 lg:gap-2 py-1 hover:bg-card-bg rounded-md transition-colors lg:pr-5 group"
    >
      <Poster src={src} size="small" />
      <div className="w-full lg:w-9/10 px-2 flex flex-col gap-1">
        <div className="flex items-center justify-start gap-2 flex-wrap">
          <h2 className="font-bold text-xl lg:text-2xl">{title}</h2>
          {children && (
            <div className="flex items-center justify-start gap-2">
              {children}
            </div>
          )}
        </div>
        {overview && (
          <p className="text-sm lg:text-base text-muted-foreground text-justify w-full lg:max-w-300">
            {overview}
          </p>
        )}
      </div>
    </li>
  )
}

export default MediaCard
