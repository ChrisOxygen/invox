import { FiFileText, FiLayout } from "react-icons/fi";
import { LuPalette } from "react-icons/lu";

// Constants for the invoice feature
export const INVOICE_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
};
export const INVOICE_PAYMENT_METHODS = {
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card",
  PAYPAL: "paypal",
};

// dummy data for invoices
// Invoice dummy data for a freelance agency

export const INVOICE_TABS = [
  {
    title: "Details",
    icon: FiFileText,
  },
  {
    title: "Layout",
    icon: FiLayout,
  },
  {
    title: "Theme",
    icon: LuPalette,
  },
];
