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
import { RatingCustomTooltip } from "./RatingsByYear"

const RatingVerticalBarChart = ({ data, title, tooltipTitle }) => {
  if (data.length < 1) {
    return null
  }
  return (
    <ChartHeading title={title}>
      <ResponsiveContainer width="95%" height={400}>
        <BarChart accessibilityLayer data={data} layout="vertical">
          <CartesianGrid
            vertical={true}
            horizontal={false}
            className="stroke-zinc-300 dark:stroke-stone-800"
          />
          <Bar
            dataKey="averageRating"
            radius={5}
            fill="var(--chart-main)"
            activeBar={{ fill: "var(--chart-accent" }}
            maxBarSize={50}
          />
          <XAxis
            tickLine={false}
            tickMargin={5}
            dataKey="averageRating"
            type="number"
            domain={[0, 10]}
            tickCount={10}
            className="text-xs lg:text-sm"
          />
          <YAxis
            width={60}
            dataKey="genre"
            type="category"
            tickLine={false}
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

export default RatingVerticalBarChart
