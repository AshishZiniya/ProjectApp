// components/ui/Input.tsx
import React from "react";
import FormGroup from "@/components/common/FormGroup"; // Import FormGroup

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: string; // Allow type to be passed
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  type = "text", // Default type to text
  ...props
}) => {
  const InputElement = type === "textarea" ? "textarea" : "input";

  return (
    <FormGroup label={label} htmlFor={props.id} error={error}>
      <InputElement
        type={type !== "textarea" ? type : undefined} // Only pass type prop if not textarea
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className} ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      />
    </FormGroup>
  );
};

export default Input;
