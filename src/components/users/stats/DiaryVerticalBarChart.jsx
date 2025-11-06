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
import { DiaryCustomTooltip } from "./LogsByYear"

const DiaryVerticalBarChart = ({ data, title, yAxisKey, tooltipTitle }) => {
  if (data.length < 1) {
    return null
  }
  return (
    <ChartHeading title={title}>
      <ResponsiveContainer height={400} width="95%">
        <BarChart accessibilityLayer data={data} layout="vertical">
          <CartesianGrid
            vertical={true}
            horizontal={false}
            className="stroke-zinc-300 dark:stroke-stone-800"
          />
          <Bar
            dataKey="total"
            radius={5}
            fill="var(--chart-main)"
            activeBar={{ fill: "var(--chart-accent" }}
            maxBarSize={50}
          />
          <XAxis
            tickLine={false}
            tickMargin={5}
            dataKey="total"
            type="number"
            domain={[0, "dataMax"]}
            className="text-xs lg:text-sm"
          />
          <YAxis
            width={100}
            dataKey={yAxisKey}
            type="category"
            tickLine={false}
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

export default DiaryVerticalBarChart
