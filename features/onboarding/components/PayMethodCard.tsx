import React from "react";
import { Clock } from "lucide-react";

interface PayMethodCardProps {
  method: {
    id: string;
    name: string;
    description: string;
    available: boolean;
  };
  isSelected: boolean;
  onSelect: (methodId: string) => void;
  onClick?: (methodId: string) => void;
}

const PayMethodCard: React.FC<PayMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
  onClick,
}) => {
  const isDisabled = !method.available;

  const handleClick = () => {
    if (isDisabled) return;

    if (isSelected && onClick) {
      // If already selected and onClick is provided, call onClick instead of onSelect
      onClick(method.id);
    } else {
      // Otherwise, handle selection
      onSelect(method.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative h-24 sm:h-28 md:h-32 w-full
        p-4 sm:p-5 md:p-6 rounded-lg border-2 cursor-pointer 
        transition-all duration-200 flex flex-col justify-between
        ${
          isSelected
            ? "border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg shadow-blue-100/50"
            : isDisabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-cyan-50/50 bg-white"
        }
        ${
          isSelected && onClick
            ? "hover:border-blue-500 hover:shadow-xl hover:shadow-blue-200/50"
            : ""
        }
      `}
    >
      <div className="text-left space-y-1 sm:space-y-2 flex-1 min-h-0">
        <h3
          className={`text-base sm:text-lg font-semibold leading-tight truncate ${
            isSelected
              ? "text-blue-800"
              : isDisabled
              ? "text-gray-400"
              : "text-gray-700"
          }`}
        >
          {method.name}
        </h3>
        <p
          className={`text-xs sm:text-sm leading-tight line-clamp-2 ${
            isSelected
              ? "text-blue-600"
              : isDisabled
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          {method.description}
        </p>
      </div>

      {/* Selection indicator with brand colors */}
      {isSelected && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-200/50">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
        </div>
      )}

      {/* Disabled indicator */}
      {isDisabled && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default PayMethodCard;
