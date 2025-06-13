"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceItemsForm } from "./InvoiceItemsForm";
import {
  invoiceItemsFormSchema,
  InvoiceItemsFormInput,
} from "@/dataSchemas/invoice";

export function InvoiceItemsFormDemo() {
  const form = useForm<InvoiceItemsFormInput>({
    resolver: zodResolver(invoiceItemsFormSchema),
    defaultValues: {
      items: [],
    },
  });
  const { handleSubmit } = form;

  const onSubmit = (data: InvoiceItemsFormInput) => {
    console.log("Invoice Items Form Data:", data);

    // Calculate totals
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    console.log("Subtotal:", subtotal.toFixed(2));
  };
  return (
    <div className="">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <InvoiceItemsForm currency="EUR" />
        </form>
      </FormProvider>
    </div>
  );
}
