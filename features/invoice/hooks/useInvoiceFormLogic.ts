import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Client } from "@prisma/client";
import {
  InvoiceFormState,
  InvoiceFormAction,
  FormMode,
  ViewMode,
} from "../types/invoiceForm";
import { useUserAndBusiness } from "./useUserAndBusiness";
import { useGetPaymentAccounts } from "@/hooks/payments/useGetPaymentAccounts";
import { useGetInvoice } from "./useGetInvoice";
import { useInvoiceAutoSave } from "./useInvoiceAutoSave";
import {
  getValidationErrors,
  validateForm,
} from "../utils/invoiceFormValidation";

interface UseInvoiceFormLogicProps {
  state: InvoiceFormState;
  dispatch: React.Dispatch<InvoiceFormAction>;
  hasInitialized: React.RefObject<boolean>;
}

export function useInvoiceFormLogic({
  state,
  dispatch,
  hasInitialized,
}: UseInvoiceFormLogicProps) {
  const params = useParams();

  // Data fetching hooks
  const { data: businessData, isPending: gettingBusinessDetails } =
    useUserAndBusiness();
  const { paymentAccounts, isPending: gettingPaymentAccounts } =
    useGetPaymentAccounts();

  // Load existing invoice if in edit mode
  const { invoice: existingInvoice, isPending: loadingInvoice } = useGetInvoice(
    {
      invoiceId: state.invoiceId || "",
      enabled: state.formMode === "edit" && !!state.invoiceId,
    }
  );

  const formLoading =
    gettingBusinessDetails || gettingPaymentAccounts || loadingInvoice;

  // Auto-save functionality
  const { isAutoSaving } = useInvoiceAutoSave({
    state,
    hasInitialized,
    formLoading,
  });

  // Initialize business details and payment accounts
  useEffect(() => {
    if (
      businessData &&
      !gettingBusinessDetails &&
      paymentAccounts &&
      !gettingPaymentAccounts
    ) {
      const defaultPaymentAccount = paymentAccounts.find(
        (account) => account.isDefault
      );

      dispatch({
        type: "SET_BUSINESS_DETAILS",
        payload: businessData,
      });

      if (defaultPaymentAccount) {
        dispatch({
          type: "SET_PAYMENT_ACCOUNT",
          payload: defaultPaymentAccount,
        });
      }
    }
  }, [
    businessData,
    gettingBusinessDetails,
    paymentAccounts,
    gettingPaymentAccounts,
    dispatch,
  ]);

  // Initialize form mode and invoice ID from URL params
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
  }, [params, dispatch, hasInitialized]);

  // Load existing invoice data when in edit mode
  useEffect(() => {
    if (existingInvoice && state.formMode === "edit") {
      dispatch({ type: "SET_CLIENT", payload: existingInvoice.client });
      dispatch({
        type: "SET_INVOICE_NUMBER",
        payload: existingInvoice.invoiceNumber || "",
      });
      dispatch({
        type: "SET_INVOICE_DATE",
        payload: existingInvoice.invoiceDate,
      });
      dispatch({
        type: "SET_PAYMENT_DUE_DATE",
        payload: existingInvoice.paymentDueDate,
      });
      dispatch({ type: "SET_TAX", payload: existingInvoice.taxes || 0 });

      // Note: You'll need to extract items from somewhere, as they're not in the current schema
      // This might require updating your invoice model to include items
    }
  }, [existingInvoice, state.formMode, dispatch]);

  // Action handlers
  const actionHandlers = useMemo(
    () => ({
      resetForm: () => {
        dispatch({ type: "RESET_FORM" });
      },

      setClient: (client: Client | null) => {
        dispatch({ type: "SET_CLIENT", payload: client });
      },

      setPaymentDueDate: (date: Date | null) => {
        dispatch({ type: "SET_PAYMENT_DUE_DATE", payload: date });
      },

      setCustomNote: (note: string) => {
        dispatch({ type: "SET_CUSTOM_NOTE", payload: note });
      },

      setViewMode: (viewMode: ViewMode) => {
        dispatch({ type: "SET_VIEW_MODE", payload: viewMode });
      },

      setInvoiceNumber: (invoiceNumber: string) => {
        dispatch({ type: "SET_INVOICE_NUMBER", payload: invoiceNumber });
      },

      setInvoiceDate: (date: Date) => {
        dispatch({ type: "SET_INVOICE_DATE", payload: date });
      },

      setPaymentTerms: (terms: string) => {
        dispatch({ type: "SET_PAYMENT_TERMS", payload: terms });
      },

      setAcceptedPaymentMethods: (methods: string) => {
        dispatch({ type: "SET_ACCEPTED_PAYMENT_METHODS", payload: methods });
      },

      setPaymentAccount: (id: string) => {
        const paymentAccount = paymentAccounts.find(
          (account) => account.id === id
        );
        if (!paymentAccount) {
          return;
        }
        dispatch({ type: "SET_PAYMENT_ACCOUNT", payload: paymentAccount });
      },

      setLateFeeText: (text: string) => {
        dispatch({ type: "SET_LATE_FEE_TEXT", payload: text });
      },

      addInvoiceItem: (item: {
        description?: string;
        quantity?: number;
        unitPrice?: number;
      }) => {
        dispatch({ type: "ADD_INVOICE_ITEM", payload: item });
      },

      removeInvoiceItem: (index: number) => {
        dispatch({ type: "REMOVE_INVOICE_ITEM", payload: index });
      },

      updateInvoiceItem: (
        index: number,
        updatedItem: {
          description?: string;
          quantity?: number;
          unitPrice?: number;
        }
      ) => {
        dispatch({
          type: "UPDATE_INVOICE_ITEM",
          payload: { index, ...updatedItem },
        });
      },

      setTax: (tax: number) => {
        dispatch({ type: "SET_TAX", payload: tax });
      },

      setDiscount: (discount: number) => {
        dispatch({ type: "SET_DISCOUNT", payload: discount });
      },
    }),
    [dispatch, paymentAccounts]
  );

  // Validation methods
  const validationMethods = useMemo(
    () => ({
      getValidationErrors: () => getValidationErrors(state),
      validateForm: () => validateForm(state),
    }),
    [state]
  );

  return {
    formLoading,
    actionHandlers,
    validationMethods,
    isAutoSaving,
  };
}
