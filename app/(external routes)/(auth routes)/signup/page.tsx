"use client";

import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import InBoxLoader from "@/components/InBoxLoader";
import useSocialSignIn from "@/hooks/useSocialSignIn";
import { signUpFormSchema } from "@/formSchemas";
import { useCredentialSignup } from "@/hooks/useCredentialSignup";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: signInWithProvider, isPending: isSocialSignInPending } =
    useSocialSignIn();

  // Use the custom signup hook
  const {
    mutate: signUpWithCredentials,
    isPending: isSignupPending,
    error,
    reset,
  } = useCredentialSignup();

  // Initialize form
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    // Reset any previous errors
    reset();

    // Trigger the signup mutation
    signUpWithCredentials(values);
  };

  // Show loading state while processing
  if (isSignupPending || isSocialSignInPending) {
    return <InBoxLoader />;
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="h-full rounded-lg bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-space-grotesk text-4xl font-bold text-black tracking-tight">
            Create account
          </h1>
          <p className="font-inter text-base text-gray-600">
            Start creating professional invoices today
          </p>
        </div>

        {/* Social Login Options */}
        <div className="mb-8 space-y-3">
          <Button
            onClick={() => signInWithProvider("google")}
            disabled={isSocialSignInPending}
            variant="outline"
            className="w-full h-12 font-inter font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
          >
            <FaGoogle className="mr-3 text-lg" />
            Continue with Google
          </Button>
          <Button
            onClick={() => signInWithProvider("github")}
            disabled={isSocialSignInPending}
            variant="outline"
            className="w-full h-12 font-inter font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
          >
            <FaGithub className="mr-3 text-lg" />
            Continue with GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="mb-8 flex items-center">
          <Separator className="flex-1 bg-gray-200" />
          <span className="px-4 text-sm font-inter text-gray-500">
            or continue with email
          </span>
          <Separator className="flex-1 bg-gray-200" />
        </div>

        {/* Sign-up Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 font-inter text-sm text-red-800">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter font-medium text-black">
                    Full name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      {...field}
                      className="h-12 font-inter border-gray-300 focus:border-black focus:ring-black"
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
                  <FormLabel className="font-inter font-medium text-black">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="h-12 font-inter border-gray-300 focus:border-black focus:ring-black"
                    />
                  </FormControl>
                  <FormMessage className="font-inter" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter font-medium text-black">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        {...field}
                        className="h-12 font-inter border-gray-300 focus:border-black focus:ring-black pr-12"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage className="font-inter" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter font-medium text-black">
                    Confirm password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                        className="h-12 font-inter border-gray-300 focus:border-black focus:ring-black pr-12"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage className="font-inter" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSignupPending}
              className="w-full h-12 bg-black text-white font-inter font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {isSignupPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        {/* Sign in link */}
        <p className="mt-8 text-center font-inter text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black hover:text-gray-700 transition-colors cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
