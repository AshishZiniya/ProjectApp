import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import FormGroup from "@/components/common/FormGroup";

interface BaseProps {
  label?: string;
  error?: string;
  className?: string;
  id?: string;
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    type?: Exclude<string, "textarea">;
  };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type: "textarea";
  };

type Props = InputProps | TextareaProps;

function isTextareaProps(props: Props): props is TextareaProps {
  return props.type === "textarea";
}

function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

const Input: React.FC<Props> = (props) => {
  const { label, error, className = "", id } = props;

  if (isTextareaProps(props)) {
    const textareaProps = omit(props, [
      "label",
      "error",
      "className",
      "id",
      "type",
    ]);

    return (
      <FormGroup label={label} htmlFor={id} error={error}>
        <textarea
          id={id}
          className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className} ${
            error ? "border-red-500" : ""
          }`}
          {...textareaProps}
        />
      </FormGroup>
    );
  }

  const inputProps = omit(props, ["label", "error", "className", "id"]);

  return (
    <FormGroup label={label} htmlFor={id} error={error}>
      <input
        id={id}
        type={props.type ?? "text"}
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className} ${
          error ? "border-red-500" : ""
        }`}
        {...inputProps}
      />
    </FormGroup>
  );
};

export default Input;
