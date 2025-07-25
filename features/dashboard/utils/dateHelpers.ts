/**
 * Date and calculation utility functions
 */

import type { DateRange, TrendDirection, GrowthResult } from "../types";

/**
 * Get the first and last day of a given month
 */
export function getMonthRange(date: Date): DateRange {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Get the first and last day of the previous month
 */
export function getPreviousMonthRange(date: Date): DateRange {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Handle year boundary
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  const startDate = new Date(prevYear, prevMonth, 1);
  const endDate = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Calculate growth percentage between two values
 */
export function calculateGrowthPercentage(
  currentValue: number,
  previousValue: number
): number {
  // Handle edge cases
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  const growth = ((currentValue - previousValue) / previousValue) * 100;
  return Number(growth.toFixed(2));
}

/**
 * Determine trend direction based on growth percentage
 */
export function getTrendDirection(growthPercentage: number): TrendDirection {
  if (growthPercentage > 0) {
    return "UP";
  } else if (growthPercentage < 0) {
    return "DOWN";
  } else {
    return "FLAT";
  }
}

/**
 * Calculate growth result with percentage and trend
 */
export function calculateGrowthResult(
  currentValue: number,
  previousValue: number
): GrowthResult {
  const growthPercentage = calculateGrowthPercentage(
    currentValue,
    previousValue
  );
  const trend = getTrendDirection(growthPercentage);

  return {
    current: currentValue,
    previous: previousValue,
    growthPercentage,
    trend,
  };
}

/**
 * Filter items by date range
 */
export function filterByDateRange<
  T extends { createdAt: Date } | { invoiceDate: Date }
>(items: T[], dateRange: DateRange): T[] {
  return items.filter((item) => {
    const itemDate =
      "createdAt" in item
        ? new Date(item.createdAt)
        : new Date(item.invoiceDate);
    return itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
  });
}

/**
 * Get year range for year-over-year calculations
 */
export function getYearRange(year: number, endMonth?: number): DateRange {
  const startDate = new Date(year, 0, 1);
  const endDate =
    endMonth !== undefined
      ? new Date(year, endMonth + 1, 0, 23, 59, 59, 999)
      : new Date(year, 11, 31, 23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Get the last N months date ranges
 */
export function getLastNMonthsRanges(monthsCount: number = 12): DateRange[] {
  const ranges: DateRange[] = [];
  const now = new Date();

  for (let i = monthsCount - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    ranges.push(getMonthRange(targetDate));
  }

  return ranges;
}

/**
 * Format month for display
 */
export function formatMonth(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}

/**
 * Get current and previous month ranges
 */
export function getCurrentAndPreviousMonthRanges(): {
  current: DateRange;
  previous: DateRange;
} {
  const now = new Date();
  return {
    current: getMonthRange(now),
    previous: getPreviousMonthRange(now),
  };
}
