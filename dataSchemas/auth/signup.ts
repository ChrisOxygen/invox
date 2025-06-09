import { z } from "zod";
import { commonFields } from "../base/common";

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
