"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { useParams } from "next/navigation";
import { Client, PaymentAccount } from "@prisma/client";
import { UserWithBusiness } from "@/types";
import { useUserAndBusiness } from "../hooks/useUserAndBusiness";
import { useGetPaymentAccounts } from "@/hooks/payments/useGetPaymentAccounts";
import { useDebounce } from "@/hooks/useDebounce";

type FormMode = "create" | "edit";
export type ViewMode = "invoice-details" | "layout" | "theme";

export interface InvoiceFormState {
  formMode: FormMode;
  viewMode?: ViewMode;
  invoiceId?: string;
  businessDetails: UserWithBusiness | null; // User with business details
  paymentAccount: PaymentAccount | null; // Optional payment account field
  client?: Client | null;
  invoiceNumber?: string;
  invoiceDate?: Date;
  paymentDueDate: Date | null;
  invoiceItems?: {
    description?: string;
    quantity?: number;
    unitPrice?: number;
  }[];
  customNote: string;
  tax?: number; // Optional tax field
  discount?: number; // Optional discount field
  lateFeeText?: string; // Optional late fee text field
}

type InvoiceFormAction =
  | {
      type: "SET_FORM_MODE";
      payload: FormMode;
    }
  | {
      type: "SET_VIEW_MODE";
      payload: ViewMode;
    }
  | {
      type: "SET_INVOICE_ID";
      payload: string;
    }
  | {
      type: "SET_BUSINESS_DETAILS";
      payload: UserWithBusiness;
    }
  | {
      type: "SET_PAYMENT_ACCOUNT";
      payload: PaymentAccount;
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
      type: "SET_INVOICE_ITEMS";
      payload: {
        description?: string;
        quantity?: number;
        unitPrice?: number;
      }[];
    }
  | {
      type: "ADD_INVOICE_ITEM";
      payload: {
        description?: string;
        quantity?: number;
        unitPrice?: number;
      };
    }
  | {
      type: "REMOVE_INVOICE_ITEM";
      payload: number; // Index of the item to remove
    }
  | {
      type: "UPDATE_INVOICE_ITEM";
      payload: {
        index: number;
        description?: string;
        quantity?: number;
        unitPrice?: number;
      };
    }
  | {
      type: "SET_CUSTOM_NOTE";
      payload: string;
    }
  | {
      type: "SET_LATE_FEE_TEXT";
      payload: string;
    }
  | {
      type: "SET_TAX";
      payload: number;
    }
  | {
      type: "SET_DISCOUNT";
      payload: number;
    }
  | {
      type: "RESET_FORM";
    };

