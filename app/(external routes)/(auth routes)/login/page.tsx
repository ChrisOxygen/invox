"use client";

import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { LoginFormInput } from "@/types/schemas/auth";
import InBoxLoader from "@/components/InBoxLoader";
import { useLogin } from "@/hooks/useLogin";
import useSocialSignIn from "@/hooks/useSocialSignIn";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { signInWithCredentials, isLoading, error } = useLogin();
  const { mutate: signInWithProvider, isPending: isSocialSignInPending } =
    useSocialSignIn();
  // Initialize form
  const form = useForm<LoginFormInput>({
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
  const onSubmit = (values: LoginFormInput) => {
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
    <div className="h-full rounded-xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">I</span>
            </div>
          </div>
          <h1 className="mb-3 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent tracking-tight">
            Welcome back
          </h1>
          <p className="text-base text-gray-600">
            Sign in to your Invox account
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border-2 border-blue-100 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-200">
          {/* Social Login Options */}
          <div className="mb-6 space-y-3">
            <Button
              onClick={() => signInWithProvider("google")}
              disabled={isSocialSignInPending}
              variant="outline"
              className="w-full h-12 font-medium border-2 border-blue-200 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            >
              <FaGoogle className="mr-3 text-lg text-blue-600" />
              Continue with Google
            </Button>
            <Button
              onClick={() => signInWithProvider("github")}
              disabled={isSocialSignInPending}
              variant="outline"
              className="w-full h-12 font-medium border-2 border-blue-200 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            >
              <FaGithub className="mr-3 text-lg text-gray-800" />
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center">
            <Separator className="flex-1 bg-blue-200" />
            <span className="px-4 text-sm text-gray-600 bg-white">
              or continue with email
            </span>
            <Separator className="flex-1 bg-blue-200" />
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="h-11 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          className="h-11 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 pr-12"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
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
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Sign up link */}
        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
