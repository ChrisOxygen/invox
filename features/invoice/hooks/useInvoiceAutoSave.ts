import { useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { InvoiceFormAction, InvoiceFormState } from "../types/invoiceForm";
import { useCreateInvoice, useUpdateInvoice } from "../hooks";
import { CreateInvoiceInput, UpdateInvoiceInput } from "@/dataSchemas/invoice";
import { createFingerprint, hasFormChanged } from "../utils";

interface UseInvoiceAutoSaveProps {
  state: InvoiceFormState;
  hasInitialized: React.RefObject<boolean>;
  formLoading: boolean;
  dispatch: React.Dispatch<InvoiceFormAction>;
}

export function useInvoiceAutoSave({
  state,
  hasInitialized,
  formLoading,
  dispatch,
}: UseInvoiceAutoSaveProps) {
  // Auto-save functionality with 5-second debounce
  const debouncedState = useDebounce(state, 5000);

  // Store the last saved form fingerprint to prevent unnecessary saves
  const lastSavedFingerprint = useRef<string | null>(null);

  const { mutate: createInvoice, isPending: creatingInvoice } =
    useCreateInvoice({
      onSuccess: () => {
        // Update fingerprint after successful save
        lastSavedFingerprint.current = createFingerprint(state);

        dispatch({ type: "SET_UNSAVED_CHANGES", payload: false });
        dispatch({ type: "SET_INVOICE_STATUS", payload: "DRAFT" });
      },
      onError: (error) => {
        console.error("Failed to create invoice:", error);
      },
    });

  const { mutate: updateInvoice, isPending: updatingInvoice } =
    useUpdateInvoice({
      onSuccess: () => {
        // Update fingerprint after successful save
        lastSavedFingerprint.current = createFingerprint(state);

        dispatch({ type: "SET_UNSAVED_CHANGES", payload: false });
      },
      onError: (error) => {
        console.error("Failed to update invoice:", error);
      },
    });

  // Auto-save effect that triggers when debounced state changes
  useEffect(() => {
    // Skip auto-save on initial load or if form is still loading
    if (!hasInitialized.current || formLoading) {
      return;
    }

    // Skip auto-save if no meaningful data to save
    if (!debouncedState.client || !debouncedState.invoiceItems?.length) {
      return;
    }

    // Skip if required fields are missing
    if (!debouncedState.businessDetails || !debouncedState.paymentDueDate) {
      return;
    }

    // Skip if no meaningful changes since last save
    if (!hasFormChanged(debouncedState, lastSavedFingerprint.current)) {
      return;
    }

    // Prepare invoice data
    const invoiceItems = debouncedState.invoiceItems.map((item) => ({
      description: item.description || "",
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }));

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const taxes = subtotal * ((debouncedState.tax || 0) / 100);
    const total = subtotal + taxes - (debouncedState.discount || 0);

    try {
      if (debouncedState.formMode === "create") {
        // Create new invoice
        const createData: CreateInvoiceInput = {
          clientId: debouncedState.client.id,
          invoiceNumber: debouncedState.invoiceNumber,
          invoiceDate: debouncedState.invoiceDate || new Date(),
          paymentDueDate: debouncedState.paymentDueDate,
          items: invoiceItems,
          subtotal,
          taxes,
          total,
          acceptedPaymentMethods:
            debouncedState.paymentAccount?.gatewayType || "bank-transfer",
          customNote: debouncedState.customNote,
          lateFeeText: debouncedState.lateFeeText,
        };

        createInvoice(createData);
      } else if (
        debouncedState.formMode === "edit" &&
        debouncedState.invoiceId
      ) {
        // Update existing invoice
        const updateData: UpdateInvoiceInput = {
          invoiceId: debouncedState.invoiceId,
          clientId: debouncedState.client.id,
          invoiceDate: debouncedState.invoiceDate || new Date(),
          paymentDueDate: debouncedState.paymentDueDate,
          items: invoiceItems,
          subtotal,
          taxes,
          total,
          acceptedPaymentMethods:
            debouncedState.paymentAccount?.gatewayType || "bank-transfer",
          customNote: debouncedState.customNote,
          lateFeeText: debouncedState.lateFeeText,
        };

        updateInvoice(updateData);
      }
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  }, [
    debouncedState,
    formLoading,
    hasInitialized,
    createInvoice,
    updateInvoice,
    dispatch,
  ]);

  const isAutoSaving = creatingInvoice || updatingInvoice;

  return { isAutoSaving };
}
