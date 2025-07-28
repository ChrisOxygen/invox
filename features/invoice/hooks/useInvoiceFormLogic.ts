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
import { useGetInvoiceById } from "./useGetInvoiceById";
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
  const { invoice: existingInvoice, isPending: loadingInvoice } =
    useGetInvoiceById(params.invoiceId as string);

  const isLoadingInvoice = state.invoiceId ? loadingInvoice : false;

  const formLoading =
    gettingBusinessDetails || gettingPaymentAccounts || isLoadingInvoice;

  // // Auto-save functionality
  // const { isAutoSaving } = useInvoiceAutoSave({
  //   state,
  //   hasInitialized,
  //   formLoading,
  //   dispatch,
  // });

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
      // Load invoice items from the existing invoice
      let loadedItems: {
        description?: string;
        quantity?: number;
        unitPrice?: number;
      }[] = [];

      if (
        existingInvoice.invoiceItems &&
        Array.isArray(existingInvoice.invoiceItems) &&
        existingInvoice.invoiceItems.length > 0
      ) {
        loadedItems = existingInvoice.invoiceItems.map(
          (item: {
            description?: string;
            quantity?: number;
            unitPrice?: number;
            total?: number;
          }) => ({
            description: item.description || "",
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice) || 0,
          })
        );
      } else {
        // Ensure at least one empty item exists if no items are loaded from the database
        loadedItems = [
          {
            description: "",
            quantity: 1,
            unitPrice: 0,
          },
        ];
      }

      // Use the new action to load all data at once without triggering unsaved changes
      dispatch({
        type: "LOAD_EXISTING_INVOICE",
        payload: {
          client: existingInvoice.client,
          invoiceNumber: existingInvoice.invoiceNumber || "",
          invoiceDate: existingInvoice.invoiceDate,
          paymentDueDate: existingInvoice.paymentDueDate,
          taxes: existingInvoice.taxes || 0,
          discount: existingInvoice.discount,
          isFavorite: existingInvoice.isFavorite,
          invoiceItems: loadedItems,
          acceptedPaymentMethods: existingInvoice.acceptedPaymentMethods,
        },
      });

      // Set the form as clean after loading
      dispatch({ type: "SET_UNSAVED_CHANGES", payload: false });
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

      toggleIsFavorite: () => {
        dispatch({ type: "SET_IS_FAVORITE" });
      },

      setInvoiceStatus: (
        status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
      ) => {
        dispatch({ type: "SET_INVOICE_STATUS", payload: status });
      },

      setUnsavedChanges: (hasChanges: boolean) => {
        dispatch({ type: "SET_UNSAVED_CHANGES", payload: hasChanges });
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

  console.log("Invoice Form Logic State:", state);

  return {
    formLoading,
    actionHandlers,
    validationMethods,
  };
}
