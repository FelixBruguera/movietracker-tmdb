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
import { DiaryCustomTooltip } from "./LogsByYear"

const RatingDistribution = ({ data, tooltipTitle }) => {
  if (data.length < 1) {
    return null
  }
  return (
    <ChartHeading title="Rating Distribution">
      <ResponsiveContainer width="95%" height={250}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid
            vertical={false}
            className="stroke-zinc-300 dark:stroke-stone-800"
          />
          <Bar
            dataKey="total"
            radius={5}
            maxBarSize={50}
            fill="var(--chart-main)"
            activeBar={{ fill: "var(--chart-accent" }}
          />
          <XAxis
            dataKey="rating"
            type="number"
            domain={[1, 10]}
            padding={"gap"}
            tickCount={10}
            tickLine={false}
            tickMargin={5}
            className="text-xs lg:text-sm"
          />
          <YAxis
            dataKey="total"
            tickLine={false}
            allowDecimals={false}
            width={30}
            tickCount={10}
            className="text-xs lg:text-sm"
          />
          <ChartTooltip
            cursor={false}
            content={<DiaryCustomTooltip title={tooltipTitle} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartHeading>
  )
}

export default RatingDistribution
