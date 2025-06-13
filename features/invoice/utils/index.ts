/**
 * Generates a unique invoice number with format INV-XXXXXX
 * Uses current timestamp to ensure uniqueness
 * @returns {string} Invoice number in format INV-XXXXXX (6 digits)
 */
export function generateInvoiceNumber(): string {
  const now = new Date();

  // Get milliseconds since epoch and take modulo to get 6 digits
  const timestamp = now.getTime();

  // Take last 6 digits and ensure it's always 6 digits
  const uniqueNumber = (timestamp % 1000000).toString().padStart(6, "0");

  return `INV-${uniqueNumber}`;
}
