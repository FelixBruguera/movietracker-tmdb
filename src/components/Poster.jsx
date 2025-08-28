const Poster = ({ src, alt, size = "base" }) => {
  const baseUrl = "https://image.tmdb.org/t/p/"
  const sizes = {
    large: "w-full mx-auto aspect-2/3",
    base: {sizeClass: "w-45 lg:w-60", sizeParam: "w500"},
    small: "h-40 lg:h-49 w-28 lg:w-35",
    xs: "h-30 lg:h-32 w-21 lg:w-23",
  }
  const { sizeClass, sizeParam } = sizes[size]
  return (
    <img
      src={`${baseUrl}/${sizeParam}${src}`}
      alt={alt}
      title={alt}
      className={`${sizeClass} shadow-md rounded-sm m-auto`}
    />
  )
}

export default Poster