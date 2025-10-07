import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const cardVariants = cva(
  'rounded-2xl border min-h-[100px]',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        elevated:
          'bg-white dark:bg-gray-800 border-gray-200/80 dark:border-gray-700/80',
        outlined:
          'bg-transparent border-2 border-gray-200/50 dark:border-gray-700/50',
        ghost: 'shadow-none border-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant,
  padding,
  style,
  ...props
}) => {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
