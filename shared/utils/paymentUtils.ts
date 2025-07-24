import { PaymentAccountData, PaymentMethodType } from "@/shared/types";

/**
 * Gets payment method display name
 */
export function getPaymentMethodDisplayName(type: PaymentMethodType): string {
  const displayNames: Record<PaymentMethodType, string> = {
    stripe: "Stripe",
    paypal: "PayPal",
    bank: "Bank Transfer",
  };

  return displayNames[type] || type;
}

/**
 * Gets payment method icon/emoji
 */
export function getPaymentMethodIcon(type: PaymentMethodType): string {
  const icons: Record<PaymentMethodType, string> = {
    stripe: "💳",
    paypal: "🅿️",
    bank: "🏦",
  };

  return icons[type] || "💰";
}

/**
 * Checks if payment account is properly configured
 */
export function isPaymentAccountConfigured(
  account: PaymentAccountData
): boolean {
  if (!account.accountName || !account.accountData) {
    return false;
  }

  // Check gateway-specific required fields
  switch (account.gatewayType) {
    case "stripe":
      return !!(account.accountData.publicKey && account.accountData.secretKey);
    case "paypal":
      return !!(
        account.accountData.clientId && account.accountData.clientSecret
      );
    case "bank":
      return !!(
        account.accountData.accountName &&
        account.accountData.accountNumber &&
        account.accountData.routingNumber
      );
    default:
      return Object.keys(account.accountData).length > 0;
  }
}

/**
 * Masks sensitive payment account data for display
 */
export function maskSensitiveData(key: string, value: string): string {
  const sensitiveKeys = ["secret", "key", "password", "token"];
  const isSensitive = sensitiveKeys.some((sensitive) =>
    key.toLowerCase().includes(sensitive)
  );

  if (isSensitive) {
    return "••••••••••••••••••••••••••••••";
  }

  return value;
}

/**
 * Gets required fields for a payment gateway type
 */
export function getRequiredPaymentFields(type: PaymentMethodType): string[] {
  const requiredFields: Record<PaymentMethodType, string[]> = {
    stripe: ["publicKey", "secretKey"],
    paypal: ["clientId", "clientSecret", "environment"],
    bank: ["accountName", "accountNumber", "routingNumber", "bankName"],
  };

  return requiredFields[type] || [];
}

/**
 * Validates payment account data completeness
 */
export function validatePaymentAccountData(
  type: PaymentMethodType,
  accountData: Record<string, string>
): { isValid: boolean; missingFields: string[] } {
  const requiredFields = getRequiredPaymentFields(type);
  const missingFields = requiredFields.filter((field) => !accountData[field]);

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
