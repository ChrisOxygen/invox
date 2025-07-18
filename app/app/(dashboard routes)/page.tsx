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
    <div className="h-full grid gap-6 grid-rows-[60px_170px_360px_1fr]">
      <div className=" flex items-end justify-between w-full">
        <h3 className="text-2xl sm:text-3xl font-bold text-black">{`${generateTimeBasedGreeting()}, ${
          user?.name?.split(" ")[0] || "Guest"
        }`}</h3>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add Client Button */}
          <Button
            onClick={handleAddClient}
            className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm font-medium"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Client</span>
            <span className="sm:hidden">Add</span>
          </Button>

          {/* Create New Invoice Button */}
          <Button
            asChild
            className="bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm font-medium"
          >
            <Link href="/app/invoices/create">
              <FiFileText className="w-4 h-4" />
              <span className="hidden sm:inline">Create New Invoice</span>
              <span className="sm:hidden">Invoice</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="border w-full h-full flex items-center rounded-xl justify-center">
        <div className=" flex  pl-8 flex-col gap-3 flex-1 after:content-[''] last:after:hidden  relative after:absolute after:h-[93%] after:w-[1px] after:bg-gray-200 after:right-0 after:top-1/2 after:-translate-y-1/2 ">
          <div className="flex items-center gap-1">
            <div className=" flex items-center gap-1">
              <span className="">
                <FaArrowTrendUp />
              </span>
              <span className="">+17%</span>
            </div>
            <span className="">/month</span>
          </div>
          <span className=" font-semibold text-3xl">$19,897</span>
          <span className="">Total Invoice</span>
        </div>
        <div className=" flex flex-col gap-3 flex-1 after:content-[''] last:after:hidden relative after:absolute after:h-[93%] after:w-[1px] after:bg-gray-200 after:right-0 pl-8 after:top-1/2 after:-translate-y-1/2 ">
          <div className="flex items-center gap-1">
            <div className=" flex items-center gap-1">
              <span className="">
                <FaArrowTrendUp />
              </span>
              <span className="">+17%</span>
            </div>
            <span className="">/month</span>
          </div>
          <span className=" font-semibold text-3xl">$19,897</span>
          <span className="">Total Invoice</span>
        </div>
        <div className=" flex flex-col gap-3 flex-1 after:content-[''] last:after:hidden relative after:absolute after:h-[93%] after:w-[1px] after:bg-gray-200 after:right-0 pl-8 after:top-1/2 after:-translate-y-1/2 ">
          <div className="flex items-center gap-1">
            <div className=" flex items-center gap-1">
              <span className="">
                <FaArrowTrendUp />
              </span>
              <span className="">+17%</span>
            </div>
            <span className="">/month</span>
          </div>
          <span className=" font-semibold text-3xl">$19,897</span>
          <span className="">Total Invoice</span>
        </div>
        <div className=" flex flex-col gap-3 flex-1 after:content-[''] last:after:hidden relative after:absolute after:h-[93%] after:w-[1px] after:bg-gray-200 after:right-0 pl-8 after:top-1/2 after:-translate-y-1/2 ">
          <div className="flex items-center gap-1">
            <div className=" flex items-center gap-1">
              <span className="">
                <FaArrowTrendUp />
              </span>
              <span className="">+17%</span>
            </div>
            <span className="">/month</span>
          </div>
          <span className=" font-semibold text-3xl">$19,897</span>
          <span className="">Total Invoice</span>
        </div>
      </div>
      <div className=" w-full h-full flex gap-5">
        <div className="flex-2/3 flex">
          <InvoicesBarChart />
        </div>
        <div className="flex-1/3">
          <InvoiceRadialChart />
        </div>
      </div>
      <div className=" flex w-full ">
        <ScrollArea className="w-full">
          <InvoiceTable
            showFilters={false}
            showPagination={false}
            showSearch={false}
          />
        </ScrollArea>
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
