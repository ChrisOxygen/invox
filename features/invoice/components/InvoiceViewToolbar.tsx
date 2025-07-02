"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FiEdit2,
  FiMail,
  FiPrinter,
  FiCheck,
  FiCreditCard,
} from "react-icons/fi";

interface InvoiceViewToolbarProps {
  invoiceId: string;
}

export function InvoiceViewToolbar({ invoiceId }: InvoiceViewToolbarProps) {
  const router = useRouter();

  const handleEditInvoice = () => {
    router.push(`/app/invoices/edit/${invoiceId}`);
  };

  const handleSendEmail = () => {
    // Placeholder function for sending email
    console.log("Send email functionality will be implemented here");
  };

  const handlePrintPDF = () => {
    // Placeholder function for PDF/Print
    console.log("PDF/Print functionality will be implemented here");
  };

  const handleMarkAsPaid = () => {
    // Placeholder function for marking as paid
    console.log("Mark as paid functionality will be implemented here");
  };

  const handleRecordPayment = () => {
    // Placeholder function for recording payment
    console.log("Record payment functionality will be implemented here");
  };

  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={handleEditInvoice}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:border-black hover:bg-gray-50"
        >
          <FiEdit2 className="h-4 w-4" />
          Edit Invoice
        </Button>

        <Button
          onClick={handleSendEmail}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:border-black hover:bg-gray-50"
        >
          <FiMail className="h-4 w-4" />
          Send Email
        </Button>

        <Button
          onClick={handlePrintPDF}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:border-black hover:bg-gray-50"
        >
          <FiPrinter className="h-4 w-4" />
          PDF/Print
        </Button>

        <Button
          onClick={handleMarkAsPaid}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:border-black hover:bg-gray-50"
        >
          <FiCheck className="h-4 w-4" />
          Mark as Paid
        </Button>

        <Button
          onClick={handleRecordPayment}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:border-black hover:bg-gray-50"
        >
          <FiCreditCard className="h-4 w-4" />
          Record Payment
        </Button>
      </div>
    </div>
  );
}
