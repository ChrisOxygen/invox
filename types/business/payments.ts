export type PaymentMethod =
  | "paypal"
  | "ach"
  | "nigerian_bank"
  | "wise"
  | "bank_transfer";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface PaymentAccount {
  id: string;
  type: PaymentMethod;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayPalAccount extends PaymentAccount {
  type: "paypal";
  email: string;
}

export interface ACHAccount extends PaymentAccount {
  type: "ach";
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  bankName: string;
}

export interface NigerianBankAccount extends PaymentAccount {
  type: "nigerian_bank";
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
}

export interface WiseAccount extends PaymentAccount {
  type: "wise";
  email: string;
  accountNumber?: string;
}

export interface BankTransferAccount extends PaymentAccount {
  type: "bank_transfer";
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountHolderName: string;
  swiftCode?: string;
}

export type Gateway =
  | PayPalAccount
  | ACHAccount
  | NigerianBankAccount
  | WiseAccount
  | BankTransferAccount;

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  gatewayId: string;
  invoiceId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentSettings {
  defaultMethod?: PaymentMethod;
  autoCapture: boolean;
  sendReceipts: boolean;
  allowPartialPayments: boolean;
  lateFeePercentage?: number;
  gracePeriodDays?: number;
}
