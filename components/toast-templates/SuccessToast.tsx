import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessToastProps {
  title?: string;
  description?: string;
}

export function SuccessToast({
  title = "Success",
  description,
}: SuccessToastProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white border-2 border-green-200 rounded-xl shadow-lg shadow-green-100/50 min-w-[320px] max-w-[400px]">
      {/* Success Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-full flex items-center justify-center mt-0.5">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Brand Accent */}
      <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
    </div>
  );
}
