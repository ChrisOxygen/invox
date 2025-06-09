import { z } from "zod";

// Shared validation rules and utilities
export const validationRules = {
  // Text length constraints
  shortText: { min: 2, max: 50 },
  mediumText: { min: 2, max: 100 },
  longText: { min: 10, max: 1000 },

  // Numeric constraints
  currency: { min: 0, max: 999999.99 },
  percentage: { min: 0, max: 100 },

  // Regular expressions
  phoneRegex: /^[\+]?[1-9][\d]{0,15}$/,
  zipCodeRegex: /^[0-9]{5}(-[0-9]{4})?$/,
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
};

// Custom validation helpers
export const createOptionalString = (maxLength: number, message?: string) =>
  z
    .string()
    .max(maxLength, message || `Must not exceed ${maxLength} characters`)
    .optional()
    .or(z.literal(""));

export const createRequiredString = (
  minLength: number,
  maxLength: number,
  fieldName: string
) =>
  z
    .string()
    .min(minLength, `${fieldName} must be at least ${minLength} characters`)
    .max(maxLength, `${fieldName} must not exceed ${maxLength} characters`);

export const createOptionalNumber = () =>
  z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid number")
    .optional()
    .or(z.literal(""));

// Common transformations
export const trimString = z.string().transform((val) => val.trim());
export const normalizeEmail = z
  .string()
  .email()
  .transform((val) => val.toLowerCase().trim());
