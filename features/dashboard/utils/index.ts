/**
 * Dashboard utility functions for revenue calculations and analytics
 * Main entry point for all dashboard utilities
 */

// Export all types
export * from "../types";

// Export specific utility modules (avoiding naming conflicts)
export * from "./dateHelpers";
export * from "./revenueCalculations";
export * from "./clientCalculations";

// Export specific functions from invoice calculations to avoid naming conflicts
export {
  calculateInvoiceCountMetrics,
  calculatePaidInvoicesMetrics,
  calculatePendingInvoicesMetrics,
  countInvoicesByStatus,
  getMonthlyPaidInvoicesHistory,
  getMonthlyPendingInvoicesHistory,
  calculateYearOverYearPaidInvoicesGrowth,
} from "./invoiceCalculations";

// Export dashboard metrics functions
export {
  calculateDashboardMetrics,
  getDashboardSummary,
  getMonthlyDashboardHistory,
  calculateQuarterOverQuarterGrowth,
  getTopPerformingMonths,
} from "./dashboardMetrics";
