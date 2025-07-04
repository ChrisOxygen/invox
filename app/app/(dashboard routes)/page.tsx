"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientForm } from "@/features/clients/components/ClientForm";
import { FiPlus, FiFileText } from "react-icons/fi";
import { generateTimeBasedGreeting } from "@/utils";
import { useUser } from "@/hooks/useUser";
import InBoxLoader from "@/components/InBoxLoader";

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
    <div className="h-full grid grid-rows-[100px_200px_1fr]">
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
