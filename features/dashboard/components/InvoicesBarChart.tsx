"use client";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceMetrics } from "../hooks";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#00e5ff", // Cyan-400
  },
  invoices: {
    label: "Invoices",
    color: "#2563eb", // Blue-600
  },
} satisfies ChartConfig;

type TimePeriod = "thisWeek" | "lastWeek" | "thisYear" | "lastYear";

function InvoicesBarChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("thisYear");
  const { data: invoiceData, isLoading, isError } = useInvoiceMetrics();

  // Transform real data based on selected period
  const getTransformedData = () => {
    if (!invoiceData?.success || !invoiceData.data) {
      return [];
    }

    const { currentYear, previousYear } = invoiceData.data;

    switch (selectedPeriod) {
      case "thisYear":
        return currentYear.monthlyData.map((month) => ({
          period: month.monthName,
          revenue: month.revenue,
          invoices: month.paidInvoices + month.pendingInvoices,
        }));
      case "lastYear":
        return previousYear.monthlyData.map((month) => ({
          period: month.monthName,
          revenue: month.revenue,
          invoices: month.paidInvoices + month.pendingInvoices,
        }));
      case "thisWeek":
      case "lastWeek":
        // Generate sample weekly data (can be replaced with real weekly data later)
        const weekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return weekNames.map((day) => ({
          period: day,
          revenue: Math.floor(Math.random() * 5000) + 1000, // Sample revenue
          invoices: Math.floor(Math.random() * 10) + 1, // Sample invoice count
        }));
      default:
        return currentYear.monthlyData.map((month) => ({
          period: month.monthName,
          revenue: month.revenue,
          invoices: month.paidInvoices + month.pendingInvoices,
        }));
    }
  };

  const chartData = getTransformedData();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 lg:flex-[2] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm animate-pulse">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-56 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex-1 lg:flex-[2] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-gray-500 mb-2">Failed to load revenue data</p>
          <p className="text-sm text-gray-400">Please try refreshing</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 lg:flex-[2] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 grid grid-rows-[auto_1fr] gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            Revenue Analytics
          </h4>
          <p className="text-sm text-gray-600">
            Revenue trends and performance over time
          </p>
        </div>
        {/* Time Period Selector */}
        <Select
          value={selectedPeriod}
          onValueChange={(value: TimePeriod) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-[140px] h-9 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 focus:ring-blue-300 focus:border-blue-400 transition-colors">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-white border-blue-200 shadow-lg">
            <SelectItem
              value="thisWeek"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
            >
              This Week
            </SelectItem>
            <SelectItem
              value="lastWeek"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
            >
              Last Week
            </SelectItem>
            <SelectItem
              value="thisYear"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
            >
              This Year
            </SelectItem>
            <SelectItem
              value="lastYear"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
            >
              Last Year
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            className="h-full w-full"
          >
            <CartesianGrid
              vertical={false}
              stroke="#e5f3ff"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="period"
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
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
              name="Revenue ($)"
            />
            <Bar
              dataKey="invoices"
              fill="var(--color-invoices)"
              radius={[4, 4, 0, 0]}
              name="Invoice Count"
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export default InvoicesBarChart;
