import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  useUpdateBusiness,
  useUserWithBusiness,
} from "@/features/business/hooks";
import { editableBusinessSchema, EditableBusinessData } from "../validation";

export function useBusinessForm() {
  const { data: userWithBusiness } = useUserWithBusiness();
  const { updateBusinessAsync, isLoading: isUpdatingBusiness } =
    useUpdateBusiness();

  const form = useForm<EditableBusinessData>({
    resolver: zodResolver(editableBusinessSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
    },
  });

  // Reset form when data loads
  useEffect(() => {
    if (userWithBusiness?.business) {
      form.reset({
        addressLine1: userWithBusiness.business.addressLine1 || "",
        addressLine2: userWithBusiness.business.addressLine2 || "",
        city: userWithBusiness.business.city || "",
        state: userWithBusiness.business.state || "",
        zipCode: userWithBusiness.business.zipCode || "",
        phone: userWithBusiness.business.phone || "",
      });
    }
  }, [userWithBusiness?.business, form]);

  const resetToOriginalValues = () => {
    if (userWithBusiness?.business) {
      form.reset({
        addressLine1: userWithBusiness.business.addressLine1 || "",
        addressLine2: userWithBusiness.business.addressLine2 || "",
        city: userWithBusiness.business.city || "",
        state: userWithBusiness.business.state || "",
        zipCode: userWithBusiness.business.zipCode || "",
        phone: userWithBusiness.business.phone || "",
      });
    }
  };

  const handleSaveBusiness = async (
    data: EditableBusinessData,
    onSuccess: () => void,
    onError: () => void
  ) => {
    if (!userWithBusiness?.business?.id) {
      toast.error("Business information not found");
      return;
    }

    // Close modal immediately for better UX
    onSuccess();

    try {
      await updateBusinessAsync({
        businessId: userWithBusiness.business.id,
        data: {
          ...data,
          // Keep existing required fields
          businessName: userWithBusiness.business.businessName,
          email: userWithBusiness.business.email,
        },
      });

      toast.success("Business details updated successfully");
    } catch (error) {
      toast.error("Failed to update business details");
      // Reopen modal on error so user can try again
      onError();
    }
  };

  return {
    form,
    isUpdatingBusiness,
    resetToOriginalValues,
    handleSaveBusiness,
  };
}
