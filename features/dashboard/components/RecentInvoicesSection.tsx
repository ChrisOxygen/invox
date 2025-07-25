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
      className={`w-full bg-white border-2 border-blue-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 ${
        className || ""
      }`}
    >
      <div className="p-4 lg:p-6 border-b border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              Recent Invoices
            </h4>
            <p className="text-sm text-gray-600">
              Latest invoice activities and transactions
            </p>
          </div>
          <Button
            asChild
            className="bg-transparent border-2 border-blue-200 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
          >
            <Link href="/app/invoices">View All Invoices</Link>
          </Button>
        </div>
      </div>
      <div className="">
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
