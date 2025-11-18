const Poster = ({ src, alt, size = "base", type = "movie" }) => {
  const baseUrl = "https://image.tmdb.org/t/p/"
  const sizes = {
    large: {
      sizeClass: "aspect-2/3",
      sizeParam: "w780",
    },
    base: { sizeClass: "w-40 lg:w-60 min-h-50 lg:min-h-90", sizeParam: "w342" },
    small: { sizeClass: "h-40 lg:h-49 w-28 lg:w-35 min-h-40", sizeParam: "w185" },
    xs: {
      sizeClass: "aspect-23/34 max-w-22 lg:max-h-30 lg:max-w-22 lg:!min-h-30",
      sizeParam: "w185",
    },
    listPoster: { sizeClass: "aspect-23/34", sizeParam: "w185" },
    logo: { sizeClass: "size-10", sizeParam: "w45" },
    company: { sizeClass: "w-15", sizeParam: "w92" },
  }
  const { sizeClass, sizeParam } = sizes[size]
  const fallback =
    type === "movie" ? "/movie-fallback.webp" : "/person-fallback.webp"
  return (
    <>
    {!src && type === "movie" ?
      <div className={`${sizeClass} mx-auto h-full px-1 lg:px-3 border-2 rounded-sm border-border flex items-center justify-center`}>
        <h2 className="text-xl text-muted-foreground">{alt}</h2>
      </div>
      :
      <img
        src={src ? `${baseUrl}/${sizeParam}${src}` : fallback}
        alt={alt}
        title={alt}
        className={`${sizeClass} shadow-md rounded-sm lg:row-span-2 mx-auto`}
        fetchpriority="high"
      />
    }
    </>
  )
}

export default Poster
