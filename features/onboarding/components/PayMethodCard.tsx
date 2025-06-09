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
            ? "border-gray-900 bg-gray-50"
            : isDisabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-200 hover:border-gray-400 bg-white"
        }
        ${isSelected && onClick ? "hover:border-gray-700" : ""}
      `}
    >
      <div className="text-left space-y-1 sm:space-y-2 flex-1 min-h-0">
        <h3
          className={`font-space-grotesk text-base sm:text-lg font-semibold leading-tight truncate ${
            isSelected
              ? "text-gray-900"
              : isDisabled
              ? "text-gray-400"
              : "text-gray-700"
          }`}
        >
          {method.name}
        </h3>
        <p
          className={`font-inter text-xs sm:text-sm leading-tight line-clamp-2 ${
            isSelected
              ? "text-gray-700"
              : isDisabled
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          {method.description}
        </p>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-gray-900 rounded-full flex items-center justify-center">
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
