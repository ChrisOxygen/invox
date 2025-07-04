import { addDays, addMonths, endOfMonth, startOfDay } from "date-fns";

export const calculateDueDate = (
  preset: string,
  baseDate: Date = new Date()
): Date => {
  const base = startOfDay(baseDate);

  switch (preset) {
    case "net_15":
      return addDays(base, 15);
    case "net_30":
      return addDays(base, 30);
    case "net_45":
      return addDays(base, 45);
    case "net_60":
      return addDays(base, 60);
    case "due_on_receipt":
      return base;
    case "due_end_of_month":
      return endOfMonth(base);
    case "due_end_of_next_month":
      return endOfMonth(addMonths(base, 1));
    default:
      return base;
  }
};

export function toDollar(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Advanced greeting function with time-based greetings
export function generateTimeBasedGreeting(): string {
  const currentHour = new Date().getHours();

  let timeGreeting: string;

  if (currentHour < 12) {
    timeGreeting = "Good morning";
  } else if (currentHour < 17) {
    timeGreeting = "Good afternoon";
  } else {
    timeGreeting = "Good evening";
  }

  return `${timeGreeting}`;
}
