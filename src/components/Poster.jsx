const Poster = ({ src, alt, size = "base" }) => {
  const sizes = {
    large: "w-full mx-auto aspect-2/3",
    base: "h-40 lg:h-65 w-28 lg:w-45",
    small: "h-40 lg:h-49 w-28 lg:w-35",
    xs: "h-30 lg:h-32 w-21 lg:w-23",
  }
  const sizeClass = sizes[size]
  return (
    <img
      src={src}
      alt={alt}
      title={alt}
      className={`${sizeClass} shadow-md rounded-sm m-auto`}
    />
  )
}

export default Poster