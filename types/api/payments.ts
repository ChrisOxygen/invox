import {
  CreatePaymentAccountInput,
  UpdatePaymentAccountInput,
} from "../schemas/payments";

// Payment API request interfaces
export type CreatePaymentAccountRequest = CreatePaymentAccountInput;

export type UpdatePaymentAccountRequest = UpdatePaymentAccountInput & {
  accountId: string;
};

export interface DeletePaymentAccountRequest {
  accountId: string;
}

export interface SetDefaultPaymentAccountRequest {
  accountId: string;
}

// Payment account response data
export interface PaymentAccountData {
  id: string;
  userId: string;
  gatewayType: string;
  accountName: string;
  accountData: Record<string, unknown>;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
