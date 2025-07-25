/**
 * Invoice count calculation utilities
 */

import { InvoiceStatus } from "@prisma/client";
import type { InvoiceData, InvoiceCountMetrics, DateRange } from "../types";
import {
  getCurrentAndPreviousMonthRanges,
  calculateGrowthResult,
  getLastNMonthsRanges,
  formatMonth,
} from "./dateHelpers";

/**
 * Filter invoices by date range and status
 */
export function filterInvoicesByDateAndStatus(
  invoices: InvoiceData[],
  dateRange: DateRange,
  status: InvoiceStatus
): InvoiceData[] {
  return invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.invoiceDate);
    const isInDateRange =
      invoiceDate >= dateRange.startDate && invoiceDate <= dateRange.endDate;
    const hasCorrectStatus = invoice.status === status;

    return isInDateRange && hasCorrectStatus;
  });
}

/**
 * Count invoices by status
 */
export function countInvoicesByStatus(
  invoices: InvoiceData[],
  status: InvoiceStatus,
  dateRange?: DateRange
): number {
  let filteredInvoices = invoices.filter(
    (invoice) => invoice.status === status
  );

  if (dateRange) {
    filteredInvoices = filterInvoicesByDateAndStatus(
      invoices,
      dateRange,
      status
    );
  }

  return filteredInvoices.length;
}

/**
 * Calculate paid invoices metrics
 */
export function calculatePaidInvoicesMetrics(invoices: InvoiceData[]): {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growthPercentage: number;
  trend: "UP" | "DOWN" | "FLAT";
} {
  const { current: thisMonthRange, previous: lastMonthRange } =
    getCurrentAndPreviousMonthRanges();

  const totalPaidInvoices = countInvoicesByStatus(invoices, InvoiceStatus.PAID);
  const thisMonthPaidInvoices = countInvoicesByStatus(
    invoices,
    InvoiceStatus.PAID,
    thisMonthRange
  );
  const lastMonthPaidInvoices = countInvoicesByStatus(
    invoices,
    InvoiceStatus.PAID,
    lastMonthRange
  );

  const growthResult = calculateGrowthResult(
    thisMonthPaidInvoices,
    lastMonthPaidInvoices
  );

  return {
    total: totalPaidInvoices,
    thisMonth: thisMonthPaidInvoices,
    lastMonth: lastMonthPaidInvoices,
    growthPercentage: growthResult.growthPercentage,
    trend: growthResult.trend,
  };
}

/**
 * Calculate pending invoices metrics (SENT status)
 */
export function calculatePendingInvoicesMetrics(invoices: InvoiceData[]): {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growthPercentage: number;
  trend: "UP" | "DOWN" | "FLAT";
} {
  const { current: thisMonthRange, previous: lastMonthRange } =
    getCurrentAndPreviousMonthRanges();

  const totalPendingInvoices = countInvoicesByStatus(
    invoices,
    InvoiceStatus.SENT
  );
  const thisMonthPendingInvoices = countInvoicesByStatus(
    invoices,
    InvoiceStatus.SENT,
    thisMonthRange
  );
  const lastMonthPendingInvoices = countInvoicesByStatus(
    invoices,
    InvoiceStatus.SENT,
    lastMonthRange
  );

  const growthResult = calculateGrowthResult(
    thisMonthPendingInvoices,
    lastMonthPendingInvoices
  );

  return {
    total: totalPendingInvoices,
    thisMonth: thisMonthPendingInvoices,
    lastMonth: lastMonthPendingInvoices,
    growthPercentage: growthResult.growthPercentage,
    trend: growthResult.trend,
  };
}

/**
 * Main function to calculate comprehensive invoice count metrics
 * @param invoices - Array of invoice data
 * @returns Invoice count metrics including growth and trend analysis
 */