const initialState: InvoiceFormState = {
  formMode: "create",
  viewMode: "invoice-details", // Default view mode
  invoiceId: undefined,
  businessDetails: null,
  paymentAccount: null, // Initialize with null
  client: null,
  invoiceNumber: undefined,
  invoiceDate: new Date(),
  paymentDueDate: null,
  invoiceItems: [
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
    },
  ], // Initialize with an empty array
  customNote: "Thank you for your trust in our services!",
  tax: 0,
  discount: 0,
  lateFeeText: "", // Default late fee text
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
    case "SET_VIEW_MODE":
      return {
        ...state,
        viewMode: action.payload,
      };
    case "SET_INVOICE_ID":
      return {
        ...state,
        invoiceId: action.payload,
      };
    case "SET_BUSINESS_DETAILS":
      return {
        ...state,
        businessDetails: action.payload,
      };
    case "SET_PAYMENT_ACCOUNT":
      return {
        ...state,
        paymentAccount: action.payload,
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
    case "SET_INVOICE_ITEMS":
      return {
        ...state,
        invoiceItems: action.payload,
      };
    case "ADD_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: [...(state.invoiceItems || []), action.payload],
      };
    case "REMOVE_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: state.invoiceItems?.filter(
          (_, index) => index !== action.payload
        ),
      };
    case "UPDATE_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: state.invoiceItems?.map((item, index) =>
          index === action.payload.index ? { ...item, ...action.payload } : item
        ),
      };
    case "SET_CUSTOM_NOTE":
      return {
        ...state,
        customNote: action.payload,
      };
    case "SET_LATE_FEE_TEXT":
      return {
        ...state,
        lateFeeText: action.payload,
      };
    case "SET_TAX":
      return {
        ...state,
        tax: action.payload,
      };
    case "SET_DISCOUNT":
      return {
        ...state,
        discount: action.payload,
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
  setViewMode: (viewMode: ViewMode) => void;

  // Convenience methods for controlled components
  setClient: (client: Client | null) => void;
  setPaymentDueDate: (date: Date | null) => void;
  setCustomNote: (note: string) => void;
  setLateFeeText: (text: string) => void;
  setTax: (tax: number) => void;
  setDiscount: (discount: number) => void;
  setPaymentAccount: (id: string) => void;
  resetForm: () => void;
  formLoading: boolean;

  addInvoiceItem: (item: {
    description?: string;
    quantity?: number;
    unitPrice?: number;
  }) => void;
  removeInvoiceItem: (index: number) => void;
  updateInvoiceItem: (
    index: number,
    updatedItem: { description?: string; quantity?: number; unitPrice?: number }
  ) => void;

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
  const hasInitialized = useRef(false);

  const params = useParams();

  const { data, isPending: gettingBusinessDetails } = useUserAndBusiness();
  const { paymentAccounts, isPending: gettingPaymentAccounts } =
    useGetPaymentAccounts();

  // Auto-save functionality with 30-second debounce
  const debouncedState = useDebounce(state, 30000); // 30 seconds

  const formLoading = gettingBusinessDetails || gettingPaymentAccounts;

  useEffect(() => {
    console.log(
      "usereffect fired...........",
      data,
      gettingBusinessDetails,
      paymentAccounts,
      gettingPaymentAccounts
    );
    if (
      data &&
      !gettingBusinessDetails &&
      paymentAccounts &&
      !gettingPaymentAccounts
    ) {
      const defaultPaymentAccount = paymentAccounts.find(
        (account) => account.isDefault
      );
      dispatch({
        type: "SET_BUSINESS_DETAILS",
        payload: data,
      });
      console.log("Business Details:", data);
      console.log("Payment Accounts:", paymentAccounts);

      if (defaultPaymentAccount) {
        dispatch({
          type: "SET_PAYMENT_ACCOUNT",
          payload: defaultPaymentAccount,
        });
      }
    }
  }, [data, gettingBusinessDetails, paymentAccounts, gettingPaymentAccounts]);

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

  // Auto-save effect that triggers when debounced state changes
  useEffect(() => {
    // Skip auto-save on initial load or if form is still loading
    if (!hasInitialized.current || formLoading) {
      return;
    }

    // Skip auto-save if no meaningful data to save
    if (!debouncedState.client && !debouncedState.invoiceItems?.length) {
      return;
    }

    // Trigger auto-save
    saveInvoiceData(debouncedState);
  }, [debouncedState, formLoading]);

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

  const setViewMode = (viewMode: ViewMode) => {
    dispatch({ type: "SET_VIEW_MODE", payload: viewMode });
  };
  const setPaymentAccount = (id: string) => {
    const paymentAccount = paymentAccounts.find((account) => account.id === id);
    if (!paymentAccount) {
      return;
    }
    dispatch({ type: "SET_PAYMENT_ACCOUNT", payload: paymentAccount });
  };

  const setLateFeeText = (text: string) => {
    dispatch({ type: "SET_LATE_FEE_TEXT", payload: text });
  };

  const addInvoiceItem = (item: {
    description?: string;
    quantity?: number;
    unitPrice?: number;
  }) => {
    dispatch({ type: "ADD_INVOICE_ITEM", payload: item });
  };

  const removeInvoiceItem = (index: number) => {
    dispatch({ type: "REMOVE_INVOICE_ITEM", payload: index });
  };

  const updateInvoiceItem = (
    index: number,
    updatedItem: { description?: string; quantity?: number; unitPrice?: number }
  ) => {
    dispatch({
      type: "UPDATE_INVOICE_ITEM",
      payload: { index, ...updatedItem },
    });
  };

  const setTax = (tax: number) => {
    dispatch({ type: "SET_TAX", payload: tax });
  };
  const setDiscount = (discount: number) => {
    dispatch({ type: "SET_DISCOUNT", payload: discount });
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

  // Dummy save function (placeholder for actual save implementation)
  const saveInvoiceData = (invoiceState: InvoiceFormState) => {
    console.log("console saving data", invoiceState);
    // TODO: Implement actual save logic here
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
        setViewMode,
        addInvoiceItem,
        removeInvoiceItem,
        updateInvoiceItem,
        setTax,
        setDiscount,
        formLoading,
        setPaymentAccount,
        setLateFeeText,
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
