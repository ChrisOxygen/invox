/**
 * Dashboard Header Component
 * Contains greeting, description, and action buttons
 */

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientForm } from "@/features/clients/components/ClientForm";
import { FiPlus, FiFileText } from "react-icons/fi";
import { generateTimeBasedGreeting } from "@/utils";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const [showClientForm, setShowClientForm] = useState(false);

  const handleAddClient = () => {
    setShowClientForm(true);
  };

  const handleCloseClientForm = () => {
    setShowClientForm(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full gap-4 sm:gap-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {`${generateTimeBasedGreeting()}, ${
              userName?.split(" ")[0] || "Guest"
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

      {/* Client Form Dialog */}
      <ClientForm
        open={showClientForm}
        onOpenChange={setShowClientForm}
        mode="create"
        onSuccess={handleCloseClientForm}
      />
    </>
  );
}
