import { ReactNode } from "react";

// Shared form-related types
export interface BaseFormProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export interface FormWithActions extends BaseFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T = any> {
  data: T;
  errors: FormFieldError[];
  isValid: boolean;
  isDirty: boolean;
}

export interface FormStepProps {
  isActive: boolean;
  isCompleted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
}

export interface FormSelectProps extends FormFieldProps {
  options: Array<{ label: string; value: string }>;
  multiple?: boolean;
}

export interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footerActions?: ReactNode;
}

export interface FormWizardStep {
  id: string;
  title: string;
  description?: string;
  component: ReactNode;
  isValid: boolean;
  isOptional?: boolean;
}
