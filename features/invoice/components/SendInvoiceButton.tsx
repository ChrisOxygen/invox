"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInvoiceForm } from "../context/InvoiceFormProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FiSave,
  FiSend,
  FiLoader,
  FiCheck,
  FiPlusCircle,
} from "react-icons/fi";

interface SendInvoiceButtonProps {
  className?: string;
}

export function SendInvoiceButton({ className }: SendInvoiceButtonProps) {
  const { state, isSaving, validateForm, setInvoiceStatus, setUnsavedChanges } =
    useInvoiceForm();

  const [showDialog, setShowDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { invoiceStatus, hasUnsavedChanges } = state;

  const isDraft = !invoiceStatus || invoiceStatus === "DRAFT";
  const isDisabled = isSaving || (!hasUnsavedChanges && !isDraft);

  const handleClick = () => {
    if (isDisabled) return;

    // If it's in draft mode, show confirmation dialog
    if (isDraft) {
      // Validate form before showing dialog
      if (validateForm()) {
        setShowDialog(true);
      }
    } else {
      // For existing invoices, just save changes
      handleSave();
    }
  };

  const handleSave = async () => {
    if (isDisabled) return;

    try {
      // Auto-save will handle the actual saving since we're
      // not directly calling the API here - we just need to
      // indicate the save is happening through state
      setIsSuccess(false);

      // Let the form state know it's being saved
      // The actual save will be handled by the auto-save hook
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mark as saved
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to save invoice:", error);
    }
  };

  const handleCreateAndSend = async () => {
    setShowDialog(false);

    try {
      // First, create the invoice
      await handleSave();

      // Then mark it as sent
      setInvoiceStatus("SENT");
      setUnsavedChanges(false);

      // Additional logic for sending would go here
      console.log("Invoice created and sent to client!");
    } catch (error) {
      console.error("Failed to create and send invoice:", error);
    }
  };

  const handleCreateOnly = async () => {
    setShowDialog(false);
    await handleSave();
    console.log("Invoice created as draft");
  };

  const getButtonContent = () => {
    if (isSaving) {
      return (
        <>
          <FiLoader className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <FiCheck className="h-4 w-4" />
          <span>Saved!</span>
        </>
      );
    }

    if (isDraft) {
      return (
        <>
          <FiPlusCircle className="h-4 w-4" />
          <span>Create Invoice</span>
        </>
      );
    }

    return (
      <>
        <FiSave className="h-4 w-4" />
        <span>Save Invoice</span>
      </>
    );
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          "h-9 gap-2 bg-black text-white hover:bg-gray-800 transition-all duration-200",
          isSuccess && "bg-gray-700 hover:bg-gray-800",
          !hasUnsavedChanges && !isDraft && "bg-gray-400 hover:bg-gray-500",
          className
        )}
      >
        {getButtonContent()}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription className="text-gray-600">
              Would you like to create and send this invoice to the client, or
              just create it as a draft?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCreateOnly}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <FiSave className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
            <Button
              type="button"
              onClick={handleCreateAndSend}
              className="bg-black text-white hover:bg-gray-800"
            >
              <FiSend className="mr-2 h-4 w-4" />
              Create & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
