"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { useParams } from "next/navigation";
import { useUserAndBusinessForInvoice } from "../hooks/useInvoiceForm";
import { UserWithBusiness } from "@/types/database";

// Types
export type FormMode = "create" | "edit";

export interface InvoiceFormState {
  formMode: FormMode;
  isLoading: boolean;
  invoiceId?: string;
  userWithBusiness?: UserWithBusiness;
}

export type InvoiceFormAction =
  | { type: "SET_FORM_MODE"; payload: FormMode }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INVOICE_ID"; payload: string | undefined }
  | {
      type: "INITIALIZE_FORM";
      payload: {
        formMode: FormMode;
        userWithBusiness: UserWithBusiness;
        invoiceId?: string;
      };
    }
  | { type: "SET_USER_WITH_BUSINESS"; payload: UserWithBusiness }
  | { type: "RESET_STATE" };

// Initial State
const initialState: InvoiceFormState = {
  formMode: "create",
  isLoading: true,
  invoiceId: undefined,
  userWithBusiness: undefined,
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
        userWithBusiness: action.payload.userWithBusiness,
        isLoading: false,
      };
    case "SET_USER_WITH_BUSINESS":
      return {
        ...state,
        userWithBusiness: action.payload,
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

  // Fetch user and business details
  const { data: userBusinessData, isPending: isPendingUserBusiness } =
    useUserAndBusinessForInvoice();

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

  const setUserWithBusiness = (data: UserWithBusiness) => {
    dispatch({ type: "SET_USER_WITH_BUSINESS", payload: data });
  };

  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
  }; // Data access helpers

  // Populate user and business details when data is available
  useEffect(() => {
    if (userBusinessData && !isPendingUserBusiness) {
      setUserWithBusiness(userBusinessData);
    }
  }, [userBusinessData, isPendingUserBusiness]);

  // Check URL parameters and set form mode
  useEffect(() => {
    const checkFormMode = () => {
      setLoading(true);

      // Check if there's an invoiceId parameter in the URL
      const invoiceId = params?.invoiceId as string | undefined;

      if (invoiceId) {
        // If invoiceId exists, set to edit mode
        setFormMode("edit");
        setInvoiceId(invoiceId);
      } else {
        // If no invoiceId, set to create mode
        setFormMode("create");
        setInvoiceId(undefined);
      }
    };

    // Small delay to simulate loading state
    const timeoutId = setTimeout(checkFormMode, 100);

    return () => clearTimeout(timeoutId);
  }, [params]);

  // Initialize form state
  useEffect(() => {
    if (userBusinessData && !isPendingUserBusiness) {
      const formMode = state.invoiceId ? "edit" : "create";
      dispatch({
        type: "INITIALIZE_FORM",
        payload: {
          formMode,
          userWithBusiness: userBusinessData,
          invoiceId: state.invoiceId,
        },
      });
    }
  }, [userBusinessData, isPendingUserBusiness, state.invoiceId]);

  const contextValue: InvoiceFormContextType = {
    state,
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
