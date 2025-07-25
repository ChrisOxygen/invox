"use client";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useInvoiceMetrics } from "../hooks";

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
  const { data: invoiceData, isLoading, isError } = useInvoiceMetrics();

  // Transform the invoice metrics data into chart format
  const chartData =
    invoiceData?.success && invoiceData.data
      ? [
          {
            month: "current",
            draft: Math.max(
              0,
              invoiceData.data.currentYear.totals.totalInvoices -
                invoiceData.data.currentYear.totals.paidInvoices -
                invoiceData.data.currentYear.totals.pendingInvoices
            ),
            sent: invoiceData.data.currentYear.totals.pendingInvoices,
            paid: invoiceData.data.currentYear.totals.paidInvoices,
          },
        ]
      : [{ month: "current", draft: 0, sent: 0, paid: 0 }];

  const totalInvoices =
    chartData[0].draft + chartData[0].sent + chartData[0].paid;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 lg:flex-[1] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm animate-pulse">
        <div className="space-y-3">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded-full mx-auto mt-8"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex-1 lg:flex-[1] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-gray-500 mb-2">Failed to load invoice data</p>
          <p className="text-sm text-gray-400">Please try refreshing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 lg:flex-[1] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 grid grid-rows-[auto_1fr] gap-4">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-1">
          Invoice Status
        </h4>
        <p className="text-sm text-gray-600">Distribution overview</p>
      </div>
      <div className="min-h-0 flex items-center justify-center">
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
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
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
                              Invoices This Year
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
      </div>
    </div>
  );
}

export default InvoiceRadialChart;
