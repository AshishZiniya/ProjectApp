// components/ui/Input.tsx
import React from "react";
import FormGroup from "@/components/common/FormGroup"; // Import FormGroup

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <FormGroup label={label} htmlFor={props.id} error={error}>
      <input
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className} ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      />
    </FormGroup>
  );
};

export default Input;
