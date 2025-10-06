import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const cardVariants = cva(
  'rounded-2xl transition-all duration-300 border min-h-[100px] hover-lift',
  {
    variants: {
      variant: {
        default:
          'bg-card border-border shadow-md hover:shadow-lg',
        elevated:
          'bg-card border-border/80 shadow-lg hover:shadow-xl',
        outlined:
          'bg-transparent border-2 border-border/50 hover:border-border',
        ghost: 'shadow-none border-transparent hover:bg-card/50',
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
