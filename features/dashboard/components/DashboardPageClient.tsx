"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { buttonVariants } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { StatsCards } from "./StatsCards";
import { DashboardRecentInvoices } from "./DashboardRecentInvoices";

const RevenueBarChart = dynamic(
  () =>
    import("./RevenueBarChart").then((m) => ({ default: m.RevenueBarChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-55 w-full" />,
  },
);

const StatusDonutChart = dynamic(
  () =>
    import("./StatusDonutChart").then((m) => ({ default: m.StatusDonutChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-55 w-full" />,
  },
);

function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center gap-[var(--s4)] py-[var(--s20)] px-[var(--s4)] text-center">
      <div className="w-16 h-16 rounded bg-(--blue-50) flex items-center justify-center">
        <FileText className="h-7 w-7 text-(--blue-600)" />
      </div>
      <div>
        <h2 className="font-display text-[20px] font-bold text-(--ink-900) tracking-[-0.02em] mb-[6px]">
          Create your first invoice
        </h2>
        <p className="font-body text-[14px] text-(--ink-400) max-w-[340px]">
          Start billing clients and tracking payments. Your dashboard will come
          alive once you create your first invoice.
        </p>
      </div>
      <Link
        href="/invoices/new"
        className={`${buttonVariants({ variant: "default" })} mt-2`}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Invoice
      </Link>
    </div>
  );
}

export function DashboardPageClient() {
  const { data: stats, isPending } = useDashboardStats();

  const isEmpty = !isPending && (stats?.totalInvoices ?? 0) === 0;

  return (
    <ScrollArea className="h-[calc(100vh-90px)]">
      <div className="flex flex-col gap-(--s6) py-5 pr-4">
        {/* Page header */}

        {/* Stats cards */}
        <StatsCards stats={stats} isPending={isPending} />

        {/* Empty state */}
        {isEmpty ? (
          <div className="bg-(--surface-base) border border-(--border-default) rounded">
            <EmptyDashboard />
          </div>
        ) : (
          <>
            {/* Charts row */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
              {/* Revenue chart */}
              <div className="bg-(--surface-base) border border-(--border-default) rounded p-(--s5)">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display text-[13px] font-bold text-(--ink-700) tracking-[-0.01em]">
                    Revenue — Last 6 Months
                  </p>
                </div>
                {isPending ? (
                  <Skeleton className="h-55 w-full" />
                ) : (
                  <RevenueBarChart
                    data={stats?.monthlyRevenue ?? []}
                    currency={stats?.currency ?? "NGN"}
                  />
                )}
              </div>

              {/* Status distribution */}
              <div className="bg-(--surface-base) border border-(--border-default) rounded p-(--s5)">
                <p className="font-display text-[13px] font-bold text-(--ink-700) tracking-[-0.01em] mb-4">
                  Invoice Status
                </p>
                {isPending ? (
                  <Skeleton className="h-55 w-full" />
                ) : (
                  <StatusDonutChart data={stats?.statusCounts ?? []} />
                )}
              </div>
            </div>

            {/* Recent invoices */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-display text-[13px] font-bold text-(--ink-700) tracking-[-0.01em]">
                  Recent Invoices
                </p>
                <Link
                  href="/invoices"
                  className="font-display text-[12px] font-semibold text-(--blue-600) no-underline tracking-[-0.01em]"
                >
                  View all →
                </Link>
              </div>
              <DashboardRecentInvoices
                invoices={stats?.recentInvoices ?? []}
                isPending={isPending}
              />
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
