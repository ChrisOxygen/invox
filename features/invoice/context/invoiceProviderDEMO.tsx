"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { useParams } from "next/navigation";
import { Client } from "@prisma/client";

type FormMode = "create" | "edit";

interface InvoiceFormState {
  formMode: FormMode;
  invoiceId?: string;
  client?: Client | null;
  invoiceNumber?: string;
  invoiceDate?: Date;
  paymentDueDate: Date | null;
  customNote: string;
}

type InvoiceFormAction =
  | {
      type: "SET_FORM_MODE";
      payload: FormMode;
    }
  | {
      type: "SET_INVOICE_ID";
      payload: string;
    }
  | {
      type: "SET_CLIENT";
      payload: Client | null;
    }
  | {
      type: "SET_INVOICE_NUMBER";
      payload: string;
    }
  | {
      type: "SET_INVOICE_DATE";
      payload: Date;
    }
  | {
      type: "SET_PAYMENT_DUE_DATE";
      payload: Date | null;
    }
  | {
      type: "SET_CUSTOM_NOTE";
      payload: string;
    }
  | {
      type: "RESET_FORM";
    };

const initialState: InvoiceFormState = {
  formMode: "create",
  invoiceId: undefined,
  client: null,
  invoiceNumber: undefined,
  invoiceDate: new Date(),
  paymentDueDate: null,
  customNote: "Thank you for your trust in our services!",
};

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
    case "SET_INVOICE_ID":
      return {
        ...state,
        invoiceId: action.payload,
      };
    case "SET_CLIENT":
      return {
        ...state,
        client: action.payload,
      };
    case "SET_INVOICE_NUMBER":
      return {
        ...state,
        invoiceNumber: action.payload,
      };
    case "SET_INVOICE_DATE":
      return {
        ...state,
        invoiceDate: action.payload,
      };
    case "SET_PAYMENT_DUE_DATE":
      return {
        ...state,
        paymentDueDate: action.payload,
      };
    case "SET_CUSTOM_NOTE":
      return {
        ...state,
        customNote: action.payload,
      };
    case "RESET_FORM":
      return {
        ...initialState,
        formMode: state.formMode,
        invoiceId: state.invoiceId,
        client: state.client,
      };
    default:
      return state;
  }
}

interface InvoiceFormContextType {
  state: InvoiceFormState;
  dispatch: React.Dispatch<InvoiceFormAction>;

  // Convenience methods for controlled components
  setClient: (client: Client | null) => void;
  setPaymentDueDate: (date: Date | null) => void;
  setCustomNote: (note: string) => void;
  resetForm: () => void;

  // Validation methods
  validateForm: () => boolean;
  getValidationErrors: () => string[];
}

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(
  undefined
);

interface InvoiceFormProviderProps {
  children: React.ReactNode;
}

export function InvoiceFormProvider({ children }: InvoiceFormProviderProps) {
  const [state, dispatch] = useReducer(invoiceFormReducer, initialState);
  const params = useParams();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const invoiceId = params?.invoiceId as string;
    const formMode: FormMode = invoiceId ? "edit" : "create";

    dispatch({
      type: "SET_FORM_MODE",
      payload: formMode,
    });

    if (invoiceId) {
      dispatch({
        type: "SET_INVOICE_ID",
        payload: invoiceId,
      });
    }

    hasInitialized.current = true;
  }, [params]);
  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const setClient = (client: Client | null) => {
    dispatch({ type: "SET_CLIENT", payload: client });
  };

  const setPaymentDueDate = (date: Date | null) => {
    dispatch({ type: "SET_PAYMENT_DUE_DATE", payload: date });
  };
  const setCustomNote = (note: string) => {
    dispatch({ type: "SET_CUSTOM_NOTE", payload: note });
  };

  // Validation methods
  const getValidationErrors = (): string[] => {
    const errors: string[] = [];

    if (!state.client) {
      errors.push("Please select a client");
    }

    if (!state.paymentDueDate) {
      errors.push("Please set a payment due date");
    }

    // Additional validation can be added here
    return errors;
  };

  const validateForm = (): boolean => {
    return getValidationErrors().length === 0;
  };

  return (
    <InvoiceFormContext.Provider
      value={{
        state,
        dispatch,
        setClient,
        setPaymentDueDate,
        setCustomNote,
        resetForm,
        validateForm,
        getValidationErrors,
      }}
    >
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
