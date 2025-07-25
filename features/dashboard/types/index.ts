/**
 * Dashboard type definitions
 */

import { InvoiceStatus } from "@prisma/client";

/**
 * Invoice data interface for calculations
 */
export interface InvoiceData {
  id: string;
  subtotal: number;
  taxes: number;
  discount: number;
  status: InvoiceStatus;
  invoiceDate: Date;
  clientId: string;
}

/**
 * Client data interface for calculations
 */
export interface ClientData {
  id: string;
  BusinessName: string;
  email: string;
  createdAt: Date;
  userId: string;
}

/**
 * Date range interface for filtering
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Revenue metrics interface
 */
export interface RevenueMetrics {
  totalRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  growthPercentage: number;
  trend: "UP" | "DOWN" | "FLAT";
}

/**
 * Invoice count metrics interface
 */
export interface InvoiceCountMetrics {
  totalPaidInvoices: number;
  thisMonthPaidInvoices: number;
  lastMonthPaidInvoices: number;
  paidInvoicesGrowthPercentage: number;
  paidInvoicesTrend: "UP" | "DOWN" | "FLAT";

  totalPendingInvoices: number;
  thisMonthPendingInvoices: number;
  lastMonthPendingInvoices: number;
  pendingInvoicesGrowthPercentage: number;
  pendingInvoicesTrend: "UP" | "DOWN" | "FLAT";
}

/**
 * Client metrics interface
 */
export interface ClientMetrics {
  totalClients: number;
  thisMonthNewClients: number;
  lastMonthNewClients: number;
  clientGrowthPercentage: number;
  clientTrend: "UP" | "DOWN" | "FLAT";
}

/**
 * Comprehensive dashboard metrics interface
 */
export interface DashboardMetrics {
  revenue: RevenueMetrics;
  invoices: InvoiceCountMetrics;
  clients: ClientMetrics;
}

/**
 * Monthly data point for historical analysis
 */
export interface MonthlyDataPoint {
  month: string;
  year: number;
  date: Date;
  revenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  newClients: number;
}

/**
 * Trend direction type
 */
export type TrendDirection = "UP" | "DOWN" | "FLAT";

/**
 * Growth calculation result
 */
export interface GrowthResult {
  current: number;
  previous: number;
  growthPercentage: number;
  trend: TrendDirection;
}

/**
 * Response interface for invoice metrics
 */
export interface InvoiceMetricsResponse {
  success: boolean;
  message: string;
  data?: {
    currentYear: {
      year: number;
      monthlyData: Array<{
        month: number;
        monthName: string;
        revenue: number;
        paidInvoices: number;
        pendingInvoices: number;
        totalInvoices: number;
      }>;
      totals: {
        revenue: number;
        paidInvoices: number;
        pendingInvoices: number;
        totalInvoices: number;
      };
    };
    previousYear: {
      year: number;
      monthlyData: Array<{
        month: number;
        monthName: string;
        revenue: number;
        paidInvoices: number;
        pendingInvoices: number;
        totalInvoices: number;
      }>;
      totals: {
        revenue: number;
        paidInvoices: number;
        pendingInvoices: number;
        totalInvoices: number;
      };
    };
    yearOverYearGrowth: {
      revenueGrowth: number;
      paidInvoicesGrowth: number;
      pendingInvoicesGrowth: number;
      totalInvoicesGrowth: number;
    };
  };
}

/**
 * Response interface for client metrics
 */
export interface ClientMetricsResponse {
  success: boolean;
  message: string;
  data?: {
    currentYear: {
      year: number;
      monthlyData: Array<{
        month: number;
        monthName: string;
        newClients: number;
        totalClients: number;
      }>;
      totals: {
        newClients: number;
        totalClients: number;
      };
    };
    previousYear: {
      year: number;
      monthlyData: Array<{
        month: number;
        monthName: string;
        newClients: number;
        totalClients: number;
      }>;
      totals: {
        newClients: number;
        totalClients: number;
      };
    };
    yearOverYearGrowth: {
      newClientsGrowth: number;
      totalClientsGrowth: number;
    };
  };
}
