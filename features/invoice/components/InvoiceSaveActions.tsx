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
import {
  ZCreateInvoiceInput,
  ZUpdateInvoiceInput,
} from "@/features/invoice/validation/invoiceSchemas";
import { showErrorToast, showSuccessToast } from "@/components/toast-templates";
import { InvoiceStatus } from "@prisma/client";

type SaveAction = "draft" | "send" | "download" | "exit";

export function InvoiceSaveActions() {
  const router = useRouter();
  const { state, getValidationErrors, setValidationErrors } = useInvoiceForm();
  const [activeAction, setActiveAction] = useState<SaveAction | null>(null);

  const { mutate: createInvoice, isPending: isCreating } = useCreateInvoice({
    onSuccess: (response) => {
      if (response.success) {
        switch (activeAction) {
          case "draft":
            router.push("/app/invoices");
            break;
          case "send":
            router.push("/app");
            break;
          case "download":
            //TODO: Implement download functionality
            router.push("/app/invoices");
            break;
          case "exit":
            router.push("/app/invoices");
            break;
          default:
            break;
        }
        showSuccessToast(
          "success",
          response.message || "Invoice saved successfully!"
        );
      } else {
        throw new Error(response.message || "Failed to create invoice");
      }
    },
    onError: (error) => {
      console.error("Failed to create invoice:", error);
      setActiveAction(null);
      showErrorToast("error", error || "Failed to save invoice");
    },
  });

  const { mutate: updateInvoice, isPending: isUpdating } = useUpdateInvoice({
    onSuccess: (response) => {
      if (response.success) {
        switch (activeAction) {
          case "draft":
            router.push("/app/invoices");
            break;
          case "send":
            router.push("/app");
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
        showSuccessToast(
          "success",
          response.message || "Invoice saved successfully!"
        );
      } else {
        throw new Error(response.message || "Failed to create invoice");
      }
    },
    onError: (error) => {
      console.error("Failed to create invoice:", error);
      setActiveAction(null);
      showErrorToast("error", error || "Failed to save invoice");
    },
  });

  const isLoading = isCreating || isUpdating;

  const prepareInvoiceData = (status: InvoiceStatus) => {
    // Filter and sanitize items to ensure they meet schema requirements
    const sanitizedItems = (state.invoiceItems || [])
      .filter(
        (item) =>
          item.description &&
          item.description.trim() !== "" &&
          item.quantity &&
          item.quantity > 0 &&
          item.unitPrice !== undefined &&
          item.unitPrice >= 0
      )
      .map((item) => ({
        description: item.description!.trim(),
        quantity: item.quantity!,
        unitPrice: item.unitPrice!,
      }));

    return {
      status,
      clientId: state.clientId!,
      businessId: state.businessDetails?.id || "",
      invoiceNumber: state.invoiceNumber,
      invoiceDate: state.invoiceDate,
      paymentDueDate: state.paymentDueDate!,
      items: sanitizedItems,
      tax: state.tax || 0,
      taxType: state.taxType,
      discount: state.discount || 0,
      discountType: state.discountType,
      paymentAccountId: state.paymentAccount?.id,
      isFavorite: state.isFavorite,
      customNote: state.customNote,
      lateFeeTerms: state.lateFeeTerms,
    };
  };

  const handleSaveAsDraft = () => {
    // Basic validation for draft
    if (!state.clientId || !state.businessDetails?.id) {
      showErrorToast(
        "error",
        "Please select a client and ensure business details are available."
      );
      return;
    }

    setActiveAction("draft");
    const invoiceData = prepareInvoiceData(InvoiceStatus.DRAFT);

    if (state.invoiceId) {
      // Update existing invoice
      const updateData: ZUpdateInvoiceInput = {
        invoiceId: state.invoiceId,
        ...invoiceData,
      };
      updateInvoice(updateData);
    } else {
      // Create new invoice
      const createData: ZCreateInvoiceInput = invoiceData;
      createInvoice(createData);
    }
  };

  const handleSaveAndSend = () => {
    // Validate required fields for SENT status
    if (
      !state.clientId ||
      !state.businessDetails?.id ||
      !state.paymentDueDate
    ) {
      showErrorToast("error", "Missing required fields for sending invoice");
      return;
    }

    // ✅ FIX: Updated validation that accounts for auto-generated invoice numbers
    // Only validate if this is an existing invoice that should already have a number
    const validationResult = getValidationErrors();
    if (!validationResult.isValid) {
      console.log("Validation errors:", validationResult.errors);
      setValidationErrors(validationResult);
      showErrorToast(
        "error",
        "Please fix the validation errors before sending."
      );
      return;
    }

    setActiveAction("send");
    const invoiceData = prepareInvoiceData(InvoiceStatus.SENT);

    if (state.invoiceId) {
      // Update existing invoice
      const updateData: ZUpdateInvoiceInput = {
        invoiceId: state.invoiceId,
        ...invoiceData,
      };
      updateInvoice(updateData);
    } else {
      // Create new invoice - server will auto-generate invoice number
      const createData: ZCreateInvoiceInput = invoiceData;
      createInvoice(createData);
    }
  };

  const handleSaveAndDownload = () => {
    // Validate required fields for download
    if (
      !state.clientId ||
      !state.businessDetails?.id ||
      !state.paymentDueDate
    ) {
      showErrorToast(
        "error",
        "Missing required fields for downloading invoice"
      );
      return;
    }

    // ✅ FIX: Updated validation that accounts for auto-generated invoice numbers
    const validationResult = getValidationErrors();
    if (!validationResult.isValid) {
      console.log("Validation errors:", validationResult.errors);
      setValidationErrors(validationResult);
      showErrorToast(
        "error",
        "Please fix the validation errors before downloading."
      );
      return;
    }

    setActiveAction("download");
    const invoiceData = prepareInvoiceData(InvoiceStatus.SENT);

    if (state.invoiceId) {
      // Update existing invoice
      const updateData: ZUpdateInvoiceInput = {
        invoiceId: state.invoiceId,
        ...invoiceData,
      };
      updateInvoice(updateData);
    } else {
      // Create new invoice - server will auto-generate invoice number
      const createData: ZCreateInvoiceInput = invoiceData;
      createInvoice(createData);
    }
  };

  const handleSaveAndExit = () => {
    // For exit, save as draft if not enough data for SENT
    if (!state.clientId || !state.businessDetails?.id) {
      showErrorToast("error", "Please select a client before exiting");
      return;
    }

    setActiveAction("exit");
    const currentStatus = state.invoiceStatus || InvoiceStatus.DRAFT;
    const invoiceData = prepareInvoiceData(currentStatus);

    if (state.invoiceId) {
      // Update existing invoice
      const updateData: ZUpdateInvoiceInput = {
        invoiceId: state.invoiceId,
        ...invoiceData,
      };
      updateInvoice(updateData);
    } else {
      // Create new invoice with current status
      const createData: ZCreateInvoiceInput = invoiceData;
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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2">
      {/* Save as Draft Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSaveAsDraft}
        disabled={isButtonDisabled("draft")}
        className="flex items-center gap-1 sm:gap-2 border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all duration-200 transform hover:scale-105 min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
      >
        {isButtonLoading("draft") ? (
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <IoSaveOutline className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        )}
        <span className="hidden sm:inline">Save as Draft</span>
        <span className="sm:hidden">Draft</span>
      </Button>

      {/* Save & Send Button with Dropdown */}
      <div className="flex">
        {/* Primary Save & Send Button */}
        <Button
          size="sm"
          onClick={handleSaveAndSend}
          disabled={isButtonDisabled("send")}
          className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-r-none min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
        >
          {isButtonLoading("send") ? (
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoSend className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          )}
          <span className="hidden sm:inline">Save & Send</span>
          <span className="sm:hidden">Send</span>
        </Button>

        {/* Dropdown Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              disabled={isLoading}
              className="px-1 sm:px-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-l-none border-l border-blue-700"
            >
              <IoChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 sm:w-48 bg-white border border-gray-200"
          >
            <DropdownMenuItem
              onClick={handleSaveAndDownload}
              disabled={isLoading}
              className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:bg-gray-50 cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              {isButtonLoading("download") ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoDownloadOutline className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="hidden sm:inline">Save and Download</span>
              <span className="sm:hidden">Download</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSaveAndExit}
              disabled={isLoading}
              className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:bg-gray-50 cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              {isButtonLoading("exit") ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoExitOutline className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="hidden sm:inline">Save and Exit</span>
              <span className="sm:hidden">Exit</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
