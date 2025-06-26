"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetInvoiceStats } from "@/features/invoice/hooks";
import { FiFileText, FiSend, FiCheckCircle } from "react-icons/fi";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
}

function StatsCard({
  title,
  value,
  icon,
  description,
  isLoading = false,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-gray-100 p-1 flex items-center justify-center text-gray-800">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {description && (
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function InvoiceStatsCards() {
  const { totalInvoices, paidInvoices, pendingInvoices, isLoading, isError } =
    useGetInvoiceStats();

  // Calculate percentage of paid invoices
  const paidPercentage =
    totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

  // Calculate percentage of sent invoices
  const sentPercentage =
    totalInvoices > 0 ? Math.round((pendingInvoices / totalInvoices) * 100) : 0;

  if (isError) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Failed to load invoice statistics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
      <StatsCard
        title="Total Invoices"
        value={totalInvoices}
        icon={<FiFileText className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <StatsCard
        title="Sent Invoices"
        value={pendingInvoices}
        icon={<FiSend className="h-5 w-5" />}
        description={`${sentPercentage}% of total invoices`}
        isLoading={isLoading}
      />

      <StatsCard
        title="Paid Invoices"
        value={paidInvoices}
        icon={<FiCheckCircle className="h-5 w-5" />}
        description={`${paidPercentage}% of total invoices`}
        isLoading={isLoading}
      />
    </div>
  );
}
