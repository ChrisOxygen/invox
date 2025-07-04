"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FiEdit2, FiMail, FiCheck, FiCreditCard } from "react-icons/fi";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./pdf/InvoicePDF";
import { useGetInvoiceById } from "../hooks/useGetInvoiceById";
import Link from "next/link";
// import { toast } from "sonner"; // Uncomment when available

interface InvoiceViewToolbarProps {
  invoiceId: string;
}

export function InvoiceViewToolbar({ invoiceId }: InvoiceViewToolbarProps) {
  const { invoice, isPending: gettingInvoice } = useGetInvoiceById(invoiceId);

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
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          asChild
          className="flex items-center gap-2 border-gray-300 hover:border-black hover:bg-gray-50"
        >
          <Link href={`/app/invoices/edit/${invoiceId}`}>
            <FiEdit2 className="h-4 w-4" />
            Edit Invoice
          </Link>
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
          asChild
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:border-black hover:bg-gray-50"
        >
          <PDFDownloadLink
            document={<InvoicePDF invoiceData={invoice} />}
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
