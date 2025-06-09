import { BusinessFormInput, CreateBusinessApiInput } from "../schemas/business";

// React Hook Form state types for business
export interface BusinessFormState {
  isSubmitting: boolean;
  error: string | null;
  data: BusinessFormInput | null;
}

export interface CreateBusinessFormState {
  isSubmitting: boolean;
  error: string | null;
  data: CreateBusinessApiInput | null;
}

// Business form validation states
export interface BusinessFormErrors {
  businessName?: { message: string };
  email?: { message: string };
  addressLine1?: { message: string };
  addressLine2?: { message: string };
  city?: { message: string };
  state?: { message: string };
  zipCode?: { message: string };
  phone?: { message: string };
  businessType?: { message: string };
}
