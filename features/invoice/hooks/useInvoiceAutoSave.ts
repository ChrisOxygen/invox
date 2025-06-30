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

  // Update fingerprint immediately when form data is loaded to prevent auto-save
  useEffect(() => {
    if (
      state.formMode === "edit" &&
      state.invoiceId &&
      !state.hasUnsavedChanges &&
      state.client
    ) {
      // Update the fingerprint to current state when form is loaded without unsaved changes
      lastSavedFingerprint.current = createFingerprint(state);
    }
  }, [state]);

  const { mutate: createInvoice, isPending: creatingInvoice } =
    useCreateInvoice({
      onSuccess: (response) => {
        // Update fingerprint after successful save
        lastSavedFingerprint.current = createFingerprint(debouncedState);

        // Store the new invoice ID and switch to edit mode
        if (response.data?.id) {
          dispatch({ type: "SET_INVOICE_ID", payload: response.data.id });
          dispatch({ type: "SET_FORM_MODE", payload: "edit" });
        }

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
        lastSavedFingerprint.current = createFingerprint(debouncedState);

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

    // Skip auto-save if form doesn't have unsaved changes
    if (!state.hasUnsavedChanges) {
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

    console.log("🚀 Auto-save triggered");

    // Prepare invoice data
    const invoiceItems = debouncedState.invoiceItems.map((item) => ({
      description: item.description || "",
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }));

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = debouncedState.tax || 0; // Tax as absolute amount
    const discountAmount = debouncedState.discount || 0; // Discount as absolute amount
    const total = Math.max(0, subtotal - taxAmount - discountAmount); // Subtract both tax and discount, ensure non-negative

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
          taxes: taxAmount,
          discount: discountAmount,
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
          taxes: taxAmount,
          discount: discountAmount,
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
    state.hasUnsavedChanges,
    formLoading,
    hasInitialized,
    createInvoice,
    updateInvoice,
    dispatch,
  ]);

  const isAutoSaving = creatingInvoice || updatingInvoice;

  return { isAutoSaving };
}
