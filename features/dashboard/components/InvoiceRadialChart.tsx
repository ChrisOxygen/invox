"use client";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [{ month: "january", draft: 35, sent: 39, paid: 20 }];

const chartConfig = {
  draft: {
    label: "Draft",
    color: "#e5e7eb", // Gray-200
  },
  sent: {
    label: "Sent",
    color: "#2563eb", // Blue-600
  },
  paid: {
    label: "Paid",
    color: "#00e5ff", // Cyan-400
  },
} satisfies ChartConfig;

function InvoiceRadialChart() {
  const totalInvoices =
    chartData[0].draft + chartData[0].sent + chartData[0].paid;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Legend */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
          <span className="text-xs text-gray-600 font-medium">Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-xs text-gray-600 font-medium">Sent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span className="text-xs text-gray-600 font-medium">Paid</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 flex items-center justify-center min-h-0 -mb-[140px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={100}
            outerRadius={200}
            className="w-full h-full "
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-gray-900 text-4xl font-bold"
                        >
                          {totalInvoices}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-gray-600 text-lg font-medium"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="draft"
              stackId="a"
              cornerRadius={4}
              fill="var(--color-draft)"
              className="stroke-transparent stroke-1"
            />
            <RadialBar
              dataKey="sent"
              fill="var(--color-sent)"
              stackId="a"
              cornerRadius={4}
              className="stroke-transparent stroke-1"
            />
            <RadialBar
              dataKey="paid"
              fill="var(--color-paid)"
              stackId="a"
              cornerRadius={4}
              className="stroke-transparent stroke-1"
            />
          </RadialBarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export default InvoiceRadialChart;
