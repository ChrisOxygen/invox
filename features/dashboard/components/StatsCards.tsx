"use client";

import { TrendingUp, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency } from "@/shared/lib/utils";
import type { DashboardStats } from "../hooks/use-dashboard-stats";

interface StatsCardsProps {
  stats: DashboardStats | undefined;
  isPending: boolean;
}

interface CardConfig {
  key: "outstanding" | "paidThisMonth" | "overdue" | "totalInvoices";
  label: string;
  icon: React.ElementType;
  accentColor: string;
  valueColor: string;
  description: string;
  isCount?: boolean;
}

const CARD_CONFIGS: CardConfig[] = [
  {
    key: "outstanding",
    label: "Outstanding",
    icon: TrendingUp,
    accentColor: "var(--blue-600)",
    valueColor: "var(--ink-900)",
    description: "Sent + overdue",
  },
  {
    key: "paidThisMonth",
    label: "Paid This Month",
    icon: CheckCircle2,
    accentColor: "var(--success)",
    valueColor: "var(--ink-900)",
    description: "Collected this month",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: AlertCircle,
    accentColor: "var(--error)",
    valueColor: "var(--error)",
    description: "Past due date",
  },
  {
    key: "totalInvoices",
    label: "Total Invoices",
    icon: FileText,
    accentColor: "var(--ink-300)",
    valueColor: "var(--ink-900)",
    description: "All time",
    isCount: true,
  },
];

interface StatCardProps {
  config: CardConfig;
  value: number;
  isPending: boolean;
  currency: string;
}

function StatCard({ config, value, isPending, currency }: StatCardProps) {
  const Icon = config.icon;

  return (
    <div className="bg-(--surface-base) border border-(--border-default) rounded p-(--s5)">
      <div className="flex items-start justify-between mb-3">
        <p className="[font-family:var(--font-display)] text-[11px] font-semibold text-(--ink-400) tracking-[0.08em] uppercase">
          {config.label}
        </p>
        <Icon
          className="h-4 w-4 shrink-0 opacity-60"
          style={{ color: config.accentColor }}
        />
      </div>

      {isPending ? (
        <Skeleton className="h-8 w-36 mb-2" />
      ) : (
        <p
          className="[font-family:var(--font-mono)] font-medium leading-none tracking-[-0.02em] mb-2"
          style={{
            fontSize: config.isCount ? 36 : 26,
            color: config.valueColor,
          }}
        >
          {config.isCount
            ? value.toLocaleString()
            : formatCurrency(value, currency)}
        </p>
      )}

      <p className="[font-family:var(--font-body)] text-[12px] text-(--ink-300)">
        {config.description}
      </p>
    </div>
  );
}

export function StatsCards({ stats, isPending }: StatsCardsProps) {
  const currency = stats?.currency ?? "NGN";

  const values = {
    outstanding: stats?.totalOutstanding ?? 0,
    paidThisMonth: stats?.totalPaidThisMonth ?? 0,
    overdue: stats?.totalOverdue ?? 0,
    totalInvoices: stats?.totalInvoices ?? 0,
  };

  return (
    <div className="grid gap-[var(--s4)] grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      {CARD_CONFIGS.map((config) => (
        <StatCard
          key={config.key}
          config={config}
          value={values[config.key]}
          isPending={isPending}
          currency={currency}
        />
      ))}
    </div>
  );
}
