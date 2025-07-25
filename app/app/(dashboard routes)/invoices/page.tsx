"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardStatsGrid } from "@/features/dashboard/components/DashboardStatsGrid";
import { InvoiceTable } from "@/features/invoice/components/InvoiceTable";
import { FiPlus } from "react-icons/fi";

function InvoicesPage() {
  return (
    <div className="container mx-auto h-full flex flex-col py-6 px-4 lg:px-6">
      {/* Header Section */}
      <div className="w-full flex-shrink-0 mb-6">
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

      {/* Stats Cards Section */}
      <div className="w-full flex-shrink-0 mb-6">
        <DashboardStatsGrid />
      </div>

      {/* Table Section - Takes remaining height */}
      <div className="w-full flex-1 flex flex-col min-h-0">
        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl flex flex-col h-full shadow-sm overflow-hidden">
          <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 flex-shrink-0">
            <h3 className="text-lg font-semibold text-blue-700">
              All Invoices
            </h3>
            <p className="text-sm text-blue-600/70">
              View and manage your invoices
            </p>
          </div>
          <div className="flex-1 flex flex-col min-h-0 p-4">
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
