"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IoChevronDown,
  IoDownloadOutline,
  IoExitOutline,
  IoSaveOutline,
  IoSend,
} from "react-icons/io5";
import { useInvoiceForm } from "../index";
import { useCreateInvoice, useUpdateInvoice } from "../hooks";
import { CreateInvoiceInput, UpdateInvoiceInput } from "@/dataSchemas/invoice";
import { showErrorToast } from "@/components/toast-templates";

type SaveAction = "draft" | "send" | "download" | "exit";

export function InvoiceSaveActions() {
  const router = useRouter();
  const { state, getValidationErrors, setValidationErrors } = useInvoiceForm();
  const [activeAction, setActiveAction] = useState<SaveAction | null>(null);

  const { mutate: createInvoice, isPending: isCreating } = useCreateInvoice({
    onSuccess: () => {
      setActiveAction(null);

      switch (activeAction) {
        case "draft":
          router.push("/app/invoices");
          break;
        case "send":
          router.push("/app/dashboard");
          break;
        case "download":
          console.log("downloaded");
          router.push("/app/invoices");
          break;
        case "exit":
          router.push("/app/invoices");
          break;
        default:
          break;
      }
    },
    onError: (error) => {
      console.error("Failed to create invoice:", error);
      setActiveAction(null);
    },
  });

  const { mutate: updateInvoice, isPending: isUpdating } = useUpdateInvoice({
    onSuccess: () => {
      setActiveAction(null);

      switch (activeAction) {
        case "draft":
          router.push("/app/invoices");
          break;
        case "send":
          router.push("/app/dashboard");
          break;
        case "download":
          console.log("downloaded");
          router.push("/app/invoices");
          break;
        case "exit":
          router.push("/app/invoices");
          break;
        default:
          break;
      }
    },
    onError: (error) => {
      console.error("Failed to update invoice:", error);
      setActiveAction(null);
    },
  });

  const isLoading = isCreating || isUpdating;

  const prepareInvoiceData = (status: "DRAFT" | "SENT") => {
    const invoiceItems = (state.invoiceItems || []).map((item) => ({
      description: item.description || "",
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }));

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = state.tax || 0;
    const discountAmount = state.discount || 0;
    const total = Math.max(0, subtotal - taxAmount - discountAmount);

    return {
      invoiceItems,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      status,
    };
  };

  const handleSaveAsDraft = () => {
    if (!state.client || !state.businessDetails || !state.paymentDueDate) {
      showErrorToast(
        "error",
        "Please fill in all required fields before saving."
      );
      return;
    }

    const validationResult = getValidationErrors();
    if (!validationResult.isValid) {
      // push errors to provider
      console.log("Validation errors:", validationResult.errors);
      setValidationErrors(validationResult);
      showErrorToast(
        "error",
        "Please fix the validation errors before saving."
      );
      return;
    }

    console.log("Saving invoice as draft...", validationResult);

    // setActiveAction("draft");
    // const { invoiceItems, subtotal, taxAmount, discountAmount, total } =
    //   prepareInvoiceData("DRAFT");

    // if (state.invoiceId) {
    //   // Update existing invoice
    //   const updateData: UpdateInvoiceInput = {
    //     invoiceId: state.invoiceId,
    //     clientId: state.client.id,
    //     invoiceDate: state.invoiceDate || new Date(),
    //     paymentDueDate: state.paymentDueDate,
    //     items: invoiceItems,
    //     subtotal,
    //     taxes: taxAmount,
    //     discount: discountAmount,
    //     total,
    //     acceptedPaymentMethods:
    //       state.paymentAccount?.gatewayType || "bank-transfer",
    //     customNote: state.customNote,
    //     lateFeeText: state.lateFeeText,
    //   };
    //   updateInvoice(updateData);
    // } else {
    //   // Create new invoice
    //   const createData: CreateInvoiceInput = {
    //     clientId: state.client.id,
    //     invoiceNumber: state.invoiceNumber,
    //     invoiceDate: state.invoiceDate || new Date(),
    //     paymentDueDate: state.paymentDueDate,
    //     items: invoiceItems,
    //     subtotal,
    //     taxes: taxAmount,
    //     discount: discountAmount,
    //     total,
    //     acceptedPaymentMethods:
    //       state.paymentAccount?.gatewayType || "bank-transfer",
    //     customNote: state.customNote,
    //     lateFeeText: state.lateFeeText,
    //   };
    //   createInvoice(createData);
    // }
  };

  const handleSaveAndSend = () => {
    if (!state.client || !state.businessDetails || !state.paymentDueDate) {
      console.error("Missing required fields");
      return;
    }

    setActiveAction("send");
    const { invoiceItems, subtotal, taxAmount, discountAmount, total } =
      prepareInvoiceData("SENT");

    if (state.invoiceId) {
      // Update existing invoice
      const updateData: UpdateInvoiceInput = {
        invoiceId: state.invoiceId,
        clientId: state.client.id,
        invoiceDate: state.invoiceDate || new Date(),
        paymentDueDate: state.paymentDueDate,
        items: invoiceItems,
        subtotal,
        taxes: taxAmount,
        discount: discountAmount,
        total,
        acceptedPaymentMethods:
          state.paymentAccount?.gatewayType || "bank-transfer",
        customNote: state.customNote,
        lateFeeText: state.lateFeeText,
      };
      updateInvoice(updateData);
    } else {
      // Create new invoice
      const createData: CreateInvoiceInput = {
        clientId: state.client.id,
        invoiceNumber: state.invoiceNumber,
        invoiceDate: state.invoiceDate || new Date(),
        paymentDueDate: state.paymentDueDate,
        items: invoiceItems,
        subtotal,
        taxes: taxAmount,
        discount: discountAmount,
        total,
        acceptedPaymentMethods:
          state.paymentAccount?.gatewayType || "bank-transfer",
        customNote: state.customNote,
        lateFeeText: state.lateFeeText,
      };
      createInvoice(createData);
    }
  };

  const handleSaveAndDownload = () => {
    if (!state.client || !state.businessDetails || !state.paymentDueDate) {
      console.error("Missing required fields");
      return;
    }

    setActiveAction("download");
    const { invoiceItems, subtotal, taxAmount, discountAmount, total } =
      prepareInvoiceData("SENT");

    if (state.invoiceId) {
      // Update existing invoice
      const updateData: UpdateInvoiceInput = {
        invoiceId: state.invoiceId,
        clientId: state.client.id,
        invoiceDate: state.invoiceDate || new Date(),
        paymentDueDate: state.paymentDueDate,
        items: invoiceItems,
        subtotal,
        taxes: taxAmount,
        discount: discountAmount,
        total,
        acceptedPaymentMethods:
          state.paymentAccount?.gatewayType || "bank-transfer",
        customNote: state.customNote,
        lateFeeText: state.lateFeeText,
      };
      updateInvoice(updateData);
    } else {
      // Create new invoice
      const createData: CreateInvoiceInput = {
        clientId: state.client.id,
        invoiceNumber: state.invoiceNumber,
        invoiceDate: state.invoiceDate || new Date(),
        paymentDueDate: state.paymentDueDate,
        items: invoiceItems,
        subtotal,
        taxes: taxAmount,
        discount: discountAmount,
        total,
        acceptedPaymentMethods:
          state.paymentAccount?.gatewayType || "bank-transfer",
        customNote: state.customNote,
        lateFeeText: state.lateFeeText,
      };
      createInvoice(createData);
    }
  };

  const handleSaveAndExit = () => {
    if (!state.client || !state.businessDetails || !state.paymentDueDate) {
      console.error("Missing required fields");
      return;
    }

    setActiveAction("exit");
    const currentStatus = state.invoiceStatus || "DRAFT";
    const { invoiceItems, subtotal, taxAmount, discountAmount, total } =
      prepareInvoiceData(currentStatus === "DRAFT" ? "DRAFT" : "SENT");

    if (state.invoiceId) {
      // Update existing invoice
      const updateData: UpdateInvoiceInput = {
        invoiceId: state.invoiceId,
        clientId: state.client.id,
        invoiceDate: state.invoiceDate || new Date(),
        paymentDueDate: state.paymentDueDate,
        items: invoiceItems,
        subtotal,
        taxes: taxAmount,
        discount: discountAmount,
        total,
        acceptedPaymentMethods:
          state.paymentAccount?.gatewayType || "bank-transfer",
        customNote: state.customNote,
        lateFeeText: state.lateFeeText,
      };
      updateInvoice(updateData);
    } else {
      // Create new invoice with draft status
      const createData: CreateInvoiceInput = {
        clientId: state.client.id,
        invoiceNumber: state.invoiceNumber,
        invoiceDate: state.invoiceDate || new Date(),
        paymentDueDate: state.paymentDueDate,
        items: invoiceItems,
        subtotal,
        taxes: taxAmount,
        discount: discountAmount,
        total,
        acceptedPaymentMethods:
          state.paymentAccount?.gatewayType || "bank-transfer",
        customNote: state.customNote,
        lateFeeText: state.lateFeeText,
      };
      createInvoice(createData);
    }
  };

  const isButtonDisabled = (action: SaveAction) => {
    return isLoading && activeAction !== action;
  };

  const isButtonLoading = (action: SaveAction) => {
    return isLoading && activeAction === action;
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Save as Draft Button */}
      <Button
        variant="outline"
        onClick={handleSaveAsDraft}
        disabled={isButtonDisabled("draft")}
        className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all duration-200 transform hover:scale-105 min-w-0"
      >
        {isButtonLoading("draft") ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <IoSaveOutline className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="hidden sm:inline">Save as Draft</span>
        <span className="sm:hidden">Draft</span>
      </Button>

      {/* Save & Send Button with Dropdown */}
      <div className="flex">
        {/* Primary Save & Send Button */}
        <Button
          onClick={handleSaveAndSend}
          disabled={isButtonDisabled("send")}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-r-none min-w-0"
        >
          {isButtonLoading("send") ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoSend className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="hidden sm:inline">Save & Send</span>
          <span className="sm:hidden">Send</span>
        </Button>

        {/* Dropdown Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={isLoading}
              className="px-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-l-none border-l border-blue-700"
            >
              <IoChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white border border-gray-200"
          >
            <DropdownMenuItem
              onClick={handleSaveAndDownload}
              disabled={isLoading}
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {isButtonLoading("download") ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoDownloadOutline className="w-4 h-4" />
              )}
              Save and Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSaveAndExit}
              disabled={isLoading}
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {isButtonLoading("exit") ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoExitOutline className="w-4 h-4" />
              )}
              Save and Exit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
