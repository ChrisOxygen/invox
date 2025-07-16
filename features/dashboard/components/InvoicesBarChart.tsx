"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { INVOICES_CHART_DATA } from "@/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  sent: {
    label: "sent",
    color: "#2563eb",
  },
  paid: {
    label: "paid",
    color: "#60a5fa",
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
    <div className="w-full grid grid-rows-[70px_1fr] bg-white rounded-xl shadow p-4 h-full">
      <div className=" flex  items-start justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg text-gray-400 font-semibold">
            Total Revenue
          </span>
          <p className=" text-gray-800 text-4xl font-bold">$150,000</p>
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-full w-full  min-h-[240px]"
      >
        <BarChart className="" accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
          <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default InvoicesBarChart;
