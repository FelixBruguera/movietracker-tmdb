const MediaCardDetail = ({ title, children }) => {
  return (
    <p
      className="text-xs lg:text-sm bg-card-bg px-2 py-1 rounded-sm text-muted-foreground hover:bg-accent hover:text-white active:bg-accent transition-colors group-hover:bg-background"
      title={title}
    >
      {children}
    </p>
  )
}

export default MediaCardDetail
