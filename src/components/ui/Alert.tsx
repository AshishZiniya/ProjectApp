// components/ui/Alert.tsx
import React from "react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "info";
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "info",
  className = "",
}) => {
  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div
      className={`border px-4 py-3 rounded relative ${typeStyles[type]} ${className}`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default Alert;