export function calculateInvoiceCountMetrics(
  invoices: InvoiceData[]
): InvoiceCountMetrics {
  const paidMetrics = calculatePaidInvoicesMetrics(invoices);
  const pendingMetrics = calculatePendingInvoicesMetrics(invoices);

  return {
    totalPaidInvoices: paidMetrics.total,
    thisMonthPaidInvoices: paidMetrics.thisMonth,
    lastMonthPaidInvoices: paidMetrics.lastMonth,
    paidInvoicesGrowthPercentage: paidMetrics.growthPercentage,
    paidInvoicesTrend: paidMetrics.trend,

    totalPendingInvoices: pendingMetrics.total,
    thisMonthPendingInvoices: pendingMetrics.thisMonth,
    lastMonthPendingInvoices: pendingMetrics.lastMonth,
    pendingInvoicesGrowthPercentage: pendingMetrics.growthPercentage,
    pendingInvoicesTrend: pendingMetrics.trend,
  };
}

/**
 * Get monthly paid invoices count history
 * @param invoices - Array of invoice data
 * @param monthsCount - Number of months to include (default: 12)
 * @returns Array of monthly paid invoices count data
 */
export function getMonthlyPaidInvoicesHistory(
  invoices: InvoiceData[],
  monthsCount: number = 12
): Array<{ month: string; year: number; count: number; date: Date }> {
  const result: Array<{
    month: string;
    year: number;
    count: number;
    date: Date;
  }> = [];
  const monthRanges = getLastNMonthsRanges(monthsCount);

  monthRanges.forEach((range) => {
    const targetDate = new Date(range.startDate);
    const monthInvoices = filterInvoicesByDateAndStatus(
      invoices,
      range,
      InvoiceStatus.PAID
    );

    result.push({
      month: formatMonth(targetDate),
      year: targetDate.getFullYear(),
      count: monthInvoices.length,
      date: targetDate,
    });
  });

  return result;
}

/**
 * Get monthly pending invoices count history
 * @param invoices - Array of invoice data
 * @param monthsCount - Number of months to include (default: 12)
 * @returns Array of monthly pending invoices count data
 */
export function getMonthlyPendingInvoicesHistory(
  invoices: InvoiceData[],
  monthsCount: number = 12
): Array<{ month: string; year: number; count: number; date: Date }> {
  const result: Array<{
    month: string;
    year: number;
    count: number;
    date: Date;
  }> = [];
  const monthRanges = getLastNMonthsRanges(monthsCount);

  monthRanges.forEach((range) => {
    const targetDate = new Date(range.startDate);
    const monthInvoices = filterInvoicesByDateAndStatus(
      invoices,
      range,
      InvoiceStatus.SENT
    );

    result.push({
      month: formatMonth(targetDate),
      year: targetDate.getFullYear(),
      count: monthInvoices.length,
      date: targetDate,
    });
  });

  return result;
}

/**
 * Calculate year-over-year paid invoices growth
 * @param invoices - Array of invoice data
 * @returns YoY growth percentage for paid invoices
 */
export function calculateYearOverYearPaidInvoicesGrowth(
  invoices: InvoiceData[]
): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;

  // Calculate current year paid invoices (up to current month)
  const currentYearStart = new Date(currentYear, 0, 1);
  const currentYearEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  const currentYearRange = {
    startDate: currentYearStart,
    endDate: currentYearEnd,
  };
  const currentYearPaidInvoices = countInvoicesByStatus(
    invoices,
    InvoiceStatus.PAID,
    currentYearRange
  );

  // Calculate previous year paid invoices (same period)
  const previousYearStart = new Date(previousYear, 0, 1);
  const previousYearEnd = new Date(
    previousYear,
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  const previousYearRange = {
    startDate: previousYearStart,
    endDate: previousYearEnd,
  };
  const previousYearPaidInvoices = countInvoicesByStatus(
    invoices,
    InvoiceStatus.PAID,
    previousYearRange
  );

  const growthResult = calculateGrowthResult(
    currentYearPaidInvoices,
    previousYearPaidInvoices
  );
  return growthResult.growthPercentage;
}
