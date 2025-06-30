import { Client, PaymentAccount } from "@prisma/client";
import { UserWithBusiness } from "@/types";

export type FormMode = "create" | "edit";
export type ViewMode = "invoice-details" | "layout" | "theme";

export interface InvoiceFormState {
  formMode: FormMode;
  viewMode?: ViewMode;
  invoiceId?: string;
  businessDetails: UserWithBusiness | null;
  paymentAccount: PaymentAccount | null;
  client?: Client | null;
  invoiceNumber?: string;
  invoiceDate?: Date;
  paymentDueDate: Date | null;
  paymentTerms?: string;
  acceptedPaymentMethods?: string;
  invoiceItems?: {
    description?: string;
    quantity?: number;
    unitPrice?: number;
  }[];
  customNote: string;
  tax?: number;
  discount?: number;
  lateFeeText?: string;
  invoiceStatus?: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  hasUnsavedChanges: boolean;
}

export type InvoiceFormAction =
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
      type: "SET_PAYMENT_TERMS";
      payload: string;
    }
  | {
      type: "SET_ACCEPTED_PAYMENT_METHODS";
      payload: string;
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
      payload: number;
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
      type: "SET_INVOICE_STATUS";
      payload: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
    }
  | {
      type: "SET_UNSAVED_CHANGES";
      payload: boolean;
    }
  | {
      type: "RESET_FORM";
    }
  | {
      type: "LOAD_EXISTING_INVOICE";
      payload: {
        client: Client;
        invoiceNumber: string;
        invoiceDate: Date;
        paymentDueDate: Date;
        taxes: number;
        discount?: number;
        invoiceItems: {
          description?: string;
          quantity?: number;
          unitPrice?: number;
        }[];
        acceptedPaymentMethods?: string;
      };
    };

export interface InvoiceFormContextType {
  state: InvoiceFormState;
  dispatch: React.Dispatch<InvoiceFormAction>;
  setViewMode: (viewMode: ViewMode) => void;

  // Convenience methods for controlled components
  setClient: (client: Client | null) => void;
  setInvoiceNumber: (invoiceNumber: string) => void;
  setInvoiceDate: (date: Date) => void;
  setPaymentDueDate: (date: Date | null) => void;
  setPaymentTerms: (terms: string) => void;
  setAcceptedPaymentMethods: (methods: string) => void;
  setCustomNote: (note: string) => void;
  setLateFeeText: (text: string) => void;
  setTax: (tax: number) => void;
  setDiscount: (discount: number) => void;
  setPaymentAccount: (id: string) => void;
  setInvoiceStatus: (
    status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
  ) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  resetForm: () => void;
  formLoading: boolean;
  isSaving: boolean;

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
