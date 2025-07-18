"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InvoiceStatsCards } from "@/features/invoice/components/InvoiceStatsCards";
import { InvoiceTable } from "@/features/invoice/components/InvoiceTable";
import { FiPlus } from "react-icons/fi";

function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <Button asChild>
          <Link href="/app/invoices/create">
            <FiPlus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      {/* Stats Cards Row */}
      <InvoiceStatsCards />

      {/* Table Row */}
      <div className="bg-white  ">
        <InvoiceTable
          showFilters={false}
          showPagination={false}
          showSearch={false}
        />
      </div>
    </div>
  );
}

export default InvoicesPage;
