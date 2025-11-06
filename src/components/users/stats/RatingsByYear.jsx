import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { ChartTooltip } from "@/components/ui/chart"
import ChartHeading from "./ChartHeading"
import TooltipItem from "./TooltipItem"
import TooltipWrapper from "./TooltipWrapper"

export const RatingCustomTooltip = ({ active, payload, label, title }) => {
  const isVisible = active && payload && payload.length
  return (
    <TooltipWrapper isVisible={isVisible} label={label}>
      <TooltipItem
        title="Average Rating"
        value={parseFloat(payload[0]?.payload.averageRating).toFixed(2)}
      />
      <TooltipItem title={title} value={payload[0]?.payload.total} />
    </TooltipWrapper>
  )
}

const RatingsByYear = ({
  data,
  title,
  xAxisDataKey,
  width = "wide",
  tooltipTitle,
}) => {
  if (data.length < 1) {
    return null
  }
  return (
    <ChartHeading title={title} width={width}>
      <ResponsiveContainer width="95%" height={250}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid
            vertical={false}
            className="stroke-zinc-300 dark:stroke-stone-800"
          />
          <Bar
            dataKey="averageRating"
            radius={5}
            maxBarSize={50}
            fill="var(--chart-main)"
            activeBar={{ fill: "var(--chart-accent" }}
          />
          <XAxis
            dataKey={xAxisDataKey}
            tickCount={10}
            tickLine={false}
            tickMargin={5}
            className="text-xs lg:text-sm"
          />
          <YAxis
            dataKey="averageRating"
            tickLine={false}
            domain={[0, 10]}
            tickCount={10}
            className="text-xs lg:text-sm"
          />
          <ChartTooltip
            cursor={false}
            content={<RatingCustomTooltip title={tooltipTitle} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartHeading>
  )
}

export default RatingsByYear
