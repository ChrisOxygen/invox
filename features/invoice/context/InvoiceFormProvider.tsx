"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { useParams } from "next/navigation";

type FormMode = "create" | "edit";

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface ClientData {
  id?: string;
  name: string;
  address: string;
  email: string;
}

interface InvoiceData {
  invoiceDate: Date;
  paymentDueDate: Date;
  subtotal: number;
  taxes: number;
  finalTotal: number;
  paymentTerms: string;
  acceptedPaymentMethods: string;
}

interface InvoiceFormState {
  formMode: FormMode;
  invoiceId?: string;
  invoiceData: InvoiceData;
  clientData: ClientData;
  invoiceItems: InvoiceItem[];
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
      type: "SET_INVOICE_DATA";
      payload: Partial<InvoiceData>;
    }
  | {
      type: "SET_CLIENT_DATA";
      payload: Partial<ClientData>;
    }
  | {
      type: "SET_INVOICE_ITEMS";
      payload: InvoiceItem[];
    }
  | {
      type: "ADD_INVOICE_ITEM";
      payload: InvoiceItem;
    }
  | {
      type: "UPDATE_INVOICE_ITEM";
      payload: {
        index: number;
        item: Partial<InvoiceItem>;
      };
    }
  | {
      type: "REMOVE_INVOICE_ITEM";
      payload: number; // index
    }
  | {
      type: "CALCULATE_TOTALS";
    }
  | {
      type: "RESET_FORM";
    };

const initialState: InvoiceFormState = {
  formMode: "create",
  invoiceId: undefined,
  invoiceData: {
    invoiceDate: new Date(),
    paymentDueDate: new Date(),
    subtotal: 0,
    taxes: 0,
    finalTotal: 0,
    paymentTerms: "",
    acceptedPaymentMethods: "",
  },
  clientData: {
    name: "",
    address: "",
    email: "",
  },
  invoiceItems: [],
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
    case "SET_INVOICE_DATA":
      return {
        ...state,
        invoiceData: {
          ...state.invoiceData,
          ...action.payload,
        },
      };
    case "SET_CLIENT_DATA":
      return {
        ...state,
        clientData: {
          ...state.clientData,
          ...action.payload,
        },
      };
    case "SET_INVOICE_ITEMS":
      return {
        ...state,
        invoiceItems: action.payload,
      };
    case "ADD_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: [...state.invoiceItems, action.payload],
      };
    case "UPDATE_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: state.invoiceItems.map((item, index) =>
          index === action.payload.index
            ? { ...item, ...action.payload.item }
            : item
        ),
      };
    case "REMOVE_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: state.invoiceItems.filter(
          (_, index) => index !== action.payload
        ),
      };
    case "CALCULATE_TOTALS":
      const subtotal = state.invoiceItems.reduce(
        (sum, item) => sum + item.totalAmount,
        0
      );
      const finalTotal = subtotal + state.invoiceData.taxes;
      return {
        ...state,
        invoiceData: {
          ...state.invoiceData,
          subtotal,
          finalTotal,
        },
      };
    case "RESET_FORM":
      return {
        ...initialState,
        formMode: state.formMode,
        invoiceId: state.invoiceId,
      };
    default:
      return state;
  }
}

interface InvoiceFormContextType {
  state: InvoiceFormState;
  dispatch: React.Dispatch<InvoiceFormAction>;
  // Helper functions
  updateInvoiceData: (data: Partial<InvoiceData>) => void;
  updateClientData: (data: Partial<ClientData>) => void;
  addInvoiceItem: () => void;
  updateInvoiceItem: (index: number, item: Partial<InvoiceItem>) => void;
  removeInvoiceItem: (index: number) => void;
  calculateTotals: () => void;
  resetForm: () => void;
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

  // Helper functions
  const updateInvoiceData = (data: Partial<InvoiceData>) => {
    dispatch({ type: "SET_INVOICE_DATA", payload: data });
  };

  const updateClientData = (data: Partial<ClientData>) => {
    dispatch({ type: "SET_CLIENT_DATA", payload: data });
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
    };
    dispatch({ type: "ADD_INVOICE_ITEM", payload: newItem });
  };

  const updateInvoiceItem = (index: number, item: Partial<InvoiceItem>) => {
    // Calculate totalAmount if quantity or unitPrice changes
    const updatedItem = { ...item };
    if (item.quantity !== undefined || item.unitPrice !== undefined) {
      const currentItem = state.invoiceItems[index];
      const quantity = item.quantity ?? currentItem.quantity;
      const unitPrice = item.unitPrice ?? currentItem.unitPrice;
      updatedItem.totalAmount = quantity * unitPrice;
    }

    dispatch({
      type: "UPDATE_INVOICE_ITEM",
      payload: { index, item: updatedItem },
    });

    // Recalculate totals after item update
    setTimeout(() => calculateTotals(), 0);
  };

  const removeInvoiceItem = (index: number) => {
    dispatch({ type: "REMOVE_INVOICE_ITEM", payload: index });
    setTimeout(() => calculateTotals(), 0);
  };

  const calculateTotals = () => {
    dispatch({ type: "CALCULATE_TOTALS" });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  return (
    <InvoiceFormContext.Provider
      value={{
        state,
        dispatch,
        updateInvoiceData,
        updateClientData,
        addInvoiceItem,
        updateInvoiceItem,
        removeInvoiceItem,
        calculateTotals,
        resetForm,
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
