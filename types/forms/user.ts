import { UpdateUserInput, ChangePasswordInput } from "../schemas/user";

// React Hook Form state types for user management
export interface UserUpdateFormState {
  isSubmitting: boolean;
  error: string | null;
  data: UpdateUserInput | null;
}

export interface PasswordChangeFormState {
  isSubmitting: boolean;
  error: string | null;
  data: ChangePasswordInput | null;
}

// User form validation states
export interface UserFormErrors {
  name?: { message: string };
  country?: { message: string };
  currency?: { message: string };
  signature?: { message: string };
}

export interface PasswordFormErrors {
  currentPassword?: { message: string };
  newPassword?: { message: string };
  confirmPassword?: { message: string };
}
