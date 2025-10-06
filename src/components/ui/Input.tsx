import { InputHTMLAttributes, TextareaHTMLAttributes, memo } from 'react';
import FormGroup from '@/components/common/FormGroup';
import { cn } from '@/utils';

interface BaseProps {
  label?: string;
  error?: string;
  className?: string;
  id?: string;
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    type?: Exclude<string, 'textarea'>;
  };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type: 'textarea';
  };

type Props = InputProps | TextareaProps;

const baseInputClasses =
  'block w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 bg-background text-foreground placeholder-gray-500 dark:placeholder-gray-400 text-sm';
const errorInputClasses =
  'border-error-400 focus:ring-error-400 focus:border-error-400 bg-error-50 dark:bg-error-500/10';

const InputComponent: React.FC<Props> = (props) => {
  const { label, error, className = '', id } = props;

  // Create FormGroup props object with only defined values
  const formGroupProps: {
    label?: string;
    htmlFor?: string;
    error?: string;
    errorId?: string;
  } = {};
  if (label !== undefined) formGroupProps.label = label;
  if (id !== undefined) formGroupProps.htmlFor = id;
  if (error !== undefined) {
    formGroupProps.error = error;
    formGroupProps.errorId = `${id}-error`;
  }

  const inputClasses = cn(
    baseInputClasses,
    className,
    error && errorInputClasses
  );

  if (props.type === 'textarea') {
    const {
      label: _label,
      error: _error,
      className: _className,
      ...textareaProps
    } = props as TextareaProps;
    void _label;
    void _error;
    void _className;

    return (
      <FormGroup {...formGroupProps}>
        <textarea
          id={id}
          className={inputClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id || 'textarea'}-error` : undefined}
          {...textareaProps}
        />
      </FormGroup>
    );
  }

  const {
    label: _label,
    error: _error,
    className: _className,
    ...inputProps
  } = props as InputProps;
  void _label;
  void _error;
  void _className;

  return (
    <FormGroup {...formGroupProps}>
      <input
        id={id}
        type={props.type ?? 'text'}
        className={inputClasses}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id || 'input'}-error` : undefined}
        {...inputProps}
      />
    </FormGroup>
  );
};

const Input = memo(InputComponent);

export default Input;
