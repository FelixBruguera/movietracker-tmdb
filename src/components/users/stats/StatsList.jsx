import ChartHeading from "./ChartHeading"

const StatsList = (props) => {
  return (
    <ChartHeading title={props.title} width="wide">
      <ul className="flex w-full lg:w-9/10 mx-auto items-center justify-evenly my-8 flex-wrap gap-y-3">
        {props.children}
      </ul>
    </ChartHeading>
  )
}

export default StatsList
