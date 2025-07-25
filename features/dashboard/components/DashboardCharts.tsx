/**
 * Dashboard Charts Section Component
 * Contains the revenue analytics bar chart and invoice status radial chart
 */

import InvoicesBarChart from "./InvoicesBarChart";
import InvoiceRadialChart from "./InvoiceRadialChart";

interface DashboardChartsProps {
  className?: string;
}

export function DashboardCharts({ className }: DashboardChartsProps) {
  return (
    <div
      className={`w-full h-full flex flex-col lg:flex-row gap-4 lg:gap-6 ${
        className || ""
      }`}
    >
      {/* Bar Chart - Main Chart */}
      <InvoicesBarChart />

      {/* Radial Chart - Side Chart */}
      <InvoiceRadialChart />
    </div>
  );
}
