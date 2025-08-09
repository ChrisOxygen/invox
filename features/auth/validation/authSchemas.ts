import { z } from "zod";
import { commonFields } from "@/dataSchemas/base/common";

// Signup form validation schema (includes confirmPassword)
export const signupFormSchema = z
  .object({
    name: commonFields.name,
    email: commonFields.email,
    password: commonFields.password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Signup API request schema (no confirmPassword)
export const signupApiSchema = z.object({
  name: commonFields.name,
  email: commonFields.email,
  password: commonFields.password,
});

// Login form validation schema
export const loginFormSchema = z.object({
  email: commonFields.email,
  password: z.string().min(1, "Password is required"),
});

// Login API request schema (more strict)
export const loginApiSchema = z.object({
  email: commonFields.email,
  password: commonFields.password,
});

// Export the inferred types with Z prefix
export type ZSignupFormInput = z.infer<typeof signupFormSchema>;
export type ZLoginFormInput = z.infer<typeof loginFormSchema>;
export type ZSignupApiInput = z.infer<typeof signupApiSchema>;
export type ZLoginApiInput = z.infer<typeof loginApiSchema>;
