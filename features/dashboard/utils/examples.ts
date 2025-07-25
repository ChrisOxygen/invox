/**
 * Example usage of dashboard utilities
 * This file demonstrates how to use the dashboard utility functions
 */

import type { InvoiceData, ClientData } from "../types";
import {
  calculateDashboardMetrics,
  getDashboardSummary,
  getMonthlyDashboardHistory,
  calculateRevenueMetrics,
  calculateInvoiceCountMetrics,
  calculateClientMetrics,
} from "./index";

// Example data structures (replace with actual data from your API/database)
const exampleInvoices: InvoiceData[] = [
  {
    id: "1",
    subtotal: 1000,
    taxes: 100,
    discount: 50,
    status: "PAID" as const,
    invoiceDate: new Date("2024-01-15"),
    clientId: "client1",
  },
  {
    id: "2",
    subtotal: 2000,
    taxes: 200,
    discount: 0,
    status: "SENT" as const,
    invoiceDate: new Date("2024-02-10"),
    clientId: "client2",
  },
  // Add more invoice data...
];

const exampleClients: ClientData[] = [
  {
    id: "client1",
    BusinessName: "Acme Corp",
    email: "contact@acme.com",
    createdAt: new Date("2024-01-01"),
    userId: "user1",
  },
  {
    id: "client2",
    BusinessName: "Tech Solutions",
    email: "info@techsolutions.com",
    createdAt: new Date("2024-02-01"),
    userId: "user1",
  },
  // Add more client data...
];

/**
 * Example: Calculate comprehensive dashboard metrics
 */
export function exampleComprehensiveDashboard() {
  const metrics = calculateDashboardMetrics(exampleInvoices, exampleClients);

  console.log("📊 Dashboard Metrics:");
  console.log("💰 Revenue:", {
    total: `$${metrics.revenue.totalRevenue}`,
    thisMonth: `$${metrics.revenue.thisMonthRevenue}`,
    growth: `${metrics.revenue.growthPercentage}% (${metrics.revenue.trend})`,
  });

  console.log("📋 Invoices:", {
    paid: `${metrics.invoices.totalPaidInvoices} (${metrics.invoices.paidInvoicesGrowthPercentage}% ${metrics.invoices.paidInvoicesTrend})`,
    pending: `${metrics.invoices.totalPendingInvoices} (${metrics.invoices.pendingInvoicesGrowthPercentage}% ${metrics.invoices.pendingInvoicesTrend})`,
  });

  console.log("👥 Clients:", {
    total: metrics.clients.totalClients,
    newThisMonth: metrics.clients.thisMonthNewClients,
    growth: `${metrics.clients.clientGrowthPercentage}% (${metrics.clients.clientTrend})`,
  });

  return metrics;
}

/**
 * Example: Get dashboard summary
 */
export function exampleDashboardSummary() {
  const summary = getDashboardSummary(exampleInvoices, exampleClients);

  console.log("📈 Summary Stats:");
  console.log({
    totalRevenue: `$${summary.totalRevenue}`,
    totalInvoices: summary.totalInvoices,
    totalClients: summary.totalClients,
    avgInvoiceValue: `$${summary.averageInvoiceValue}`,
    monthlyAvgRevenue: `$${summary.monthlyAverageRevenue}`,
  });

  return summary;
}

/**
 * Example: Get monthly historical data
 */
export function exampleMonthlyHistory() {
  const history = getMonthlyDashboardHistory(
    exampleInvoices,
    exampleClients,
    6
  );

  console.log("📅 Monthly History (Last 6 months):");
  history.forEach((month) => {
    console.log(
      `${month.month} ${month.year}: $${month.revenue} revenue, ${month.paidInvoices} paid, ${month.pendingInvoices} pending, ${month.newClients} new clients`
    );
  });

  return history;
}

/**
 * Example: Individual metric calculations
 */
export function exampleIndividualMetrics() {
  // Revenue metrics only
  const revenueMetrics = calculateRevenueMetrics(exampleInvoices);
  console.log("💰 Revenue Metrics:", revenueMetrics);

  // Invoice count metrics only
  const invoiceMetrics = calculateInvoiceCountMetrics(exampleInvoices);
  console.log("📋 Invoice Metrics:", invoiceMetrics);

  // Client metrics only
  const clientMetrics = calculateClientMetrics(exampleClients);
  console.log("👥 Client Metrics:", clientMetrics);

  return { revenueMetrics, invoiceMetrics, clientMetrics };
}

/**
 * Example usage with custom date range
 */
export function exampleCustomDateRange() {
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-03-31");
  const dateRange = { startDate, endDate };

  const metrics = calculateDashboardMetrics(
    exampleInvoices,
    exampleClients,
    dateRange
  );

  console.log("📊 Q1 2024 Metrics:", metrics);

  return metrics;
}

// Usage examples (uncomment to run):
// exampleComprehensiveDashboard();
// exampleDashboardSummary();
// exampleMonthlyHistory();
// exampleIndividualMetrics();
// exampleCustomDateRange();
