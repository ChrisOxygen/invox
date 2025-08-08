import { InvoiceFormState, InvoiceFormAction } from "../types/invoiceForm";
import { TaxType, DiscountType, InvoiceStatus } from "@prisma/client";

export const initialState: InvoiceFormState = {
  formMode: "create",
  viewMode: "invoice-details",
  invoiceId: undefined,
  businessDetails: null,
  paymentAccount: null,
  clientId: undefined,
  invoiceNumber: undefined,
  invoiceDate: new Date(),
  paymentDueDate: null,
  invoiceItems: [
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
    },
  ],
  customNote: "Thank you for your trust in our services!",
  tax: 0,
  discount: 0,
  taxType: TaxType.FIXED,
  discountType: DiscountType.FIXED,
  isFavorite: false,
  lateFeeTerms: "",
  invoiceStatus: InvoiceStatus.DRAFT,
  hasUnsavedChanges: false,
  validation: {
    isValid: true,
    errors: {},
  },
};

export function invoiceFormReducer(
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
    case "SET_CLIENT_ID":
      return {
        ...state,
        clientId: action.payload || undefined,
        hasUnsavedChanges: true,
      };
    case "SET_INVOICE_NUMBER":
      return {
        ...state,
        invoiceNumber: action.payload,
        hasUnsavedChanges: true,
      };
    case "SET_INVOICE_DATE":
      return {
        ...state,
        invoiceDate: action.payload,
        hasUnsavedChanges: true,
      };
    case "SET_PAYMENT_DUE_DATE":
      return {
        ...state,
        paymentDueDate: action.payload,
        hasUnsavedChanges: true,
      };

    case "SET_INVOICE_ITEMS":
      return {
        ...state,
        invoiceItems: action.payload,
        hasUnsavedChanges: true,
      };
    case "ADD_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: [...(state.invoiceItems || []), action.payload],
        hasUnsavedChanges: true,
      };
    case "REMOVE_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: state.invoiceItems?.filter(
          (_, index) => index !== action.payload
        ),
        hasUnsavedChanges: true,
      };
    case "UPDATE_INVOICE_ITEM":
      return {
        ...state,
        invoiceItems: state.invoiceItems?.map((item, index) =>
          index === action.payload.index ? { ...item, ...action.payload } : item
        ),
        hasUnsavedChanges: true,
      };
    case "SET_CUSTOM_NOTE":
      return {
        ...state,
        customNote: action.payload,
        hasUnsavedChanges: true,
      };
    case "SET_LATE_FEE_TERMS":
      return {
        ...state,
        lateFeeTerms: action.payload,
        hasUnsavedChanges: true,
      };
    case "SET_TAX":
      return {
        ...state,
        tax: action.payload,
        hasUnsavedChanges: true,
      };
    case "SET_DISCOUNT":
      return {
        ...state,
        discount: action.payload,
        hasUnsavedChanges: true,
      };
    case "SET_TAX_TYPE":
      return {
        ...state,
        taxType: action.payload,
        hasUnsavedChanges: true,
      };
    case "SET_DISCOUNT_TYPE":
      return {
        ...state,
        discountType: action.payload,
        hasUnsavedChanges: true,
      };
    case "SET_IS_FAVORITE":
      return {
        ...state,
        isFavorite: !state.isFavorite,
        hasUnsavedChanges: true,
      };
    case "SET_INVOICE_STATUS":
      return {
        ...state,
        invoiceStatus: action.payload,
        hasUnsavedChanges: false, // Reset unsaved changes when status changes
      };
    case "SET_UNSAVED_CHANGES":
      return {
        ...state,
        hasUnsavedChanges: action.payload,
      };
    case "RESET_FORM":
      return {
        ...initialState,
        formMode: state.formMode,
        invoiceId: state.invoiceId,
        clientId: state.clientId,
      };
    case "LOAD_EXISTING_INVOICE":
      return {
        ...state,
        clientId: action.payload.clientId,
        invoiceNumber: action.payload.invoiceNumber,
        invoiceDate: action.payload.invoiceDate,
        paymentDueDate: action.payload.paymentDueDate,
        tax: action.payload.tax,
        taxType: action.payload.taxType,
        discount: action.payload.discount || 0,
        discountType: action.payload.discountType,
        isFavorite: action.payload.isFavorite || false,
        invoiceItems: action.payload.invoiceItems,
        lateFeeTerms: action.payload.lateFeeTerms,
        // Don't set hasUnsavedChanges when loading existing data
      };
    case "SET_VALIDATION":
      return {
        ...state,
        validation: action.payload,
      };
    default:
      return state;
  }
}
