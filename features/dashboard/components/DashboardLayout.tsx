/**
 * Main Dashboard Layout Component
 * Combines all dashboard components in a structured layout
 */

import { DashboardHeader } from "./DashboardHeader";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { DashboardCharts } from "./DashboardCharts";
import { RecentInvoicesSection } from "./RecentInvoicesSection";
import { DashboardLoading } from "./DashboardLoading";
import type { DashboardMetrics } from "../types";

interface DashboardLayoutProps {
  userName?: string;
  metrics?: DashboardMetrics;
  isLoading?: boolean;
  className?: string;
}

export function DashboardLayout({
  userName,
  metrics,
  isLoading,
  className,
}: DashboardLayoutProps) {
  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div
      className={`h-full grid gap-6 grid-rows-[auto_auto_1fr_1fr] lg:grid-rows-[80px_140px_380px_1fr] ${
        className || ""
      }`}
    >
      {/* Header Section */}
      <DashboardHeader userName={userName} />

      {/* Stats Cards Section */}
      <DashboardStatsGrid metrics={metrics} isLoading={isLoading} />

      {/* Charts Section */}
      <DashboardCharts />

      {/* Recent Invoices Table */}
      <RecentInvoicesSection />
    </div>
  );
}
