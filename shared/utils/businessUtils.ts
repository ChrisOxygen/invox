import { BusinessFormData } from "@/shared/types";

/**
 * Formats business address into a readable string
 */
export function formatBusinessAddress(
  business: Partial<BusinessFormData>
): string {
  const parts: string[] = [];

  if (business.addressLine1) parts.push(business.addressLine1);
  if (business.addressLine2) parts.push(business.addressLine2);

  const cityStateZip = [business.city, business.state, business.zipCode]
    .filter(Boolean)
    .join(", ");

  if (cityStateZip) parts.push(cityStateZip);

  return parts.join("\n");
}

/**
 * Checks if business address is complete
 */
export function isBusinessAddressComplete(
  business: Partial<BusinessFormData>
): boolean {
  return !!(
    business.addressLine1 &&
    business.city &&
    business.state &&
    business.zipCode
  );
}

/**
 * Gets business display name (fallback to email if no business name)
 */
export function getBusinessDisplayName(
  business: Partial<BusinessFormData>
): string {
  return business.businessName || business.email || "Unknown Business";
}

/**
 * Validates business email format
 */
export function isValidBusinessEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Return original if not standard format
  return phone;
}
