/**
 * Comprehensive dashboard utilities - combines all metrics
 */

import { InvoiceStatus } from "@prisma/client";
import type {
  InvoiceData,
  ClientData,
  DashboardMetrics,
  MonthlyDataPoint,
  DateRange,
} from "../types";
import {
  calculateRevenueMetrics,
  calculateTotalRevenue,
  filterInvoicesByDateAndStatus as filterInvoicesByDateAndStatusRevenue,
} from "./revenueCalculations";
import {
  calculateInvoiceCountMetrics,
  countInvoicesByStatus,
} from "./invoiceCalculations";
import {
  calculateClientMetrics,
  countNewClientsInRange,
} from "./clientCalculations";
import {
  getLastNMonthsRanges,
  formatMonth,
  calculateGrowthPercentage,
} from "./dateHelpers";

/**
 * Calculate comprehensive dashboard metrics
 * @param invoices - Array of invoice data
 * @param clients - Array of client data
 * @param dateRange - Optional custom date range
 * @returns Complete dashboard metrics
 */
export function calculateDashboardMetrics(
  invoices: InvoiceData[],
  clients: ClientData[],
  dateRange?: DateRange
): DashboardMetrics {
  const revenue = calculateRevenueMetrics(invoices, dateRange);
  const invoiceMetrics = calculateInvoiceCountMetrics(invoices);
  const clientMetrics = calculateClientMetrics(clients);

  return {
    revenue,
    invoices: invoiceMetrics,
    clients: clientMetrics,
  };
}

/**
 * Get comprehensive monthly data for historical analysis
 * @param invoices - Array of invoice data
 * @param clients - Array of client data
 * @param monthsCount - Number of months to include (default: 12)
 * @returns Array of monthly data points
 */
export function getMonthlyDashboardHistory(
  invoices: InvoiceData[],
  clients: ClientData[],
  monthsCount: number = 12
): MonthlyDataPoint[] {
  const result: MonthlyDataPoint[] = [];
  const monthRanges = getLastNMonthsRanges(monthsCount);

  monthRanges.forEach((range) => {
    const targetDate = new Date(range.startDate);

    // Calculate revenue for the month
    const monthPaidInvoices = filterInvoicesByDateAndStatusRevenue(
      invoices,
      range,
      InvoiceStatus.PAID
    );
    const revenue = calculateTotalRevenue(monthPaidInvoices);

    // Count paid and pending invoices for the month
    const paidInvoices = countInvoicesByStatus(
      invoices,
      InvoiceStatus.PAID,
      range
    );
    const pendingInvoices = countInvoicesByStatus(
      invoices,
      InvoiceStatus.SENT,
      range
    );

    // Count new clients for the month
    const newClients = countNewClientsInRange(clients, range);

    result.push({
      month: formatMonth(targetDate),
      year: targetDate.getFullYear(),
      date: targetDate,
      revenue,
      paidInvoices,
      pendingInvoices,
      newClients,
    });
  });

  return result;
}

/**
 * Get summary statistics for quick overview
 * @param invoices - Array of invoice data
 * @param clients - Array of client data
 * @returns Summary statistics
 */
export function getDashboardSummary(
  invoices: InvoiceData[],
  clients: ClientData[]
): {
  totalRevenue: number;
  totalInvoices: number;
  totalClients: number;
  averageInvoiceValue: number;
  monthlyAverageRevenue: number;
} {
  const metrics = calculateDashboardMetrics(invoices, clients);
  const totalInvoices = invoices.length;
  const averageInvoiceValue =
    totalInvoices > 0
      ? Number((metrics.revenue.totalRevenue / totalInvoices).toFixed(2))
      : 0;

  // Calculate monthly average revenue (last 12 months)
  const monthlyHistory = getMonthlyDashboardHistory(invoices, clients, 12);
  const totalMonthlyRevenue = monthlyHistory.reduce(
    (sum, month) => sum + month.revenue,
    0
  );
  const monthlyAverageRevenue =
    monthlyHistory.length > 0
      ? Number((totalMonthlyRevenue / monthlyHistory.length).toFixed(2))
      : 0;

  return {
    totalRevenue: metrics.revenue.totalRevenue,
    totalInvoices,
    totalClients: metrics.clients.totalClients,
    averageInvoiceValue,
    monthlyAverageRevenue,
  };
}

/**
 * Get top performing months
 * @param invoices - Array of invoice data
 * @param clients - Array of client data
 * @param topCount - Number of top months to return (default: 5)
 * @returns Array of top performing months by revenue
 */
export function getTopPerformingMonths(
  invoices: InvoiceData[],
  clients: ClientData[],
  topCount: number = 5
): MonthlyDataPoint[] {
  const monthlyHistory = getMonthlyDashboardHistory(invoices, clients, 12);

  return monthlyHistory
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, topCount);
}

/**
 * Calculate quarter-over-quarter growth
 * @param invoices - Array of invoice data
 * @returns QoQ growth percentage
 */
export function calculateQuarterOverQuarterGrowth(
  invoices: InvoiceData[]
): number {
  const now = new Date();
  const currentQuarter = Math.floor(now.getMonth() / 3);
  const currentYear = now.getFullYear();

  // Current quarter
  const currentQuarterStart = new Date(currentYear, currentQuarter * 3, 1);
  const currentQuarterEnd = new Date(
    currentYear,
    (currentQuarter + 1) * 3,
    0,
    23,
    59,
    59,
    999
  );

  // Previous quarter (handle year boundary)
  let prevQuarter = currentQuarter - 1;
  let prevYear = currentYear;
  if (prevQuarter < 0) {
    prevQuarter = 3;
    prevYear = currentYear - 1;
  }
  const previousQuarterStart = new Date(prevYear, prevQuarter * 3, 1);
  const previousQuarterEnd = new Date(
    prevYear,
    (prevQuarter + 1) * 3,
    0,
    23,
    59,
    59,
    999
  );

  // Calculate revenues
  const currentQuarterInvoices = filterInvoicesByDateAndStatusRevenue(
    invoices,
    { startDate: currentQuarterStart, endDate: currentQuarterEnd },
    InvoiceStatus.PAID
  );
  const currentQuarterRevenue = calculateTotalRevenue(currentQuarterInvoices);

  const previousQuarterInvoices = filterInvoicesByDateAndStatusRevenue(
    invoices,
    { startDate: previousQuarterStart, endDate: previousQuarterEnd },
    InvoiceStatus.PAID
  );
  const previousQuarterRevenue = calculateTotalRevenue(previousQuarterInvoices);

  return calculateGrowthPercentage(
    currentQuarterRevenue,
    previousQuarterRevenue
  );
}

// Export all main functions
export {
  calculateRevenueMetrics,
  calculateInvoiceCountMetrics,
  calculateClientMetrics,
};

// Re-export utility functions from other modules
export * from "./dateHelpers";
export * from "./revenueCalculations";
export * from "./clientCalculations";

// Export specific functions from invoice calculations to avoid naming conflicts
export {
  countInvoicesByStatus,
  calculatePaidInvoicesMetrics,
  calculatePendingInvoicesMetrics,
  getMonthlyPaidInvoicesHistory,
  getMonthlyPendingInvoicesHistory,
  calculateYearOverYearPaidInvoicesGrowth,
} from "./invoiceCalculations";
