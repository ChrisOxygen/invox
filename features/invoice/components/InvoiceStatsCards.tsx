"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetInvoiceStats } from "@/features/invoice/hooks";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiCreditCard,
  FiFileText,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils";

// Component for the first stat card showing invoice counts in columns
interface StatusOverviewCardProps {
  created: number;
  sent: number;
  paid: number;
  isLoading?: boolean;
}

function StatusOverviewCard({
  created,
  sent,
  paid,
  isLoading = false,
}: StatusOverviewCardProps) {
  const columns = [
    {
      label: "Created",
      value: created,
      icon: <FiFileText className="h-5 w-5 mb-2" />,
    },
    { label: "Sent", value: sent, icon: <FiSend className="h-5 w-5 mb-2" /> },
    { label: "Paid", value: paid, icon: <FiCheck className="h-5 w-5 mb-2" /> },
  ];

  return (
    <Card className="bg-gray-900 col-span-2 h-full">
      <CardContent className="p-6 h-full">
        <div className="grid grid-cols-3 h-full">
          {columns.map((column, index) => (
            <div
              key={column.label}
              className={`flex flex-col items-center justify-center py-6 
                ${
                  index < columns.length - 1 ? "border-r border-gray-700" : ""
                }`}
            >
              <div className="text-gray-300 mb-1">{column.icon}</div>
              <span className="text-gray-400 text-sm mb-2">{column.label}</span>
              {isLoading ? (
                <Skeleton className="h-10 w-16 bg-gray-800" />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {column.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growthPercentage?: number;
  isLoading?: boolean;
}

function StatsCard({
  title,
  value,
  icon,
  growthPercentage,
  isLoading = false,
}: StatsCardProps) {
  // Determine if growth is positive, negative or zero
  const isPositiveGrowth =
    growthPercentage !== undefined && growthPercentage > 0;
  const isZeroGrowth = growthPercentage === 0;

  // Get the appropriate icon and color based on growth
  const TrendIcon = isPositiveGrowth ? FiTrendingUp : FiTrendingDown;
  const trendColorClass = isPositiveGrowth
    ? "text-green-600"
    : isZeroGrowth
    ? "text-gray-500"
    : "text-red-600";

  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col items-center h-full justify-between">
        {/* Icon Above */}
        <div className="h-12 w-12 rounded-full bg-gray-100 p-2 flex items-center justify-center text-gray-800 mb-3">
          {icon}
        </div>

        {/* Value in the middle */}
        <div className="flex-grow flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="h-10 w-28" />
          ) : (
            <div className="text-3xl font-bold text-gray-900">{value}</div>
          )}
        </div>

        {/* Title and Growth at the bottom */}
        <div className="flex flex-col items-center mt-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

          {growthPercentage !== undefined &&
            (isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <div className="flex items-center space-x-1">
                <TrendIcon className={`h-4 w-4 ${trendColorClass}`} />
                <span className={`text-sm font-medium ${trendColorClass}`}>
                  {Math.abs(growthPercentage)}%
                </span>
                <span className="text-sm text-gray-500">than last month</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function InvoiceStatsCards() {
  const {
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    totalRevenue,
    isLoading,
    isError,
  } = useGetInvoiceStats();

  // Sample growth percentages (in a real app, these would come from the API)
  // These are just for demonstration purposes
  const revenueGrowth = 15;
  const paidGrowth = 22;

  if (isError) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
        <Card className="bg-gray-50 border-red-100 col-span-4">
          <CardContent className="pt-6">
            <p className="text-center text-red-500">
              Failed to load invoice statistics. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
      {/* First card - Status Overview taking up half the width */}
      <StatusOverviewCard
        created={totalInvoices}
        sent={pendingInvoices}
        paid={paidInvoices}
        isLoading={isLoading}
      />

      {/* Second card - Total Billed */}
      <StatsCard
        title="Total Billed"
        value={formatCurrency(totalRevenue || 0)}
        icon={<FiDollarSign className="h-5 w-5" />}
        growthPercentage={revenueGrowth}
        isLoading={isLoading}
      />

      {/* Third card - Total Paid */}
      <StatsCard
        title="Total Paid"
        value={formatCurrency(
          totalRevenue * 0.7 || 0
        )} /* This is a placeholder, would use actual paid amount from API */
        icon={<FiCreditCard className="h-5 w-5" />}
        growthPercentage={paidGrowth}
        isLoading={isLoading}
      />
    </div>
  );
}
