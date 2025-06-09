import { useEffect } from "react";
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
import { useOnboarding } from "../../context/OnboardingProvider";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BusinessFormValues } from "@/types";
import { businessFormSchema } from "@/dataSchemas";

function Step4() {
  const { nextStep, state, previousStep, setBusinessInfo } = useOnboarding();
  const { user } = useUser();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
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

  // Update useEffect to load saved business info
  useEffect(() => {
    if (state.businessInfo) {
      Object.keys(state.businessInfo).forEach((key) => {
        form.setValue(
          key as keyof BusinessFormValues,
          state.businessInfo![key as keyof BusinessFormValues]
        );
      });
    }
  }, [state.businessInfo, form]);

  const handleContinue = (values: BusinessFormValues) => {
    setBusinessInfo(values);
    nextStep();
  };

  // Watch business name to enable/disable button
  const businessName = form.watch("businessName");
  const canContinue = businessName?.trim().length > 0;

  return (
    <div className="flex w-full max-w-[90vw] sm:max-w-[600px] flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
            <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
          </div>

          <h1 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight px-2">
            Tell Us About
            <br />
            Your Business
          </h1>

          <p className="font-inter text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto px-4 sm:px-2">
            This info will appear on your invoices, so your clients know exactly
            who they&apos;re paying.
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Form */}
          <TooltipProvider>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleContinue)}
                className="space-y-4 max-w-md mx-auto text-left px-2"
              >
                {/* Business Name */}
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter text-sm font-medium text-gray-700">
                        Business/Your Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your business or full name"
                          {...field}
                          className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="font-inter" />
                    </FormItem>
                  )}
                />

                {/* Address Line 1 */}
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter text-sm font-medium text-gray-700">
                        Address Line 1
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street address"
                          {...field}
                          className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="font-inter" />
                    </FormItem>
                  )}
                />

                {/* Address Line 2 */}
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter text-sm font-medium text-gray-700">
                        Address Line 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apartment, suite, etc."
                          {...field}
                          className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="font-inter" />
                    </FormItem>
                  )}
                />

                {/* City and State Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter text-sm font-medium text-gray-700">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City"
                            {...field}
                            className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage className="font-inter" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter text-sm font-medium text-gray-700">
                          State/Province
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="State"
                            {...field}
                            className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage className="font-inter" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ZIP Code */}
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter text-sm font-medium text-gray-700">
                        ZIP/Postal Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ZIP or postal code"
                          {...field}
                          className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="font-inter" />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter text-sm font-medium text-gray-700">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone number"
                          {...field}
                          className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="font-inter" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="font-inter text-sm font-medium text-gray-700">
                          Email
                        </FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-inter text-sm">
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
                          className="h-12 sm:h-14 font-inter text-sm sm:text-base bg-gray-50 text-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="font-inter" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </TooltipProvider>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 sm:pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={previousStep}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 font-inter font-medium border-gray-300 text-gray-600 hover:bg-gray-50 group cursor-pointer text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back
            </Button>

            <Button
              onClick={form.handleSubmit(handleContinue)}
              disabled={!canContinue}
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-inter font-medium transition-all duration-200 group cursor-pointer text-sm sm:text-base"
            >
              Save Business Info
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step4;
