"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useCreateBusiness } from "../hooks/useCreateBusiness";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const businessFormSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function CreateBusinessForm() {
  const router = useRouter();
  const { user } = useUser();
  const { mutate: createBusiness, isPending, error } = useCreateBusiness();

  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: "",
      address: "",
      email: "",
    },
  });

  // Update email field when user data is available
  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
    }
  }, [user?.email, form]);

  const onSubmit = (values: z.infer<typeof businessFormSchema>) => {
    if (!user?.id) {
      form.setError("root", {
        message: "User not found. Please try logging in again.",
      });
      return;
    }

    createBusiness(
      {
        userId: user.id,
        businessName: values.businessName,
        address: values.address,
        email: values.email,
      },
      {
        onSuccess: () => {
          router.push("/app/dashboard");
        },
        onError: (error) => {
          form.setError("root", {
            message: error.message || "Failed to create business",
          });
        },
      }
    );
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8 text-center">
        <h2 className="font-space-grotesk text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Create Your Business Profile
        </h2>
        <p className="font-inter text-gray-600 text-sm sm:text-base">
          Set up your business information to start creating professional
          invoices.
        </p>
      </div>

      <TooltipProvider>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {(error || form.formState.errors.root) && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 font-inter">
                {error || form.formState.errors.root?.message}
              </div>
            )}

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter font-medium text-gray-900">
                    Business Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your business name"
                      {...field}
                      className="h-12 font-inter border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="font-inter" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="font-inter font-medium text-gray-900">
                      Business Email
                    </FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-inter text-sm">
                          Your business email is the same as your account email.
                          This ensures all business communications are sent to
                          your verified email address.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your account email"
                      {...field}
                      className="h-12 font-inter border-gray-300 bg-gray-50 text-gray-600"
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage className="font-inter" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter font-medium text-gray-900">
                    Business Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your business address"
                      {...field}
                      className="h-12 font-inter border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="font-inter" />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-gray-900 text-white font-inter font-medium hover:bg-gray-800 transition-colors"
              >
                {isPending ? "Creating..." : "Create Business"}
              </Button>
            </div>
          </form>
        </Form>
      </TooltipProvider>
    </div>
  );
}
