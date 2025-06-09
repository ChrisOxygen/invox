import { z } from "zod";
import { signupFormSchema, loginFormSchema } from "@/dataSchemas/auth";

// Auth form schema-derived types
export type SignupFormInput = z.infer<typeof signupFormSchema>;
export type LoginFormInput = z.infer<typeof loginFormSchema>;

// Remove confirmPassword for API requests
export type SignupApiInput = Omit<SignupFormInput, "confirmPassword">;
