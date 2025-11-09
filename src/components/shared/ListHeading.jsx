const ListHeading = (props) => {
  return (
    <div className="flex justify-between items-center my-8 lg:my-5 max-w-500 mx-auto flex-wrap lg:flex-nowrap gap-3 lg:gap-0">
      {props.children}
    </div>
  )
}

export default ListHeading
