import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiSearch,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiFilter,
} from "react-icons/fi";
import { useState } from "react";

interface ItemsSearchAndFiltersProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortToggle: () => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  isLoading?: boolean;
  debouncedSearchTerm?: string;
}

export const ItemsSearchAndFilters = ({
  searchTerm,
  onSearch,
  sortOrder,
  onSortToggle,
  dateFilter,
  onDateFilterChange,
  isLoading = false,
  debouncedSearchTerm,
}: ItemsSearchAndFiltersProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between gap-6">
        {/* Left: Search */}
        <div className="flex-1 max-w-md relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200 bg-white h-10 text-sm"
          />
          {isLoading && debouncedSearchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Right: Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="w-[140px] h-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200">
              <FiCalendar className="mr-2 h-4 w-4 text-blue-500" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSortToggle}
            className="h-10 px-3 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 hover:text-blue-800 transition-all duration-200"
          >
            {sortOrder === "asc" ? (
              <FiArrowUp className="h-4 w-4" />
            ) : (
              <FiArrowDown className="h-4 w-4" />
            )}
            <span className="ml-2 text-sm">Sort</span>
          </Button>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:flex lg:hidden items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200 bg-white h-10 text-sm"
          />
          {isLoading && debouncedSearchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2">
          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="w-[120px] h-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200">
              <FiCalendar className="mr-1 h-4 w-4 text-blue-500" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onSortToggle}
            className="h-10 px-3 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
          >
            {sortOrder === "asc" ? (
              <FiArrowUp className="h-4 w-4" />
            ) : (
              <FiArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {/* Search and Filter Toggle */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200 bg-white h-10 text-sm"
            />
            {isLoading && debouncedSearchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="h-10 px-3 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
          >
            <FiFilter className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Filters (Collapsible) */}
        {showMobileFilters && (
          <div className="flex gap-2 p-3 bg-gradient-to-r from-blue-50/30 to-cyan-50/30 border border-blue-100 rounded-lg">
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger className="flex-1 h-9 border-blue-200 focus:border-blue-400 focus:ring-blue-200 text-sm">
                <FiCalendar className="mr-1 h-3 w-3 text-blue-500" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={onSortToggle}
              className="h-9 px-3 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 text-sm"
            >
              {sortOrder === "asc" ? (
                <FiArrowUp className="h-3 w-3" />
              ) : (
                <FiArrowDown className="h-3 w-3" />
              )}
              <span className="ml-1">Sort</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
