import { FiAlertCircle } from "react-icons/fi";

interface ItemsErrorStateProps {
  error: string;
}

export const ItemsErrorState = ({ error }: ItemsErrorStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-full flex items-center justify-center">
        <FiAlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Error loading items
      </h3>
      <p className="text-gray-600 text-sm">{error}</p>
    </div>
  );
};
