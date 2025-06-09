import { SignupFormInput, LoginFormInput } from "../schemas/auth";

// React Hook Form state types
export interface AuthFormState {
  isSubmitting: boolean;
  error: string | null;
}

export interface SignupFormState extends AuthFormState {
  data: SignupFormInput | null;
}

export interface LoginFormState extends AuthFormState {
  data: LoginFormInput | null;
}

// Form field validation states
export interface FieldError {
  message: string;
  type?: string;
}

export interface AuthFormErrors {
  name?: FieldError;
  email?: FieldError;
  password?: FieldError;
  confirmPassword?: FieldError;
}
