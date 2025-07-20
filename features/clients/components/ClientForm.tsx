"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client } from "@prisma/client";
import { showSuccessToast, showErrorToast } from "@/components/toast-templates";

import AppDialog from "@/components/AppDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCreateClient, useUpdateClient } from "@/features/clients/hooks";
import { createClientSchema, updateClientSchema } from "@/dataSchemas/client";
import { CreateClientInput, UpdateClientInput } from "@/types/schemas/client";
import { Building2, Mail, User, MapPin, Loader2 } from "lucide-react";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  onSuccess?: (client: Client) => void;
  mode?: "create" | "edit";
}

export function ClientForm({
  open,
  onOpenChange,
  client = null,
  onSuccess,
  mode = "create",
}: ClientFormProps) {
  const isEditing = mode === "edit" && client;

  // Hooks
  const createClient = useCreateClient({
    onSuccess: (data) => {
      showSuccessToast(
        "Client Created",
        "Client has been created successfully!"
      );
      onSuccess?.(data);
      handleClose();
    },
    onError: (error) => {
      showErrorToast("Creation Failed", error.message);
    },
  });

  const updateClient = useUpdateClient({
    onSuccess: (data) => {
      showSuccessToast(
        "Client Updated",
        "Client information has been updated successfully!"
      );
      onSuccess?.(data);
      handleClose();
    },
    onError: (error) => {
      showErrorToast("Update Failed", error.message);
    },
  });

  // Form setup
  const form = useForm<CreateClientInput | UpdateClientInput>({
    resolver: zodResolver(isEditing ? updateClientSchema : createClientSchema),
    defaultValues: {
      BusinessName: client?.BusinessName || "",
      contactPersonName: client?.contactPersonName || "",
      address: client?.address || "",
      email: client?.email || "",
    },
  });

  // Reset form when client changes or dialog opens/closes
  React.useEffect(() => {
    if (open) {
      form.reset({
        BusinessName: client?.BusinessName || "",
        contactPersonName: client?.contactPersonName || "",
        address: client?.address || "",
        email: client?.email || "",
      });
    }
  }, [open, client, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: CreateClientInput | UpdateClientInput) => {
    try {
      if (isEditing && client) {
        await updateClient.updateClientAsync({
          ...data,
          clientId: client.id,
        });
      } else {
        await createClient.createClientAsync(data as CreateClientInput);
      }
    } catch (error) {
      // Error handling is done in the hooks
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createClient.isPending || updateClient.isPending;

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Client" : "Add New Client"}
      description={
        isEditing
          ? "Update the client information below."
          : "Fill in the details to create a new client."
      }
      maxWidth="md"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="client-form"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white border-0 shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Update Client"
            ) : (
              "Create Client"
            )}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form
          id="client-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Business Name */}
          <FormField
            control={form.control}
            name="BusinessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Business Name *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter business name"
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          {/* Contact Person Name */}
          <FormField
            control={form.control}
            name="contactPersonName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Contact Person Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter contact person name"
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Address
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter business address"
                    disabled={isLoading}
                    rows={3}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </AppDialog>
  );
}

export default ClientForm;
