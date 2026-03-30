"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { _resetPassword } from "@/features/auth/server";

const ZResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ZResetPassword = z.infer<typeof ZResetPasswordSchema>;

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZResetPassword>({
    resolver: zodResolver(ZResetPasswordSchema),
  });

  const onSubmit = async (data: ZResetPassword) => {
    setServerError(null);
    const result = await _resetPassword(data.password);
    if (result?.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
      // Server action redirects to /login on success — no client redirect needed
    }
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-[800] tracking-h2 text-(--ink-900) leading-[1.15]">
          Set new password
        </h1>
        <p className="font-sans text-[15px] text-(--ink-400) leading-[1.6]">
          Choose a strong password for your account.
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2.5 rounded-lg px-4 py-3 bg-[color-mix(in_srgb,var(--success)_10%,transparent)] border border-[color-mix(in_srgb,var(--success)_25%,transparent)]">
          <CheckCircle
            size={16}
            strokeWidth={2}
            className="text-(--success) shrink-0"
          />
          <p className="font-sans text-[13px] text-(--success) font-medium">
            Password updated! Redirecting...
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        {serverError && (
          <div className="rounded-md bg-[color-mix(in_srgb,var(--error)_10%,transparent)] border border-[color-mix(in_srgb,var(--error)_30%,transparent)] px-4 py-3">
            <p className="text-[13px] font-sans text-(--error)">
              {serverError}
            </p>
          </div>
        )}
        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="password"
            className="font-display text-[12px] font-semibold text-(--ink-900)"
          >
            New password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="font-sans text-[14px] text-(--ink-900) pr-11 h-10.5 rounded-md pl-3.5 border-(--border-default) aria-invalid:border-(--error)"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-(--ink-300) bg-transparent border-0 p-0 cursor-pointer transition-colors hover:text-(--ink-400)"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={2} />
              ) : (
                <Eye size={16} strokeWidth={2} />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="font-sans text-[11px] text-(--error) mt-0.5">
              {errors.password.message}
            </p>
          ) : (
            <p className="font-sans text-[11px] text-(--ink-300) mt-0.5">
              Must be at least 8 characters
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="confirmPassword"
            className="font-display text-[12px] font-semibold text-(--ink-900)"
          >
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              className="font-sans text-[14px] text-(--ink-900) pr-11 h-10.5 rounded-md pl-3.5 border-(--border-default) aria-invalid:border-(--error)"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-(--ink-300) bg-transparent border-0 p-0 cursor-pointer transition-colors hover:text-(--ink-400)"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff size={16} strokeWidth={2} />
              ) : (
                <Eye size={16} strokeWidth={2} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="font-sans text-[11px] text-(--error) mt-0.5">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full font-display text-[14px] font-semibold bg-(--blue-600) text-white border-0 h-10.5 rounded-md"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset password
        </Button>
      </form>
    </div>
  );
}
