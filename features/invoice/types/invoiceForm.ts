import {
  PaymentAccount,
  TaxType,
  DiscountType,
  InvoiceStatus,
} from "@prisma/client";
import { UserWithBusiness } from "@/types";

export type FormMode = "create" | "edit";
export type ViewMode = "invoice-details" | "layout" | "theme";

export interface InvoiceFormState {
  formMode: FormMode;
  viewMode?: ViewMode;
  invoiceId?: string;
  businessDetails: UserWithBusiness | null;
  paymentAccount: PaymentAccount | null;
  clientId?: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
  paymentDueDate: Date | null;
  invoiceItems?: {
    description?: string;
    quantity?: number;
    unitPrice?: number;
  }[];
  customNote: string;
  taxType: TaxType;
  tax?: number;
  discountType: DiscountType;
  discount?: number;
  lateFeeTerms?: string;
  invoiceStatus?: InvoiceStatus;
  isFavorite: boolean;
  hasUnsavedChanges: boolean;
  validation: InvoiceValidationResult;
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
      type: "SET_CLIENT_ID";
      payload: string | null;
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
      type: "SET_LATE_FEE_TERMS";
      payload: string;
    }
  | {
      type: "SET_TAX";
      payload: number;
    }
  | {
      type: "SET_TAX_TYPE";
      payload: TaxType;
    }
  | {
      type: "SET_DISCOUNT";
      payload: number;
    }
  | {
      type: "SET_DISCOUNT_TYPE";
      payload: DiscountType;
    }
  | {
      type: "SET_IS_FAVORITE";
    }
  | {
      type: "SET_INVOICE_STATUS";
      payload: InvoiceStatus;
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
        clientId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        paymentDueDate: Date;
        tax: number;
        taxType: TaxType;
        discount?: number;
        discountType: DiscountType;
        isFavorite?: boolean;
        invoiceItems: {
          description?: string;
          quantity?: number;
          unitPrice?: number;
        }[];
        lateFeeTerms?: string;
      };
    }
  | {
      type: "SET_VALIDATION";
      payload: InvoiceValidationResult;
    };

// create a type for invoice errors thats is an objects of invoices ststes as keys, and an array of strings as values
export type InvoiceFieldErrors = {
  [key in keyof InvoiceFormState]?: string[] | string;
} & {
  itemErrors?: invoiceItemErrors[];
};

export type InvoiceValidationResult = {
  isValid: boolean;
  errors: InvoiceFieldErrors;
};

export type invoiceItemErrors = {
  description?: string; // Description is required
  quantity?: string; // Quantity must be greater than 0
  unitPrice?: string; // Unit price cannot be negative
};

export interface InvoiceFormContextType {
  state: InvoiceFormState;
  dispatch: React.Dispatch<InvoiceFormAction>;
  setViewMode: (viewMode: ViewMode) => void;

  // Convenience methods for controlled components
  setClientId: (clientId: string | null) => void;
  setInvoiceNumber: (invoiceNumber: string) => void;
  setInvoiceDate: (date: Date) => void;
  setPaymentDueDate: (date: Date | null) => void;
  setCustomNote: (note: string) => void;
  setLateFeeTerms: (terms: string) => void;
  setTax: (tax: number) => void;
  setTaxType: (type: TaxType) => void;
  setDiscountType: (type: DiscountType) => void;
  setDiscount: (discount: number) => void;
  toggleIsFavorite: () => void;
  setPaymentAccount: (id: string) => void;
  setInvoiceStatus: (status: InvoiceStatus) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
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
  getValidationErrors: () => InvoiceValidationResult;
  setValidationErrors: (validation: InvoiceValidationResult) => void;
}
