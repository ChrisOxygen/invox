"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useInvoiceForm } from "../context/InvoiceFormProvider";
import { InvoiceDisplay } from "./InvoiceDisplay";
import { Skeleton } from "@/components/ui/skeleton";

export function InvoiceViewer() {
  const params = useParams();
  const { state, dispatch } = useInvoiceForm();
  const invoiceId = params?.invoiceId as string;

  useEffect(() => {
    if (invoiceId && !state.invoiceId) {
      // Set the form mode to edit and invoice ID
      dispatch({
        type: "SET_FORM_MODE",
        payload: "edit",
      });

      dispatch({
        type: "SET_INVOICE_ID",
        payload: invoiceId,
      });
    }
  }, [invoiceId, state.invoiceId, dispatch]);

  // Show loading state while invoice data is being loaded
  if (!state.invoiceId || state.invoiceId !== invoiceId) {
    return (
      <div className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return <InvoiceDisplay />;
}
