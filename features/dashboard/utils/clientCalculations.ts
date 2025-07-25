/**
 * Client calculation utilities
 */

import type { ClientData, ClientMetrics, DateRange } from "../types";
import {
  getCurrentAndPreviousMonthRanges,
  calculateGrowthResult,
  getLastNMonthsRanges,
  formatMonth,
  filterByDateRange,
} from "./dateHelpers";

/**
 * Filter clients by date range
 */
export function filterClientsByDateRange(
  clients: ClientData[],
  dateRange: DateRange
): ClientData[] {
  return filterByDateRange(clients, dateRange);
}

/**
 * Count total clients
 */
export function countTotalClients(clients: ClientData[]): number {
  return clients.length;
}

/**
 * Count new clients in a date range
 */
export function countNewClientsInRange(
  clients: ClientData[],
  dateRange: DateRange
): number {
  const filteredClients = filterClientsByDateRange(clients, dateRange);
  return filteredClients.length;
}

/**
 * Main function to calculate comprehensive client metrics
 * @param clients - Array of client data
 * @returns Client metrics including growth and trend analysis
 */
export function calculateClientMetrics(clients: ClientData[]): ClientMetrics {
  const { current: thisMonthRange, previous: lastMonthRange } =
    getCurrentAndPreviousMonthRanges();

  const totalClients = countTotalClients(clients);
  const thisMonthNewClients = countNewClientsInRange(clients, thisMonthRange);
  const lastMonthNewClients = countNewClientsInRange(clients, lastMonthRange);

  const growthResult = calculateGrowthResult(
    thisMonthNewClients,
    lastMonthNewClients
  );

  return {
    totalClients,
    thisMonthNewClients,
    lastMonthNewClients,
    clientGrowthPercentage: growthResult.growthPercentage,
    clientTrend: growthResult.trend,
  };
}

/**
 * Get monthly new clients history
 * @param clients - Array of client data
 * @param monthsCount - Number of months to include (default: 12)
 * @returns Array of monthly new clients data
 */
export function getMonthlyNewClientsHistory(
  clients: ClientData[],
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
    const monthClients = filterClientsByDateRange(clients, range);

    result.push({
      month: formatMonth(targetDate),
      year: targetDate.getFullYear(),
      count: monthClients.length,
      date: targetDate,
    });
  });

  return result;
}

/**
 * Get clients by month of creation
 * @param clients - Array of client data
 * @param year - Target year
 * @param month - Target month (0-indexed, January = 0)
 * @returns Count of clients created in the specified month
 */
export function getClientsCountByMonth(
  clients: ClientData[],
  year: number,
  month: number
): number {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
  const dateRange = { startDate, endDate };

  return countNewClientsInRange(clients, dateRange);
}

/**
 * Calculate year-over-year client growth
 * @param clients - Array of client data
 * @returns YoY growth percentage for new clients
 */
export function calculateYearOverYearClientGrowth(
  clients: ClientData[]
): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;

  // Calculate current year new clients (up to current month)
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
  const currentYearNewClients = countNewClientsInRange(
    clients,
    currentYearRange
  );

  // Calculate previous year new clients (same period)
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
  const previousYearNewClients = countNewClientsInRange(
    clients,
    previousYearRange
  );

  const growthResult = calculateGrowthResult(
    currentYearNewClients,
    previousYearNewClients
  );
  return growthResult.growthPercentage;
}

/**
 * Get unique clients from invoices (useful for analysis)
 * @param invoices - Array of invoice data with clientId
 * @returns Array of unique client IDs
 */
export function getUniqueClientIdsFromInvoices(
  invoices: Array<{ clientId: string }>
): string[] {
  const uniqueClientIds = new Set<string>();
  invoices.forEach((invoice) => uniqueClientIds.add(invoice.clientId));
  return Array.from(uniqueClientIds);
}

/**
 * Calculate client retention metrics
 * @param clients - Array of client data
 * @param invoices - Array of invoice data
 * @returns Client retention analysis
 */
export function calculateClientRetentionMetrics(
  clients: ClientData[],
  invoices: Array<{ clientId: string; invoiceDate: Date }>
): {
  totalClients: number;
  activeClients: number;
  retentionRate: number;
} {
  const totalClients = clients.length;
  const uniqueActiveClientIds = getUniqueClientIdsFromInvoices(invoices);
  const activeClients = uniqueActiveClientIds.length;
  const retentionRate =
    totalClients > 0
      ? Number(((activeClients / totalClients) * 100).toFixed(2))
      : 0;

  return {
    totalClients,
    activeClients,
    retentionRate,
  };
}
