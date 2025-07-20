"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, ArrowLeft, Building2, InfoIcon } from "lucide-react";
import { useOnboardingState } from "../../context/OnboardingStateContext";
import { useOnboardingActions as useOnboardingActionsContext } from "../../context/OnboardingActionsContext";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BusinessFormValues } from "@/types/business";
import { createBusinessApiSchema } from "@/dataSchemas/business/creation";

function Step4() {
  const state = useOnboardingState();
  const { nextStep, previousStep, setBusinessInfo } =
    useOnboardingActionsContext();
  const { user } = useUser();
  const initializedRef = useRef(false);
  const initialBusinessInfoRef = useRef<BusinessFormValues | undefined>(
    undefined
  );

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(createBusinessApiSchema),
    defaultValues: {
      businessName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: user?.email || "",
    },
  });

  // Update email when user data loads
  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
    }
  }, [user?.email, form]);

  // Load saved business info - only once on mount
  useEffect(() => {
    if (!initializedRef.current) {
      // Store the initial business info value
      initialBusinessInfoRef.current = state.businessInfo;

      if (initialBusinessInfoRef.current) {
        Object.keys(initialBusinessInfoRef.current).forEach((key) => {
          form.setValue(
            key as keyof BusinessFormValues,
            initialBusinessInfoRef.current![key as keyof BusinessFormValues]
          );
        });
      }
      initializedRef.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContinue = (values: BusinessFormValues) => {
    setBusinessInfo(values);
    nextStep();
  };

  // Watch business name to enable/disable button
  const businessName = form.watch("businessName");
  const canContinue = businessName?.trim().length > 0;

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="w-full text-center space-y-4 sm:space-y-5">
        {/* Header with enhanced icon */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-3 sm:mb-4 shadow-lg shadow-blue-100/50">
            <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Tell Us About Your Business
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              This info will appear on your invoices, so your clients know
              exactly who they&apos;re paying.
            </p>
          </div>
        </div>

        {/* Main content with enhanced styling */}
        <div className="space-y-4 sm:space-y-5">
          {/* Form */}
          <TooltipProvider>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleContinue)}
                className="space-y-3 sm:space-y-4 max-w-2xl mx-auto text-left"
              >
                {/* Business Name - Enhanced styling */}
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Business/Your Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your business or full name"
                          {...field}
                          className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:shadow-lg focus-visible:shadow-blue-200/50 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Line 1 */}
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Address Line 1
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street address"
                          {...field}
                          className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:shadow-lg focus-visible:shadow-cyan-200/50 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Line 2 */}
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Address Line 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apartment, suite, etc."
                          {...field}
                          className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:shadow-lg focus-visible:shadow-cyan-200/50 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City and State Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City"
                            {...field}
                            className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:shadow-lg focus-visible:shadow-blue-200/50 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          State/Province
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="State"
                            {...field}
                            className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:shadow-lg focus-visible:shadow-blue-200/50 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ZIP and Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          ZIP/Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ZIP or postal code"
                            {...field}
                            className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:shadow-lg focus-visible:shadow-cyan-200/50 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone number"
                            {...field}
                            className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:shadow-lg focus-visible:shadow-cyan-200/50 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Email
                        </FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-blue-500 hover:text-blue-600 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-white border-2 border-blue-100 shadow-xl rounded-lg">
                            <p className="text-sm text-gray-600">
                              This is your account email and cannot be changed.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Your account email"
                          {...field}
                          disabled={true}
                          className="h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border-2 border-gray-200 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </TooltipProvider>
        </div>

        {/* Action Buttons with enhanced styling */}
        <div className="space-y-3 pt-2 sm:pt-3">
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Button
              onClick={previousStep}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 font-medium border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 group transition-all duration-300 text-sm sm:text-base rounded-xl"
            >
              <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>

            <Button
              onClick={form.handleSubmit(handleContinue)}
              disabled={!canContinue}
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white font-semibold transition-all duration-300 group text-sm sm:text-base rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              Save Business Info
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step4;
