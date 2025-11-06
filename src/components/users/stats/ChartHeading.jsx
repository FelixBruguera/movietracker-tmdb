const ChartHeading = (props) => {
  const width = props.width == "wide" ? "w-full" : "w-49/100"
  return (
    <div className={`pt-5 ${width} mx-auto my-2`}>
      <h2 className="text-2xl font-bold text-center pb-3 ">{props.title}</h2>
      {props.children}
    </div>
  )
}

export default ChartHeading
