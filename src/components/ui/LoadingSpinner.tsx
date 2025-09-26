import { memo } from "react";
import { cn } from "@/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const LoadingSpinner = memo<LoadingSpinnerProps>(
  ({ size = "md", className, text }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    };

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3",
          className,
        )}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
            sizeClasses[size],
          )}
        />
        {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
      </div>
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
