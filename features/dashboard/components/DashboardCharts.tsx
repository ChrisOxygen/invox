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
      <div className="flex-1 lg:flex-[2] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 grid grid-rows-[auto_1fr] gap-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            Revenue Analytics
          </h4>
          <p className="text-sm text-gray-600">
            Monthly revenue trends and performance
          </p>
        </div>
        <div className="min-h-0">
          <InvoicesBarChart />
        </div>
      </div>

      {/* Radial Chart - Side Chart */}
      <div className="flex-1 lg:flex-[1] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 grid grid-rows-[auto_1fr] gap-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            Invoice Status
          </h4>
          <p className="text-sm text-gray-600">Distribution overview</p>
        </div>
        <div className="min-h-0 flex items-center justify-center">
          <InvoiceRadialChart />
        </div>
      </div>
    </div>
  );
}
