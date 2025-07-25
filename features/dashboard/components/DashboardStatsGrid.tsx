/**
 * Dashboard Stats Grid Component
 * Container for all dashboard statistics cards
 */

import { DashboardStatsCard } from "./DashboardStatsCard";
import { useDashboardMetrics } from "../hooks";

export function DashboardStatsGrid() {
  const { data: metrics, isLoading, isError } = useDashboardMetrics();

  // Error state
  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard metrics</p>
          <p className="text-sm text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm animate-pulse"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default values if no metrics provided
  const revenue = metrics?.revenue || {
    totalRevenue: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    growthPercentage: 0,
    trend: "FLAT" as const,
  };

  const invoices = metrics?.invoices || {
    totalPaidInvoices: 0,
    thisMonthPaidInvoices: 0,
    lastMonthPaidInvoices: 0,
    paidInvoicesGrowthPercentage: 0,
    paidInvoicesTrend: "FLAT" as const,
    totalPendingInvoices: 0,
    thisMonthPendingInvoices: 0,
    lastMonthPendingInvoices: 0,
    pendingInvoicesGrowthPercentage: 0,
    pendingInvoicesTrend: "FLAT" as const,
  };

  const clients = metrics?.clients || {
    totalClients: 0,
    thisMonthNewClients: 0,
    lastMonthNewClients: 0,
    clientGrowthPercentage: 0,
    clientTrend: "FLAT" as const,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full h-full grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Total Revenue Card */}
      <DashboardStatsCard
        title="Total Revenue"
        value={formatCurrency(revenue.totalRevenue)}
        growthPercentage={revenue.growthPercentage}
        trend={revenue.trend}
      />

      {/* Paid Invoices Card */}
      <DashboardStatsCard
        title="Paid Invoices"
        value={invoices.totalPaidInvoices}
        growthPercentage={invoices.paidInvoicesGrowthPercentage}
        trend={invoices.paidInvoicesTrend}
      />

      {/* Pending Invoices Card */}
      <DashboardStatsCard
        title="Pending Invoices"
        value={invoices.totalPendingInvoices}
        growthPercentage={invoices.pendingInvoicesGrowthPercentage}
        trend={invoices.pendingInvoicesTrend}
      />

      {/* Total Clients Card */}
      <DashboardStatsCard
        title="Total Clients"
        value={clients.totalClients}
        growthPercentage={clients.clientGrowthPercentage}
        trend={clients.clientTrend}
      />
    </div>
  );
}
