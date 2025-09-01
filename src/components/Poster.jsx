const Poster = ({ src, alt, size = "base", type = "movie" }) => {
  const baseUrl = "https://image.tmdb.org/t/p/"
  const sizes = {
    large: { sizeClass: "w-full mx-auto aspect-2/3", sizeParam: "w780" },
    base: { sizeClass: "w-40 lg:w-60", sizeParam: "w500" },
    small: { sizeClass: "h-40 lg:h-49 w-28 lg:w-35", sizeParam: "w185" },
    xs: { sizeClass: "h-30 lg:h-32 w-21 lg:w-23", sizeParam: "w185" },
  }
  const { sizeClass, sizeParam } = sizes[size]
  const fallback =
    type === "movie" ? "/movie-fallback.webp" : "/person-fallback.webp"
  return (
    <>
      <img
        src={src ? `${baseUrl}/${sizeParam}${src}` : fallback}
        alt={alt}
        title={alt}
        className={`${sizeClass} shadow-md rounded-sm lg:row-span-2`}
      />
      {!src && type === "movie" && <p>{alt}</p>}
    </>
  )
}

export default Poster
