// components/ui/Alert.tsx

import { cn } from "@/utils";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "info",
  className = "",
}) => {
  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={cn(
        "border-l-4 p-4 rounded-r-lg",
        typeStyles[type],
        className
      )}
      role="alert"
    >
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default Alert;
