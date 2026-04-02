"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Eye } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn, formatCurrency } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button";
import { InvoiceStatusBadge } from "@/features/invoices/components/list/InvoiceStatusBadge";
import type { RecentInvoice } from "../server/_get-dashboard-stats";

interface DashboardRecentInvoicesProps {
  invoices: RecentInvoice[];
  isPending: boolean;
}

function formatDisplayDate(iso: string): string {
  try {
    return format(parseISO(iso), "d MMM yyyy");
  } catch {
    return "—";
  }
}

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-(--surface-base) border border-(--border-default) rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center justify-between pt-1 border-t border-(--border-default)">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-8" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function InvoiceCard({ invoice }: { invoice: RecentInvoice }) {
  const isOverdue = invoice.status === "OVERDUE";

  return (
    <div className="bg-(--surface-base) border border-(--border-default) rounded-xl p-4 space-y-3">
      {/* Top: invoice # + status */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/invoices/${invoice.id}`}
          className="font-mono text-[13px] font-medium text-(--blue-600) no-underline shrink-0"
        >
          {invoice.invoiceNumber}
        </Link>
        <InvoiceStatusBadge status={invoice.status} size="sm" />
      </div>

      {/* Client */}
      <div>
        <p className="font-display text-[15px] font-semibold text-(--ink-900) tracking-tight leading-[1.3]">
          {invoice.client.name}
        </p>
        {invoice.client.company && (
          <p className="font-body text-[12px] text-(--ink-400) mt-0.5 leading-[1.2]">
            {invoice.client.company}
          </p>
        )}
      </div>

      {/* Amount */}
      <p
        className="font-mono text-[22px] font-medium text-(--ink-900)"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {formatCurrency(invoice.total, invoice.currency)}
      </p>

      {/* Footer: due date + view */}
      <div className="flex items-end justify-between pt-3 border-t border-(--border-default)">
        <div>
          <p className="font-display text-[10px] font-semibold text-(--ink-300) uppercase tracking-widest mb-0.5">
            Due
          </p>
          <span
            className={`font-body text-[13px] ${isOverdue ? "text-(--error)" : "text-(--ink-400)"}`}
          >
            {formatDisplayDate(invoice.dueDate)}
          </span>
        </div>
        <Link
          href={`/invoices/${invoice.id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "font-display font-semibold text-[12px] border-(--border-default) text-(--ink-700) rounded h-8 shrink-0 no-underline",
          )}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          View
        </Link>
      </div>
    </div>
  );
}

export function DashboardRecentInvoices({
  invoices,
  isPending,
}: DashboardRecentInvoicesProps) {
  if (isPending) return <SkeletonCards />;

  if (invoices.length === 0) {
    return (
      <div className="bg-(--surface-base) border border-(--border-default) rounded-xl py-10 text-center">
        <p className="font-body text-[13px] text-(--ink-300)">No invoices yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
}
