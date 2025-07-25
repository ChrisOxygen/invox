"use server";

/**
 * Dashboard actions for retrieving invoice metrics and analytics
 */

import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { InvoiceStatus } from "@prisma/client";
import type { InvoiceMetricsResponse, ClientMetricsResponse } from "../types";
import {
  calculateInvoiceRevenue,
  calculateGrowthPercentage,
  getMonthName,
} from "../utils";

/**
 * Get invoice metrics for the current year and previous year
 * This function retrieves monthly breakdown data for charts and annual totals for stat cards
 */
export async function _getInvoiceMetrics(): Promise<InvoiceMetricsResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get user's business
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        business: true,
      },
    });

    if (!user || !user.business) {
      return {
        success: false,
        message: "Business profile not found",
      };
    }

    const businessId = user.business.id;
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Date ranges for current and previous year
    const currentYearStart = new Date(currentYear, 0, 1);
    const currentYearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const previousYearStart = new Date(previousYear, 0, 1);
    const previousYearEnd = new Date(previousYear, 11, 31, 23, 59, 59, 999);

    // Get all invoices for both years
    const [currentYearInvoices, previousYearInvoices] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          businessId,
          invoiceDate: {
            gte: currentYearStart,
            lte: currentYearEnd,
          },
        },
        select: {
          id: true,
          invoiceDate: true,
          subtotal: true,
          taxes: true,
          discount: true,
          status: true,
        },
      }),
      prisma.invoice.findMany({
        where: {
          businessId,
          invoiceDate: {
            gte: previousYearStart,
            lte: previousYearEnd,
          },
        },
        select: {
          id: true,
          invoiceDate: true,
          subtotal: true,
          taxes: true,
          discount: true,
          status: true,
        },
      }),
    ]);

    // Function to process year data
    const processYearData = (
      invoices: typeof currentYearInvoices,
      year: number
    ) => {
      // Initialize monthly data array
      const monthlyData = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        monthName: getMonthName(index + 1),
        revenue: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        totalInvoices: 0,
      }));

      // Process each invoice
      invoices.forEach((invoice) => {
        const invoiceMonth = new Date(invoice.invoiceDate).getMonth(); // 0-indexed
        const revenue = calculateInvoiceRevenue(
          invoice.subtotal,
          invoice.taxes,
          invoice.discount
        );

        // Update monthly data
        monthlyData[invoiceMonth].totalInvoices++;

        if (invoice.status === InvoiceStatus.PAID) {
          monthlyData[invoiceMonth].revenue += revenue;
          monthlyData[invoiceMonth].paidInvoices++;
        } else if (invoice.status === InvoiceStatus.SENT) {
          monthlyData[invoiceMonth].pendingInvoices++;
        }
      });

      // Calculate totals
      const totals = monthlyData.reduce(
        (acc, month) => ({
          revenue: acc.revenue + month.revenue,
          paidInvoices: acc.paidInvoices + month.paidInvoices,
          pendingInvoices: acc.pendingInvoices + month.pendingInvoices,
          totalInvoices: acc.totalInvoices + month.totalInvoices,
        }),
        { revenue: 0, paidInvoices: 0, pendingInvoices: 0, totalInvoices: 0 }
      );

      return {
        year,
        monthlyData,
        totals,
      };
    };

    // Process data for both years
    const currentYearData = processYearData(currentYearInvoices, currentYear);
    const previousYearData = processYearData(
      previousYearInvoices,
      previousYear
    );

    // Calculate year-over-year growth
    const yearOverYearGrowth = {
      revenueGrowth: calculateGrowthPercentage(
        currentYearData.totals.revenue,
        previousYearData.totals.revenue
      ),
      paidInvoicesGrowth: calculateGrowthPercentage(
        currentYearData.totals.paidInvoices,
        previousYearData.totals.paidInvoices
      ),
      pendingInvoicesGrowth: calculateGrowthPercentage(
        currentYearData.totals.pendingInvoices,
        previousYearData.totals.pendingInvoices
      ),
      totalInvoicesGrowth: calculateGrowthPercentage(
        currentYearData.totals.totalInvoices,
        previousYearData.totals.totalInvoices
      ),
    };

    return {
      success: true,
      message: "Invoice metrics retrieved successfully",
      data: {
        currentYear: currentYearData,
        previousYear: previousYearData,
        yearOverYearGrowth,
      },
    };
  } catch (error) {
    console.error("Error getting invoice metrics:", error);
    return {
      success: false,
      message: "Failed to retrieve invoice metrics",
    };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Get client metrics for the current year and previous year
 * This function retrieves monthly breakdown data for charts and annual totals for stat cards
 */
export async function _getClientMetrics(): Promise<ClientMetricsResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get user's business
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        business: true,
      },
    });

    if (!user || !user.business) {
      return {
        success: false,
        message: "Business profile not found",
      };
    }

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Date ranges for current and previous year
    const currentYearStart = new Date(currentYear, 0, 1);
    const currentYearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const previousYearStart = new Date(previousYear, 0, 1);
    const previousYearEnd = new Date(previousYear, 11, 31, 23, 59, 59, 999);

    // Get all clients for both years
    const [currentYearClients, previousYearClients, totalClients] =
      await Promise.all([
        prisma.client.findMany({
          where: {
            userId: session.user.id,
            createdAt: {
              gte: currentYearStart,
              lte: currentYearEnd,
            },
          },
          select: {
            id: true,
            createdAt: true,
          },
        }),
        prisma.client.findMany({
          where: {
            userId: session.user.id,
            createdAt: {
              gte: previousYearStart,
              lte: previousYearEnd,
            },
          },
          select: {
            id: true,
            createdAt: true,
          },
        }),
        prisma.client.count({
          where: {
            userId: session.user.id,
          },
        }),
      ]);

    // Function to process year data
    const processYearData = (
      clients: typeof currentYearClients,
      year: number
    ) => {
      // Initialize monthly data array
      const monthlyData = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        monthName: getMonthName(index + 1),
        newClients: 0,
        totalClients: 0,
      }));

      // Process each client
      clients.forEach((client) => {
        const clientMonth = new Date(client.createdAt).getMonth(); // 0-indexed
        monthlyData[clientMonth].newClients++;
      });

      // Calculate cumulative totals for each month
      let cumulativeTotal = 0;
      monthlyData.forEach((month) => {
        cumulativeTotal += month.newClients;
        month.totalClients = cumulativeTotal;
      });

      // Calculate totals
      const totals = {
        newClients: clients.length,
        totalClients: year === currentYear ? totalClients : clients.length,
      };

      return {
        year,
        monthlyData,
        totals,
      };
    };

    // Process data for both years
    const currentYearData = processYearData(currentYearClients, currentYear);
    const previousYearData = processYearData(previousYearClients, previousYear);

    // Calculate year-over-year growth
    const yearOverYearGrowth = {
      newClientsGrowth: calculateGrowthPercentage(
        currentYearData.totals.newClients,
        previousYearData.totals.newClients
      ),
      totalClientsGrowth: calculateGrowthPercentage(
        currentYearData.totals.totalClients,
        previousYearData.totals.totalClients
      ),
    };

    return {
      success: true,
      message: "Client metrics retrieved successfully",
      data: {
        currentYear: currentYearData,
        previousYear: previousYearData,
        yearOverYearGrowth,
      },
    };
  } catch (error) {
    console.error("Error getting client metrics:", error);
    return {
      success: false,
      message: "Failed to retrieve client metrics",
    };
  } finally {
    await prisma.$disconnect();
  }
}
