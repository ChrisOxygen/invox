"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardStatsGrid } from "@/features/dashboard/components/DashboardStatsGrid";
import { InvoiceTable } from "@/features/invoice/components/InvoiceTable";
import { FiPlus } from "react-icons/fi";

function InvoicesPage() {
  return (
    <div className="container mx-auto py-6 px-4 lg:px-6">
      <div className="space-y-6">
        {/* Row 1 - Header Section */}
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Invoices
              </h1>
              <p className="text-blue-600/70 text-sm font-medium">
                Manage and track all your invoices
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Link href="/app/invoices/create">
                <FiPlus className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </div>
        </div>

        {/* Row 2 - Stats Cards Section */}
        <div className="w-full">
          <DashboardStatsGrid />
        </div>

        {/* Row 3 - Table Section */}
        <div className="w-full">
          <div className="bg-white/80 backdrop-blur-sm border  border-blue-100 rounded-xl flex flex-col gap-5 p-4 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
              <h3 className="text-lg font-semibold text-blue-700">
                All Invoices
              </h3>
              <p className="text-sm text-blue-600/70">
                View and manage your invoices
              </p>
            </div>
            <InvoiceTable
              showFilters={true}
              showPagination={true}
              showSearch={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicesPage;
