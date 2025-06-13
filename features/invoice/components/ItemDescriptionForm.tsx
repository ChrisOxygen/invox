"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const customDescriptionSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must not exceed 200 characters")
    .trim(),
});

type CustomDescriptionFormData = z.infer<typeof customDescriptionSchema>;

interface ItemDescriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (description: string) => void;
  mode: "create";
  initialData?: {
    description: string;
  };
}

export function ItemDescriptionForm({
  open,
  onOpenChange,
  onSuccess,
  mode,
  initialData,
}: ItemDescriptionFormProps) {
  const form = useForm<CustomDescriptionFormData>({
    resolver: zodResolver(customDescriptionSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: CustomDescriptionFormData) => {
    try {
      // Simply return the description as it's just a custom text input
      onSuccess?.(data.description);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error adding custom description:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Custom Description" : "Edit Description"}
          </DialogTitle>
          <DialogDescription>
            Enter a custom description for your invoice item.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter item description..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Description"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
