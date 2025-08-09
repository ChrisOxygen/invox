import { ZSignupFormInput, ZLoginFormInput } from "../validation/authSchemas";

// Legacy types for backward compatibility (use Z-prefixed types for new code)
export type SignupFormInput = ZSignupFormInput;
export type LoginFormInput = ZLoginFormInput;
export type SignupApiInput = Omit<ZSignupFormInput, "confirmPassword">;

// React Hook Form state types
export interface AuthFormState {
  isSubmitting: boolean;
  error: string | null;
}

export interface SignupFormState extends AuthFormState {
  data: ZSignupFormInput | null;
}

export interface LoginFormState extends AuthFormState {
  data: ZLoginFormInput | null;
}

// Form field validation states
export interface FieldError {
  message: string;
  type?: string;
}

export interface FieldValidation {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: unknown) => boolean | string;
}

// Auth provider types
export interface AuthProvider {
  id: string;
  name: string;
  type: "oauth" | "credentials";
}

export interface SocialSignInOptions {
  provider: string;
  callbackUrl?: string;
  redirect?: boolean;
}
