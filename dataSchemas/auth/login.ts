import { z } from "zod";
import { commonFields } from "../base/common";

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
