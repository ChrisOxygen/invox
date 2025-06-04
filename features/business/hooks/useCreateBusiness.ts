import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusiness } from "../actions";

interface CreateBusinessResult {
  success: boolean;
  message: string;
  business?: {
    id: string;
    businessName: string;
    address: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

interface CreateBusinessData {
  userId: string;
  businessName: string;
  address: string;
  email: string;
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateBusinessResult, Error, CreateBusinessData>(
    {
      mutationFn: async ({ userId, businessName, address, email }) => {
        const result = await createBusiness(
          userId,
          businessName,
          address,
          email
        );

        if (!result.success) {
          throw new Error(result.message);
        }

        return result;
      },

      onSuccess: (data) => {
        console.log("Business created successfully:", data.business);

        // Invalidate and refetch business queries to update the UI
        queryClient.invalidateQueries({
          queryKey: ["business"],
        });
      },

      onError: (error) => {
        console.error("Failed to create business:", error);
      },
    }
  );

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
    data: mutation.data,
    reset: mutation.reset,
  };
}
