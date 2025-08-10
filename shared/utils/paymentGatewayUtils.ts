import { PaymentGatewayType } from "@prisma/client";
import {
  ZNigerianBankAccountData,
  ZPaypalAccountData,
  ZWiseAccountData,
  ZAchAccountData,
} from "@/shared/validators/payment";

/**
 * Maps payment method string to PaymentGatewayType enum
 */
export function mapPaymentMethodStringToEnum(
  method: string
): PaymentGatewayType | null {
  const methodMap: Record<string, PaymentGatewayType> = {
    "nigerian-bank": PaymentGatewayType.NIGERIAN_BANK,
    paypal: PaymentGatewayType.PAYPAL,
    wise: PaymentGatewayType.WISE,
    "bank-transfer": PaymentGatewayType.BANK_TRANSFER,
    ach: PaymentGatewayType.ACH,
  };

  return methodMap[method] || null;
}

/**
 * Generates account name based on gateway type and account data
 */
export function generateAccountName(
  gatewayType: PaymentGatewayType,
  accountData: Record<string, unknown>
): string {
  switch (gatewayType) {
    case PaymentGatewayType.NIGERIAN_BANK:
      const nigerianData = accountData as ZNigerianBankAccountData;
      return `${nigerianData.bankName} - ${nigerianData.accountName}`;

    case PaymentGatewayType.PAYPAL:
      const paypalData = accountData as ZPaypalAccountData;
      return `PayPal - ${paypalData.email}`;

    case PaymentGatewayType.WISE:
      const wiseData = accountData as ZWiseAccountData;
      return `Wise - ${wiseData.email}`;

    case PaymentGatewayType.ACH:
      const achData = accountData as ZAchAccountData;
      return `${achData.bankName} - ACH`;

    case PaymentGatewayType.BANK_TRANSFER:
      // Handle bank transfer if needed
      return `Bank Transfer - ${accountData.accountHolderName || "Account"}`;

    default:
      return "Payment Account";
  }
}

/**
 * Gets display name for payment gateway type
 */
export function getPaymentGatewayDisplayName(
  gatewayType: PaymentGatewayType
): string {
  const displayNames: Record<PaymentGatewayType, string> = {
    [PaymentGatewayType.NIGERIAN_BANK]: "Nigerian Bank",
    [PaymentGatewayType.PAYPAL]: "PayPal",
    [PaymentGatewayType.WISE]: "Wise",
    [PaymentGatewayType.ACH]: "ACH Transfer",
    [PaymentGatewayType.BANK_TRANSFER]: "Bank Transfer",
  };

  return displayNames[gatewayType] || gatewayType;
}
