"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useMemo,
} from "react";
import { InvoiceFormContextType } from "../types/invoiceForm";
import {
  invoiceFormReducer,
  initialState,
} from "../reducers/invoiceFormReducer";
import { useInvoiceFormLogic } from "../hooks/useInvoiceFormLogic";

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(
  undefined
);

interface InvoiceFormProviderProps {
  children: React.ReactNode;
}

export function InvoiceFormProvider({ children }: InvoiceFormProviderProps) {
  const [state, dispatch] = useReducer(invoiceFormReducer, initialState);
  const hasInitialized = useRef(false);

  const { formLoading, isSaving, actionHandlers, validationMethods } =
    useInvoiceFormLogic({
      state,
      dispatch,
      hasInitialized,
    });

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      formLoading,
      isSaving,
      ...actionHandlers,
      ...validationMethods,
    }),
    [state, dispatch, formLoading, actionHandlers, validationMethods, isSaving]
  );

  return (
    <InvoiceFormContext.Provider value={contextValue}>
      {children}
    </InvoiceFormContext.Provider>
  );
}

export function useInvoiceForm() {
  const context = useContext(InvoiceFormContext);
  if (!context) {
    throw new Error(
      "useInvoiceForm must be used within an InvoiceFormProvider"
    );
  }
  return context;
}

// Re-export types for convenience
export type {
  InvoiceFormState,
  InvoiceFormAction,
  InvoiceFormContextType,
  FormMode,
  ViewMode,
} from "../types/invoiceForm";
