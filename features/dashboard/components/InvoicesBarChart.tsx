"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { INVOICES_CHART_DATA } from "@/constants";

const chartConfig = {
  sent: {
    label: "Sent",
    color: "#2563eb", // Blue-600
  },
  paid: {
    label: "Paid",
    color: "#00e5ff", // Cyan-400
  },
} satisfies ChartConfig;

function getChartData(displayType: "months" | "weeks" | "days") {
  switch (displayType) {
    case "months":
      return INVOICES_CHART_DATA.months;
    case "weeks":
      return INVOICES_CHART_DATA.weeks;
    case "days":
      return INVOICES_CHART_DATA.days;
    default:
      return INVOICES_CHART_DATA.months;
  }
}

function InvoicesBarChart() {
  const chartData = getChartData("days");
  return (
    <div className="w-full h-full">
      {/* Chart Container */}
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={chartData} className="h-full w-full">
          <CartesianGrid
            vertical={false}
            stroke="#e5f3ff"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="sent"
            fill="var(--color-sent)"
            radius={[4, 4, 0, 0]}
            name="Sent Invoices"
          />
          <Bar
            dataKey="paid"
            fill="var(--color-paid)"
            radius={[4, 4, 0, 0]}
            name="Paid Invoices"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default InvoicesBarChart;
