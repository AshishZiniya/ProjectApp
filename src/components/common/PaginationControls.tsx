// components/common/PaginationControls.tsx
import React from "react";
import Button from "@/components/ui/Button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions: number[];
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
      >
        Previous
      </Button>
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
      >
        Next
      </Button>
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
      >
        {limitOptions.map((option) => (
          <option key={option} value={option}>
            {option} per page
          </option>
        ))}
      </select>
    </div>
  );
};

export default PaginationControls;
