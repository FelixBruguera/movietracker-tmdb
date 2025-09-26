const Avatar = ({ src, alt, size = "" }) => {
  const sizeClass =
    size === "large" ? "size-18" : size === "small" ? "size-12" : "size-5"
  return <img src={src} alt={alt} className={`${sizeClass} rounded-sm`} />
}

export default Avatar
