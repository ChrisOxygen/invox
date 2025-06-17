"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadPDFButtonProps {
  onDownload?: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  fileName?: string;
}

export function DownloadPDFButton({
  onDownload,
  disabled = false,
  className,
  fileName = "invoice.pdf",
}: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (disabled || isGenerating) return;

    setIsGenerating(true);

    try {
      // Simulate PDF generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await onDownload?.();

      // Mock download - in real app this would trigger actual PDF download
      console.log(`Downloading ${fileName}...`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      className={cn(
        "h-9 gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">
        {isGenerating ? "Generating PDF..." : "Download PDF"}
      </span>
    </Button>
  );
}
