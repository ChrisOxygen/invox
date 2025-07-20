import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

interface ItemsHeaderProps {
  onAddItem: () => void;
}

export const ItemsHeader = ({ onAddItem }: ItemsHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Left: Title */}
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
          Saved items
        </h1>
      </div>

      {/* Right: Action Button */}
      <div className="flex-shrink-0">
        <Button
          onClick={onAddItem}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white font-medium px-4 py-2 h-10 text-sm transition-all duration-300 group rounded-lg shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105"
        >
          <FiPlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          Add new item
        </Button>
      </div>
    </div>
  );
};
