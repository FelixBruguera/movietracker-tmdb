const Poster = ({ src, alt, size = "base", type = "movie" }) => {
  const baseUrl = "https://image.tmdb.org/t/p/"
  const sizes = {
    large: {
      sizeClass: "aspect-2/3",
      sizeParam: "w780",
    },
    base: { sizeClass: "w-40 lg:w-60", sizeParam: "w342" },
    small: { sizeClass: "h-40 lg:h-49 w-28 lg:w-35", sizeParam: "w185" },
    xs: { sizeClass: "aspect-23/34 lg:max-h-30 lg:max-w-22", sizeParam: "w185" },
    listPoster: { sizeClass: "aspect-23/34", sizeParam: "w185" },
    logo: { sizeClass: "size-10", sizeParam: "w45" },
    company: { sizeClass: "w-15", sizeParam: "w92" },
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
        className={`${sizeClass} shadow-md rounded-sm lg:row-span-2 mx-auto`}
      />
      {!src && type === "movie" && alt && (
        <p className="max-w-9/10 mx-auto text-ellipsis overflow-hidden whitespace-nowrap">
          {alt.slice(0, 35)}
        </p>
      )}
    </>
  )
}

export default Poster
