const ListHeadingTitle = (props) => {
  return (
    <div className="flex items-center gap-3 w-9/10">
      <h2 className="text-xl lg:text-2xl font-semibold">{props.title}</h2>
      {props.children}
    </div>
  )
}

export default ListHeadingTitle
