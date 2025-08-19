import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { TaxType, DiscountType, InvoiceStatus } from "@prisma/client";
import {
  InvoiceFormState,
  InvoiceFormAction,
  FormMode,
  ViewMode,
  InvoiceValidationResult,
} from "../types/invoiceForm";
import { useUserAndBusiness } from "./useUserAndBusiness";
import { useGetPaymentAccounts } from "@/features/payments/hooks/useGetPaymentAccounts";
import { useGetInvoiceById } from "./useGetInvoiceById";
import { getInvoiceItemErrors } from "../utils";

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
        loadedItems = existingInvoice.invoiceItems.map((item) => {
          // Type assertion for JsonValue to expected item structure
          const typedItem = item as {
            description?: string;
            quantity?: number;
            unitPrice?: number;
            total?: number;
          };

          return {
            description: typedItem.description || "",
            quantity: Number(typedItem.quantity) || 1,
            unitPrice: Number(typedItem.unitPrice) || 0,
          };
        });
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
          clientId: existingInvoice.clientId,
          invoiceNumber: existingInvoice.invoiceNumber || "",
          invoiceDate: existingInvoice.invoiceDate || new Date(),
          paymentDueDate: existingInvoice.paymentDueDate || new Date(),
          tax: existingInvoice.tax || 0,
          taxType: existingInvoice.taxType,
          discount: existingInvoice.discount,
          discountType: existingInvoice.discountType,
          isFavorite: existingInvoice.isFavorite,
          invoiceItems: loadedItems,
          lateFeeTerms: existingInvoice.lateFeeTerms || undefined,
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

      setClientId: (clientId: string | null) => {
        dispatch({ type: "SET_CLIENT_ID", payload: clientId });
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

      setLateFeeTerms: (terms: string) => {
        dispatch({ type: "SET_LATE_FEE_TERMS", payload: terms });
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

      setTaxType: (type: TaxType) => {
        dispatch({ type: "SET_TAX_TYPE", payload: type });
      },

      setDiscountType: (type: DiscountType) => {
        dispatch({ type: "SET_DISCOUNT_TYPE", payload: type });
      },

      toggleIsFavorite: () => {
        dispatch({ type: "SET_IS_FAVORITE" });
      },

      setInvoiceStatus: (status: InvoiceStatus) => {
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
      getValidationErrors: () => getInvoiceItemErrors(state),
      setValidationErrors: (validation: InvoiceValidationResult) => {
        dispatch({ type: "SET_VALIDATION", payload: validation });
      },
    }),
    [state, dispatch]
  );

  console.log("Invoice Form Logic State:", state);

  return {
    formLoading,
    actionHandlers,
    validationMethods,
  };
}
