/**
 * Composite custom hook for dashboard metrics
 * Combines invoice and client metrics and transforms data for stat cards
 */

import { useMemo } from "react";
import { useInvoiceMetrics } from "./useInvoiceMetrics";
import { useClientMetrics } from "./useClientMetrics";
import type { DashboardMetrics, TrendDirection } from "../types";

interface UseDashboardMetricsReturn {
  data: DashboardMetrics | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Helper function to determine trend direction from growth percentage
 */
function getTrendDirection(growthPercentage: number): TrendDirection {
  if (growthPercentage > 0) return "UP";
  if (growthPercentage < 0) return "DOWN";
  return "FLAT";
}

export function useDashboardMetrics(): UseDashboardMetricsReturn {
  const invoiceQuery = useInvoiceMetrics();
  const clientQuery = useClientMetrics();

  const isLoading = invoiceQuery.isLoading || clientQuery.isLoading;
  const isError = invoiceQuery.isError || clientQuery.isError;
  const error = invoiceQuery.error || clientQuery.error;

  const refetch = () => {
    invoiceQuery.refetch();
    clientQuery.refetch();
  };

  const transformedData = useMemo((): DashboardMetrics | null => {
    // Return null if either query failed or data is not available
    if (
      !invoiceQuery.data?.success ||
      !invoiceQuery.data.data ||
      !clientQuery.data?.success ||
      !clientQuery.data.data
    ) {
      return null;
    }

    const invoiceData = invoiceQuery.data.data;
    const clientData = clientQuery.data.data;

    return {
      revenue: {
        totalRevenue: invoiceData.currentYear.totals.revenue,
        thisMonthRevenue: 0, // TODO: Calculate current month if needed
        lastMonthRevenue: 0, // TODO: Calculate last month if needed
        growthPercentage: invoiceData.yearOverYearGrowth.revenueGrowth,
        trend: getTrendDirection(invoiceData.yearOverYearGrowth.revenueGrowth),
      },
      invoices: {
        totalPaidInvoices: invoiceData.currentYear.totals.paidInvoices,
        thisMonthPaidInvoices: 0, // TODO: Calculate current month if needed
        lastMonthPaidInvoices: 0, // TODO: Calculate last month if needed
        paidInvoicesGrowthPercentage:
          invoiceData.yearOverYearGrowth.paidInvoicesGrowth,
        paidInvoicesTrend: getTrendDirection(
          invoiceData.yearOverYearGrowth.paidInvoicesGrowth
        ),
        totalPendingInvoices: invoiceData.currentYear.totals.pendingInvoices,
        thisMonthPendingInvoices: 0, // TODO: Calculate current month if needed
        lastMonthPendingInvoices: 0, // TODO: Calculate last month if needed
        pendingInvoicesGrowthPercentage:
          invoiceData.yearOverYearGrowth.pendingInvoicesGrowth,
        pendingInvoicesTrend: getTrendDirection(
          invoiceData.yearOverYearGrowth.pendingInvoicesGrowth
        ),
      },
      clients: {
        totalClients: clientData.currentYear.totals.totalClients,
        thisMonthNewClients: 0, // TODO: Calculate current month if needed
        lastMonthNewClients: 0, // TODO: Calculate last month if needed
        clientGrowthPercentage:
          clientData.yearOverYearGrowth.totalClientsGrowth,
        clientTrend: getTrendDirection(
          clientData.yearOverYearGrowth.totalClientsGrowth
        ),
      },
    };
  }, [invoiceQuery.data, clientQuery.data]);

  return {
    data: transformedData,
    isLoading,
    isError,
    error,
    refetch,
  };
}
