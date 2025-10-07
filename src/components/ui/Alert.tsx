import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const alertVariants = cva(
  'p-4 rounded-lg border',
  {
    variants: {
      type: {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  message: string;
}

const Alert: React.FC<AlertProps> = ({ message, type, className, ...props }) => {
  return (
    <div className={cn(alertVariants({ type }), className)} {...props}>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
