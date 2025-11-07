const ChartHeading = (props) => {
  const width = props.width == "wide" ? "lg:w-full" : "lg:w-49/100"
  return (
    <div className={`pt-5 w-full ${width} mx-auto my-2`}>
      <h2 className="text-2xl font-bold text-center pb-5 lg:pb-3">
        {props.title}
      </h2>
      {props.children}
    </div>
  )
}

export default ChartHeading
