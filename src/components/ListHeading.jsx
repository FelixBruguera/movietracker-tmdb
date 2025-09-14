const ListHeading = (props) => {
  return (
    <div className="flex justify-between items-center my-8 lg:my-5 max-w-500 mx-auto">
      {props.children}
    </div>
  )
}

export default ListHeading
