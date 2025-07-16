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
    color: "#d6d6d6",
  },
  sent: {
    label: "Sent",
    color: "#393939",
  },
  paid: {
    label: "Paid",
    color: "#000000",
  },
} satisfies ChartConfig;

function InvoiceRadialChart() {
  const totalInvoices =
    chartData[0].draft + chartData[0].sent + chartData[0].paid;

  return (
    <div className="w-full  grid grid-rows-[70px_1fr] bg-white rounded-xl shadow p-4 h-full">
      <div className=" flex items-center, justify-center">
        <p className=" text-gray-800 text-4xl font-bold">Invoices Created</p>
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto  aspect-square w-full"
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={170}
          outerRadius={270}
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
                        className="fill-foreground text-4xl font-bold"
                      >
                        {totalInvoices.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="fill-muted-foreground text-lg text-gray-400 font-semibold"
                      >
                        Invoices
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
            cornerRadius={5}
            fill="var(--color-draft)"
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="sent"
            fill="var(--color-sent)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="paid"
            fill="var(--color-paid)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}

export default InvoiceRadialChart;
