import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "@/components/toast-templates";
import {
  ZCreateClientInput,
  ZUpdateClientInput,
} from "../validation/clientSchemas";

export const useClientsActions = () => {
  const queryClient = useQueryClient();

  const createClientMutation = useMutation({
    mutationFn: async (data: ZCreateClientInput) => {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create client");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      showSuccessToast(
        "Client Created",
        "Client has been created successfully!"
      );
    },
    onError: (error) => {
      showErrorToast(
        "Creation Failed",
        error.message || "Failed to create client"
      );
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ZUpdateClientInput;
    }) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update client");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      showSuccessToast(
        "Client Updated",
        "Client information has been updated successfully!"
      );
    },
    onError: (error) => {
      showErrorToast(
        "Update Failed",
        error.message || "Failed to update client"
      );
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete client");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      showSuccessToast(
        "Client Deleted",
        "Client has been deleted successfully!"
      );
    },
    onError: (error) => {
      showErrorToast(
        "Deletion Failed",
        error.message || "Failed to delete client"
      );
    },
  });

  return {
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
};
