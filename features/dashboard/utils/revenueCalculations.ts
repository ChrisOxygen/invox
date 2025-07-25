/**
 * Revenue calculation utilities
 */

import { InvoiceStatus } from "@prisma/client";
import type { InvoiceData, RevenueMetrics, DateRange } from "../types";
import {
  getMonthRange,
  getCurrentAndPreviousMonthRanges,
  calculateGrowthResult,
  getLastNMonthsRanges,
  formatMonth,
} from "./dateHelpers";

/**
 * Calculate the net revenue from an invoice
 * Formula: subtotal + taxes - discount
 */
export function calculateInvoiceRevenue(invoice: InvoiceData): number {
  const revenue = invoice.subtotal + invoice.taxes - invoice.discount;
  return Math.max(0, Number(revenue.toFixed(2))); // Ensure non-negative and round to 2 decimals
}

/**
 * Filter invoices by date range and status
 */
export function filterInvoicesByDateAndStatus(
  invoices: InvoiceData[],
  dateRange: DateRange,
  status: InvoiceStatus = InvoiceStatus.PAID
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
 * Calculate total revenue from filtered invoices
 */
export function calculateTotalRevenue(invoices: InvoiceData[]): number {
  const total = invoices.reduce((sum, invoice) => {
    return sum + calculateInvoiceRevenue(invoice);
  }, 0);

  return Number(total.toFixed(2));
}

/**
 * Main function to calculate comprehensive revenue metrics
 * @param invoices - Array of invoice data
 * @param dateRange - Optional custom date range, defaults to all time
 * @returns Revenue metrics including growth and trend analysis
 */
export function calculateRevenueMetrics(
  invoices: InvoiceData[],
  dateRange?: DateRange
): RevenueMetrics {
  // Calculate total revenue (all time or within date range)
  let totalRevenue: number;
  if (dateRange) {
    const filteredInvoices = filterInvoicesByDateAndStatus(invoices, dateRange);
    totalRevenue = calculateTotalRevenue(filteredInvoices);
  } else {
    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === InvoiceStatus.PAID
    );
    totalRevenue = calculateTotalRevenue(paidInvoices);
  }

  // Get current and previous month ranges
  const { current: thisMonthRange, previous: lastMonthRange } =
    getCurrentAndPreviousMonthRanges();

  // Calculate this month's revenue
  const thisMonthInvoices = filterInvoicesByDateAndStatus(
    invoices,
    thisMonthRange
  );
  const thisMonthRevenue = calculateTotalRevenue(thisMonthInvoices);

  // Calculate last month's revenue
  const lastMonthInvoices = filterInvoicesByDateAndStatus(
    invoices,
    lastMonthRange
  );
  const lastMonthRevenue = calculateTotalRevenue(lastMonthInvoices);

  // Calculate growth metrics
  const growthResult = calculateGrowthResult(
    thisMonthRevenue,
    lastMonthRevenue
  );

  return {
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    growthPercentage: growthResult.growthPercentage,
    trend: growthResult.trend,
  };
}

/**
 * Calculate revenue metrics for a specific month
 * @param invoices - Array of invoice data
 * @param year - Target year
 * @param month - Target month (0-indexed, January = 0)
 * @returns Revenue for the specified month
 */
export function calculateMonthlyRevenue(
  invoices: InvoiceData[],
  year: number,
  month: number
): number {
  const targetDate = new Date(year, month, 1);
  const monthRange = getMonthRange(targetDate);
  const monthInvoices = filterInvoicesByDateAndStatus(invoices, monthRange);

  return calculateTotalRevenue(monthInvoices);
}

/**
 * Get revenue data for the last N months
 * @param invoices - Array of invoice data
 * @param monthsCount - Number of months to include (default: 12)
 * @returns Array of monthly revenue data
 */
export function getMonthlyRevenueHistory(
  invoices: InvoiceData[],
  monthsCount: number = 12
): Array<{ month: string; year: number; revenue: number; date: Date }> {
  const result: Array<{
    month: string;
    year: number;
    revenue: number;
    date: Date;
  }> = [];
  const monthRanges = getLastNMonthsRanges(monthsCount);

  monthRanges.forEach((range) => {
    const targetDate = new Date(range.startDate);
    const monthInvoices = filterInvoicesByDateAndStatus(invoices, range);
    const revenue = calculateTotalRevenue(monthInvoices);

    result.push({
      month: formatMonth(targetDate),
      year: targetDate.getFullYear(),
      revenue,
      date: targetDate,
    });
  });

  return result;
}

/**
 * Calculate year-over-year revenue growth
 * @param invoices - Array of invoice data
 * @returns YoY growth percentage
 */
export function calculateYearOverYearRevenueGrowth(
  invoices: InvoiceData[]
): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;

  // Calculate current year revenue (up to current month)
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
  const currentYearInvoices = filterInvoicesByDateAndStatus(
    invoices,
    currentYearRange
  );
  const currentYearRevenue = calculateTotalRevenue(currentYearInvoices);

  // Calculate previous year revenue (same period)
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
  const previousYearInvoices = filterInvoicesByDateAndStatus(
    invoices,
    previousYearRange
  );
  const previousYearRevenue = calculateTotalRevenue(previousYearInvoices);

  const growthResult = calculateGrowthResult(
    currentYearRevenue,
    previousYearRevenue
  );
  return growthResult.growthPercentage;
}
