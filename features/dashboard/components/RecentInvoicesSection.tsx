/**
 * Recent Invoices Section Component
 * Displays a table of recent invoices with filters and actions
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvoiceTable } from "@/features/invoice/components/InvoiceTable";

interface RecentInvoicesSectionProps {
  className?: string;
}

export function RecentInvoicesSection({
  className,
}: RecentInvoicesSectionProps) {
  return (
    <div
      className={`w-full bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl shadow-sm overflow-hidden ${
        className || ""
      }`}
    >
      <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              Recent Invoices
            </h3>
            <p className="text-sm text-blue-600/70">
              Latest invoice activities and transactions
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Link href="/app/invoices">View All Invoices</Link>
          </Button>
        </div>
      </div>
      <div className="p-4">
        <ScrollArea className="w-full max-h-96">
          <InvoiceTable
            showFilters={false}
            showPagination={false}
            showSearch={false}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
