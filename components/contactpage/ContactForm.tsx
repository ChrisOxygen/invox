"use client";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // TODO: Implement form submission logic
    console.log("Form submitted:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset form after submission
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 lg:max-w-xl w-full">
      <div className="bg-gray-50/50 p-8 border border-gray-200/60 rounded-2xl">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Send us a message
          </h3>
          <p className="text-gray-600">
            Fill out the form below and we&apos;ll get back to you soon.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="w-full h-11 px-4 border-2 border-blue-200 hover:border-blue-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:outline-none transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full h-11 px-4 border-2 border-blue-200 hover:border-blue-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:outline-none transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Subject *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's this about?"
                      className="w-full h-11 px-4 border-2 border-blue-200 hover:border-blue-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:outline-none transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Message *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your inquiry..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-blue-200 hover:border-blue-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:outline-none transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg border-0 shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-300 transform hover:scale-105 disabled:scale-100 text-base h-12"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Message"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our Privacy Policy and Terms
              of Service.
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
