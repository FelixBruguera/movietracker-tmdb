const Avatar = ({ src, alt, size = "" }) => {
  const sizeClass =
    size === "large" ? "size-20" : size === "small" ? "size-12" : "size-5"
  return <img src={src} alt={alt} className={`${sizeClass} rounded-lg`} />
}

export default Avatar
