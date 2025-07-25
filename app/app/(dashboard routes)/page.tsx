"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientForm } from "@/features/clients/components/ClientForm";
import { FiPlus, FiFileText } from "react-icons/fi";
import { generateTimeBasedGreeting } from "@/utils";
import { useUser } from "@/hooks/useUser";
import InBoxLoader from "@/components/InBoxLoader";

import { FaArrowTrendUp } from "react-icons/fa6";
import InvoicesBarChart from "@/features/dashboard/components/InvoicesBarChart";
import InvoiceRadialChart from "@/features/dashboard/components/InvoiceRadialChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvoiceTable } from "@/features/invoice/components/InvoiceTable";

function Dashboard() {
  const [showClientForm, setShowClientForm] = useState(false);

  const { user, isPending: gettingUser } = useUser();

  const handleAddClient = () => {
    setShowClientForm(true);
  };

  const handleCloseClientForm = () => {
    setShowClientForm(false);
  };

  if (gettingUser) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  return (
    <div className="h-full grid gap-6 grid-rows-[auto_auto_1fr_1fr] lg:grid-rows-[80px_140px_380px_1fr]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full gap-4 sm:gap-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {`${generateTimeBasedGreeting()}, ${
              user?.name?.split(" ")[0] || "Guest"
            }`}
          </h3>
          <p className="text-gray-600 text-sm">
            Manage your invoices and track your business growth
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Add Client Button - Primary Gradient */}
          <Button
            onClick={handleAddClient}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2.5 px-5 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Client</span>
            <span className="sm:hidden">Add Client</span>
          </Button>

          {/* Create New Invoice Button - Secondary Outline */}
          <Button
            asChild
            className="flex-1 sm:flex-none bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white font-medium py-2.5 px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Link href="/app/invoices/create">
              <FiFileText className="w-4 h-4" />
              <span className="hidden sm:inline">New Invoice</span>
              <span className="sm:hidden">Invoice</span>
            </Link>
          </Button>
        </div>
      </div>
      {/* Stats Cards Section */}
      <div className="w-full h-full grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Revenue Card */}
        <div className="group bg-white border-2 border-blue-100 hover:border-blue-300 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <FaArrowTrendUp className="w-3 h-3" />
                <span>+17%</span>
              </div>
              <span className="text-gray-500 text-xs">/month</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-2xl lg:text-3xl text-gray-900">
                $19,897
              </span>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Paid Invoices Card */}
        <div className="group bg-white border-2 border-blue-100 hover:border-blue-300 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <FaArrowTrendUp className="w-3 h-3" />
                <span>+12%</span>
              </div>
              <span className="text-gray-500 text-xs">/month</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-2xl lg:text-3xl text-gray-900">
                47
              </span>
              <p className="text-gray-600 text-sm font-medium">Paid Invoices</p>
            </div>
          </div>
        </div>

        {/* Pending Invoices Card */}
        <div className="group bg-white border-2 border-blue-100 hover:border-blue-300 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                <FaArrowTrendUp className="w-3 h-3" />
                <span>+8%</span>
              </div>
              <span className="text-gray-500 text-xs">/month</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-2xl lg:text-3xl text-gray-900">
                12
              </span>
              <p className="text-gray-600 text-sm font-medium">
                Pending Invoices
              </p>
            </div>
          </div>
        </div>

        {/* Total Clients Card */}
        <div className="group bg-white border-2 border-blue-100 hover:border-blue-300 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                <FaArrowTrendUp className="w-3 h-3" />
                <span>+22%</span>
              </div>
              <span className="text-gray-500 text-xs">/month</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-2xl lg:text-3xl text-gray-900">
                38
              </span>
              <p className="text-gray-600 text-sm font-medium">Total Clients</p>
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="w-full h-full flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Bar Chart - Main Chart */}
        <div className="flex-1 lg:flex-[2] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 grid grid-rows-[auto_1fr] gap-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              Revenue Analytics
            </h4>
            <p className="text-sm text-gray-600">
              Monthly revenue trends and performance
            </p>
          </div>
          <div className="min-h-0">
            <InvoicesBarChart />
          </div>
        </div>

        {/* Radial Chart - Side Chart */}
        <div className="flex-1 lg:flex-[1] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-200 grid grid-rows-[auto_1fr] gap-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              Invoice Status
            </h4>
            <p className="text-sm text-gray-600">Distribution overview</p>
          </div>
          <div className="min-h-0 flex items-center justify-center">
            <InvoiceRadialChart />
          </div>
        </div>
      </div>
      {/* Recent Invoices Table */}
      <div className="w-full bg-white border-2 border-blue-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200">
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
        <div className="p-2 lg:p-4">
          <ScrollArea className="w-full max-h-96">
            <InvoiceTable
              showFilters={false}
              showPagination={false}
              showSearch={false}
            />
          </ScrollArea>
        </div>
      </div>

      {/* Client Form Dialog */}
      <ClientForm
        open={showClientForm}
        onOpenChange={setShowClientForm}
        mode="create"
        onSuccess={handleCloseClientForm}
      />
    </div>
  );
}

export default Dashboard;
