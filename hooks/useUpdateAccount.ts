import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAccount } from "@/lib/actions";
import { toast } from "sonner";

type UpdateAccountData = {
  fullName?: string;
  imageUrl?: string;
};

type UpdateAccountResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    fullName?: string | null;
    image?: string | null;
  };
};

/**
 * Hook for updating user account information using the server action
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateAccountData,
    ): Promise<UpdateAccountResponse> => {
      const result = await updateUserAccount(data);
      return result;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Show success message
        toast.success(data.message || "Account updated successfully");

        // Invalidate the user query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        // Show error message if the server action returned an error
        toast.error(data.message || "Failed to update account");
      }
    },
    onError: (error) => {
      // Handle unexpected errors
      console.error("Error updating account:", error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });
}

export default useUpdateAccount;
