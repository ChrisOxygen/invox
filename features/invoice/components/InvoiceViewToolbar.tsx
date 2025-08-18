"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FiEdit2, FiMail, FiCheck, FiCreditCard } from "react-icons/fi";

import { PDFDownloadLink } from "@react-pdf/renderer";
import Link from "next/link";
import ReactPDFTemplate1 from "./pdf/reactPDFTemplate1";
import { useInvoiceWithRelations } from "../hooks/useInvoiceWithRelations";
// import { toast } from "sonner"; // Uncomment when available

interface InvoiceViewToolbarProps {
  invoiceId: string;
}

export function InvoiceViewToolbar({ invoiceId }: InvoiceViewToolbarProps) {
  const {
    invoice,
    user: userAndBusiness,
    client,
    paymentAccount,
    isPending: gettingInvoice,
  } = useInvoiceWithRelations(invoiceId);

  const handleSendEmail = () => {
    // Placeholder function for sending email
    console.log("Send email functionality will be implemented here");
  };

  const handleMarkAsPaid = () => {
    // Placeholder function for marking as paid
    console.log("Mark as paid functionality will be implemented here");
  };

  const handleRecordPayment = () => {
    // Placeholder function for recording payment
    console.log("Record payment functionality will be implemented here");
  };

  const isLoading = gettingInvoice;

  if (isLoading) {
    return (
      <div className="border-b border-blue-200 bg-gradient-to-r from-white via-blue-50 to-cyan-50 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Skeleton className="h-10 w-32 bg-blue-200" />
          <Skeleton className="h-10 w-28 bg-blue-200" />
          <Skeleton className="h-10 w-36 bg-blue-200" />
          <Skeleton className="h-10 w-32 bg-blue-200" />
          <Skeleton className="h-10 w-36 bg-blue-200" />
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="border-b border-blue-200 bg-gradient-to-r from-white via-blue-50 to-cyan-50 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          asChild
          className="flex items-center gap-2 border-blue-300 text-blue-700 hover:border-blue-500 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 shadow-sm"
        >
          <Link href={`/app/invoices/edit/${invoiceId}`}>
            <FiEdit2 className="h-4 w-4" />
            Edit Invoice
          </Link>
        </Button>

        <Button
          onClick={handleSendEmail}
          variant="outline"
          className="flex items-center gap-2 border-cyan-300 text-cyan-700 hover:border-cyan-500 hover:bg-cyan-100 hover:text-cyan-800 transition-all duration-200 shadow-sm"
        >
          <FiMail className="h-4 w-4" />
          Send Email
        </Button>

        <Button
          asChild
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <PDFDownloadLink
            document={
              <ReactPDFTemplate1
                invoice={invoice}
                userAndBusiness={userAndBusiness}
                client={client}
                paymentAccount={paymentAccount}
                theme={"classic"} // Assuming 'classic' is the default theme
              />
            }
            fileName={
              invoice.invoiceNumber
                ? `invoice-${invoice.invoiceNumber}.pdf`
                : "invoice.pdf"
            }
          >
            {({ loading }) => (loading ? "Loading..." : "Download PDF")}
          </PDFDownloadLink>
        </Button>

        <Button
          onClick={handleMarkAsPaid}
          variant="outline"
          className="flex items-center gap-2 border-green-400 text-green-700 hover:border-green-500 hover:bg-green-50 hover:text-green-800 transition-all duration-200 shadow-sm"
        >
          <FiCheck className="h-4 w-4" />
          Mark as Paid
        </Button>

        <Button
          onClick={handleRecordPayment}
          variant="outline"
          className="flex items-center gap-2 border-blue-300 text-blue-700 hover:border-blue-500 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 shadow-sm"
        >
          <FiCreditCard className="h-4 w-4" />
          Record Payment
        </Button>
      </div>
    </div>
  );
}
