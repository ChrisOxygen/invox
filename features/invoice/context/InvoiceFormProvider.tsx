"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Types
export interface BusinessData {
  id?: string;
  businessName: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface ClientData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceFormState {
  mode: "edit" | "create";
  activeTab: "details" | "layout" | "theme";
  businessData?: BusinessData;
  clientData?: ClientData;
  itemsList: InvoiceItem[];
  invoiceDetails: {
    invoiceNumber?: string;
    issueDate?: Date;
    dueDate?: Date;
    currency?: string;
    notes?: string;
    terms?: string;
  };
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  };
}

type InvoiceFormAction =
  | { type: "SET_MODE"; payload: "edit" | "create" }
  | { type: "SET_ACTIVE_TAB"; payload: "details" | "layout" | "theme" }
  | { type: "SET_BUSINESS_DATA"; payload: BusinessData }
  | { type: "SET_CLIENT_DATA"; payload: ClientData }
  | { type: "SET_ITEMS_LIST"; payload: InvoiceItem[] }
  | { type: "ADD_ITEM"; payload: InvoiceItem }
  | { type: "UPDATE_ITEM"; payload: { id: string; data: Partial<InvoiceItem> } }
  | { type: "REMOVE_ITEM"; payload: string }
  | {
      type: "SET_INVOICE_DETAILS";
      payload: Partial<InvoiceFormState["invoiceDetails"]>;
    }
  | { type: "CALCULATE_TOTALS" }
  | { type: "RESET_FORM" }
  | { type: "LOAD_INVOICE_DATA"; payload: Partial<InvoiceFormState> };

interface InvoiceFormContextType {
  state: InvoiceFormState;
  setMode: (mode: "edit" | "create") => void;
  setActiveTab: (tab: "details" | "layout" | "theme") => void;
  setBusinessData: (data: BusinessData) => void;
  setClientData: (data: ClientData) => void;
  setItemsList: (items: InvoiceItem[]) => void;
  addItem: (item: InvoiceItem) => void;
  updateItem: (id: string, data: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  setInvoiceDetails: (
    details: Partial<InvoiceFormState["invoiceDetails"]>
  ) => void;
  calculateTotals: () => void;
  resetForm: () => void;
  loadInvoiceData: (data: Partial<InvoiceFormState>) => void;
}

// Initial state
const initialState: InvoiceFormState = {
  mode: "create",
  activeTab: "details",
  businessData: undefined,
  clientData: undefined,
  itemsList: [],
  invoiceDetails: {
    invoiceNumber: undefined,
    issueDate: new Date(),
    dueDate: undefined,
    currency: "USD",
    notes: "",
    terms: "",
  },
  totals: {
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  },
};

// Reducer
function invoiceFormReducer(
  state: InvoiceFormState,
  action: InvoiceFormAction
): InvoiceFormState {
  switch (action.type) {
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
      };

    case "SET_ACTIVE_TAB":
      return {
        ...state,
        activeTab: action.payload,
      };

    case "SET_BUSINESS_DATA":
      return {
        ...state,
        businessData: action.payload,
      };

    case "SET_CLIENT_DATA":
      return {
        ...state,
        clientData: action.payload,
      };

    case "SET_ITEMS_LIST":
      const newStateWithItems = {
        ...state,
        itemsList: action.payload,
      };
      return calculateTotalsReducer(newStateWithItems);

    case "ADD_ITEM":
      const stateWithNewItem = {
        ...state,
        itemsList: [...state.itemsList, action.payload],
      };
      return calculateTotalsReducer(stateWithNewItem);

    case "UPDATE_ITEM":
      const updatedItems = state.itemsList.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.data }
          : item
      );
      const stateWithUpdatedItem = {
        ...state,
        itemsList: updatedItems,
      };
      return calculateTotalsReducer(stateWithUpdatedItem);

    case "REMOVE_ITEM":
      const filteredItems = state.itemsList.filter(
        (item) => item.id !== action.payload
      );
      const stateWithRemovedItem = {
        ...state,
        itemsList: filteredItems,
      };
      return calculateTotalsReducer(stateWithRemovedItem);

    case "SET_INVOICE_DETAILS":
      return {
        ...state,
        invoiceDetails: {
          ...state.invoiceDetails,
          ...action.payload,
        },
      };

    case "CALCULATE_TOTALS":
      return calculateTotalsReducer(state);

    case "RESET_FORM":
      return initialState;

    case "LOAD_INVOICE_DATA":
      const loadedState = {
        ...state,
        ...action.payload,
      };
      return calculateTotalsReducer(loadedState);

    default:
      return state;
  }
}

// Helper function to calculate totals
function calculateTotalsReducer(state: InvoiceFormState): InvoiceFormState {
  const subtotal = state.itemsList.reduce((sum, item) => {
    const itemAmount = item.quantity * item.rate;
    return sum + itemAmount;
  }, 0);

  // Update item amounts
  const updatedItems = state.itemsList.map((item) => ({
    ...item,
    amount: item.quantity * item.rate,
  }));

  const tax = subtotal * 0.1; // 10% tax (you can make this configurable)
  const discount = 0; // You can add discount logic here
  const total = subtotal + tax - discount;

  return {
    ...state,
    itemsList: updatedItems,
    totals: {
      subtotal,
      tax,
      discount,
      total,
    },
  };
}

// Context
const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(
  undefined
);

// Provider
interface InvoiceFormProviderProps {
  children: ReactNode;
}

export function InvoiceFormProvider({ children }: InvoiceFormProviderProps) {
  const [state, dispatch] = useReducer(invoiceFormReducer, initialState);

  // Action creators
  const setMode = (mode: "edit" | "create") => {
    dispatch({ type: "SET_MODE", payload: mode });
  };

  const setActiveTab = (tab: "details" | "layout" | "theme") => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
  };

  const setBusinessData = (data: BusinessData) => {
    dispatch({ type: "SET_BUSINESS_DATA", payload: data });
  };

  const setClientData = (data: ClientData) => {
    dispatch({ type: "SET_CLIENT_DATA", payload: data });
  };

  const setItemsList = (items: InvoiceItem[]) => {
    dispatch({ type: "SET_ITEMS_LIST", payload: items });
  };

  const addItem = (item: InvoiceItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const updateItem = (id: string, data: Partial<InvoiceItem>) => {
    dispatch({ type: "UPDATE_ITEM", payload: { id, data } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const setInvoiceDetails = (
    details: Partial<InvoiceFormState["invoiceDetails"]>
  ) => {
    dispatch({ type: "SET_INVOICE_DETAILS", payload: details });
  };

  const calculateTotals = () => {
    dispatch({ type: "CALCULATE_TOTALS" });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const loadInvoiceData = (data: Partial<InvoiceFormState>) => {
    dispatch({ type: "LOAD_INVOICE_DATA", payload: data });
  };

  const value: InvoiceFormContextType = {
    state,
    setMode,
    setActiveTab,
    setBusinessData,
    setClientData,
    setItemsList,
    addItem,
    updateItem,
    removeItem,
    setInvoiceDetails,
    calculateTotals,
    resetForm,
    loadInvoiceData,
  };

  return (
    <InvoiceFormContext.Provider value={value}>
      {children}
    </InvoiceFormContext.Provider>
  );
}

// Hook
export function useInvoiceForm() {
  const context = useContext(InvoiceFormContext);
  if (context === undefined) {
    throw new Error(
      "useInvoiceForm must be used within an InvoiceFormProvider"
    );
  }
  return context;
}
