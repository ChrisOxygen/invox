"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SendInvoiceButtonProps {
  onSend?: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  recipientEmail?: string;
}

export function SendInvoiceButton({
  onSend,
  disabled = false,
  className,
  recipientEmail,
}: SendInvoiceButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSend = async () => {
    if (disabled || isSending) return;

    setIsSending(true);
    setIsSuccess(false);

    try {
      // Simulate sending delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await onSend?.();

      setIsSuccess(true);
      console.log(`Invoice sent to ${recipientEmail || "client"}!`);

      // Reset success state after 2 seconds
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to send invoice:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getButtonContent = () => {
    if (isSending) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Sending Invoice...</span>
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <Check className="h-4 w-4" />
          <span>Sent Successfully!</span>
        </>
      );
    }

    return (
      <>
        <Send className="h-4 w-4" />
        <span>Send Invoice</span>
      </>
    );
  };

  return (
    <Button
      onClick={handleSend}
      disabled={disabled || isSending}
      className={cn(
        "h-9 gap-2 bg-black text-white hover:bg-gray-800 transition-all duration-200",
        isSuccess && "bg-green-600 hover:bg-green-700",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {getButtonContent()}
    </Button>
  );
}
