import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  LineChart,
  ComposedChart,
} from "recharts"
import { ChartTooltip } from "@/components/ui/chart"
import ChartHeading from "./ChartHeading"
import TooltipItem from "./TooltipItem"
import TooltipWrapper from "./TooltipWrapper"

export const DiaryCustomTooltip = ({ active, payload, label, title }) => {
  const isVisible = active && payload && payload.length
  return (
    <TooltipWrapper isVisible={isVisible} label={label}>
      <TooltipItem title={title} value={payload[0]?.payload.total} />
    </TooltipWrapper>
  )
}

const LogsByYear = ({ data, title, tooltipTitle }) => {
  if (data.length < 1) {
    return null
  }
  return (
    <ChartHeading title={title} width="wide">
      <ResponsiveContainer height={300} width="95%">
        <ComposedChart accessibilityLayer data={data}>
          <CartesianGrid
            vertical={false}
            className="stroke-zinc-300 dark:stroke-stone-800"
          />
          {data.length > 1 ? (
            <Line dataKey="total" radius={5} fill="var(--chart-main)" />
          ) : (
            <Bar
              dataKey="total"
              radius={5}
              fill="var(--chart-main)"
              activeBar={{ fill: "var(--chart-accent" }}
            />
          )}
          <XAxis
            className="text-xs lg:text-sm"
            dataKey="year"
            tickLine={false}
            tickMargin={5}
          />
          <YAxis
            tickLine={false}
            type="number"
            allowDecimals={false}
            className="text-xs lg:text-sm"
          />
          <ChartTooltip
            cursor={false}
            content={<DiaryCustomTooltip title={tooltipTitle} />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartHeading>
  )
}

export default LogsByYear
