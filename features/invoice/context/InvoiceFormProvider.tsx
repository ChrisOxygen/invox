"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { useParams } from "next/navigation";

// Types
export type FormMode = "create" | "edit";

export interface InvoiceFormState {
  formMode: FormMode;
  isLoading: boolean;
  invoiceId?: string;
}

export type InvoiceFormAction =
  | { type: "SET_FORM_MODE"; payload: FormMode }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INVOICE_ID"; payload: string | undefined }
  | {
      type: "INITIALIZE_FORM";
      payload: { formMode: FormMode; invoiceId?: string };
    }
  | { type: "RESET_STATE" };

// Initial State
const initialState: InvoiceFormState = {
  formMode: "create",
  isLoading: true,
  invoiceId: undefined,
};

// Reducer
function invoiceFormReducer(
  state: InvoiceFormState,
  action: InvoiceFormAction
): InvoiceFormState {
  switch (action.type) {
    case "SET_FORM_MODE":
      return {
        ...state,
        formMode: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_INVOICE_ID":
      return {
        ...state,
        invoiceId: action.payload,
      };
    case "INITIALIZE_FORM":
      return {
        ...state,
        formMode: action.payload.formMode,
        invoiceId: action.payload.invoiceId,
        isLoading: false,
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

// Context
interface InvoiceFormContextType {
  state: InvoiceFormState;
  dispatch: React.Dispatch<InvoiceFormAction>;
  // Helper functions
  setFormMode: (mode: FormMode) => void;
  setLoading: (loading: boolean) => void;
  setInvoiceId: (id: string | undefined) => void;
  resetState: () => void;
}

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(
  undefined
);

// Provider Props
interface InvoiceFormProviderProps {
  children: ReactNode;
}

// Provider Component
export function InvoiceFormProvider({ children }: InvoiceFormProviderProps) {
  const [state, dispatch] = useReducer(invoiceFormReducer, {
    ...initialState,
  });

  const params = useParams();

  // Helper functions
  const setFormMode = (mode: FormMode) => {
    dispatch({ type: "SET_FORM_MODE", payload: mode });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setInvoiceId = (id: string | undefined) => {
    dispatch({ type: "SET_INVOICE_ID", payload: id });
  };

  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
  };

  // Check URL parameters and set form mode
  useEffect(() => {
    const checkFormMode = () => {
      setLoading(true);

      // Check if there's an invoiceId parameter in the URL
      const invoiceId = params?.invoiceId as string | undefined;

      if (invoiceId) {
        // If invoiceId exists, set to edit mode
        dispatch({
          type: "INITIALIZE_FORM",
          payload: {
            formMode: "edit",
            invoiceId: invoiceId,
          },
        });
      } else {
        // If no invoiceId, set to create mode
        dispatch({
          type: "INITIALIZE_FORM",
          payload: {
            formMode: "create",
            invoiceId: undefined,
          },
        });
      }
    };

    // Small delay to simulate loading state
    const timeoutId = setTimeout(checkFormMode, 100);

    return () => clearTimeout(timeoutId);
  }, [params]);

  const contextValue: InvoiceFormContextType = {
    state,
    dispatch,
    setFormMode,
    setLoading,
    setInvoiceId,
    resetState,
  };

  return (
    <InvoiceFormContext.Provider value={contextValue}>
      {children}
    </InvoiceFormContext.Provider>
  );
}

// Custom Hook
export function useInvoiceForm() {
  const context = useContext(InvoiceFormContext);

  if (context === undefined) {
    throw new Error(
      "useInvoiceForm must be used within an InvoiceFormProvider"
    );
  }

  return context;
}

// Export types for external use
export type { InvoiceFormContextType };
