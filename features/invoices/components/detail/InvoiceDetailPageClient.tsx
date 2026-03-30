"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileX } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useInvoice } from "../../hooks/use-invoice";
import { ActionsToolbar } from "./ActionsToolbar";
import { InvoiceInfoCard } from "./InvoiceInfoCard";
import { PaymentLog } from "./PaymentLog";
import { MarkPaidModal } from "./MarkPaidModal";

function DetailSkeleton() {
  return (
    <div className="space-y-(--s5)">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <div className="flex gap-(--s2)">
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      {/* Two-column skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-(--s5)">
        <div className="lg:col-span-3 space-y-3">
          <Skeleton className="h-[480px] w-full rounded" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[320px] w-full rounded" />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded border p-(--s10) bg-(--surface-base) border-(--border-default)">
      <div className="w-12 h-12 rounded flex items-center justify-center mb-(--s4) bg-(--surface-overlay)">
        <FileX className="h-6 w-6 text-(--ink-300)" />
      </div>
      <h2 className="text-xl font-bold mb-2 text-(--ink-900) font-display tracking-h2">
        Invoice not found
      </h2>
      <p className="text-sm mb-(--s6) text-center max-w-xs text-(--ink-400) font-body">
        This invoice may have been deleted or does not belong to your account.
      </p>
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted border-(--border-strong) text-(--ink-900) font-display text-[13px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </Link>
    </div>
  );
}

export function InvoiceDetailPageClient({ id }: { id: string }) {
  const [markPaidOpen, setMarkPaidOpen] = useState(false);

  const { data: invoice, isPending, isError } = useInvoice(id);

  if (isPending) return <DetailSkeleton />;
  if (isError || !invoice) return <NotFound />;

  return (
    <ScrollArea className="h-[calc(100vh-90px)]">
      <div className="space-y-(--s5) py-4 pr-4">
        {/* Actions toolbar */}
        <div className="rounded border px-(--s5) py-(--s4) bg-(--surface-base) border-(--border-default)">
          <ActionsToolbar
            invoice={invoice}
            onRecordPayment={() => setMarkPaidOpen(true)}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-(--s5)">
          {/* Left: invoice details (~60%) */}
          <div className="lg:col-span-3">
            <InvoiceInfoCard invoice={invoice} />
          </div>

          {/* Right: payment log (~40%) */}
          <div className="lg:col-span-2">
            <PaymentLog
              invoice={invoice}
              onRecordPayment={() => setMarkPaidOpen(true)}
            />
          </div>
        </div>

        {/* Mark paid modal */}
        <MarkPaidModal
          open={markPaidOpen}
          onOpenChange={setMarkPaidOpen}
          invoice={invoice}
        />
      </div>
    </ScrollArea>
  );
}
