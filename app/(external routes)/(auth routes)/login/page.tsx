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
import { loginFormSchema } from "@/dataSchemas";
import InBoxLoader from "@/components/InBoxLoader";
import { useLogin } from "@/hooks/useLogin";
import useSocialSignIn from "@/hooks/useSocialSignIn";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { signInWithCredentials, isLoading, error } = useLogin();
  const { mutate: signInWithProvider, isPending: isSocialSignInPending } =
    useSocialSignIn();

  // Initialize form
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Show loading state while checking session
  if (form.formState.isSubmitting || isSocialSignInPending) {
    return <InBoxLoader />;
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    // Trigger the login mutation
    signInWithCredentials(values);
  };

  if (error) {
    form.setError("root", {
      message: error,
    });
  }

  // Only show the login form if not authenticated
  return (
    <div className="h-full rounded-lg bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-space-grotesk text-4xl font-bold text-black tracking-tight">
            Welcome back
          </h1>
          <p className="font-inter text-base text-gray-600">
            Sign in to your Invox account
          </p>
        </div>

        {/* Social Login Options */}
        <div className="mb-8 space-y-3">
          <Button
            onClick={() => signInWithProvider("google")}
            disabled={isSocialSignInPending}
            variant="outline"
            className="w-full h-12 font-inter font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            <FaGoogle className="mr-3 text-lg" />
            Continue with Google
          </Button>
          <Button
            onClick={() => signInWithProvider("github")}
            disabled={isSocialSignInPending}
            variant="outline"
            className="w-full h-12 font-inter font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
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

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg font-inter text-sm text-red-600">
                {error}
              </div>
            )}

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
                        placeholder="Enter your password"
                        {...field}
                        className="h-12 font-inter border-gray-300 focus:border-black focus:ring-black pr-12"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="font-inter text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormMessage className="font-inter" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isLoading}
              className="w-full h-12 bg-black text-white font-inter font-medium hover:bg-gray-800 transition-colors"
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        {/* Sign up link */}
        <p className="mt-8 text-center font-inter text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-black hover:text-gray-700 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
