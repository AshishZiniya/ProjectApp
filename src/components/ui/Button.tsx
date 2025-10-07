import { memo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const buttonVariants = cva(
  'font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 relative overflow-hidden',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 dark:text-white shadow-lg border border-blue-400/50',
        secondary:
          'bg-gray-100 text-gray-800 border border-gray-300 shadow-md dark:glass dark:text-gray-200 dark:border-white/20',
        success:
          'bg-gradient-to-r from-green-500 to-emerald-600 text-gray-900 dark:text-white shadow-lg border border-green-400/50',
        warning:
          'bg-gradient-to-r from-yellow-500 to-orange-600 text-gray-900 dark:text-white shadow-lg border border-yellow-400/50',
        danger:
          'bg-gradient-to-r from-red-500 to-pink-600 text-gray-900 dark:text-white shadow-lg border border-red-400/50',
        outline:
          'border-2 border-blue-400 text-blue-600 focus:ring-blue-400 bg-transparent shadow-lg dark:text-blue-400',
        ghost:
          'text-blue-600 focus:ring-blue-400 bg-transparent dark:text-blue-400',
        link: 'text-blue-600 focus:ring-blue-400 bg-transparent shadow-none p-0 dark:text-blue-400',
      },
      size: {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        xl: 'px-10 py-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const LoadingSpinner = memo(() => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

const Button = memo(ButtonComponent);
Button.displayName = 'Button';

export default Button;
