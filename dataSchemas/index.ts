import { z } from "zod";

// Re-export commonly used schemas for backward compatibility
export { signupFormSchema } from "./auth/signup";
export { loginFormSchema } from "./auth/login";
export { businessFormSchema } from "./business/profile";

// Re-export new structured schemas
export * from "./auth";
export * from "./business";
export * from "./payments";
export * from "./base";
export * from "./invoice";

// User management schemas
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters")
      .optional(),

    country: z
      .string()
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country must not exceed 50 characters")
      .optional(),

    currency: z
      .string()
      .length(3, "Currency must be a 3-letter code (e.g., USD, EUR)")
      .regex(/^[A-Z]{3}$/, "Currency must be uppercase letters only")
      .optional(),

    signature: z
      .string()
      .max(500, "Signature must not exceed 500 characters")
      .optional(),

    onboardingCompleted: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Additional schema for password change validation
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "New password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),

    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
