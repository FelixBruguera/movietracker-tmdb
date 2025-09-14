const Avatar = ({ src, alt, size = "small" }) => {
  const sizeClass =
    size === "large" ? "size-24" : size === "small" ? "size-12" : "size-5"
  return <img src={src} alt={alt} className={`${sizeClass} rounded-sm`} />
}

export default Avatar
