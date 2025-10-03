import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const cardVariants = cva(
  "bg-white rounded-lg transition-all duration-200 border min-h-[100px]",
  {
    variants: {
      variant: {
        default: "shadow-sm border-gray-200 hover:shadow-md hover:border-gray-300",
        elevated: "shadow-md border-gray-200 hover:shadow-lg hover:border-gray-300",
        outlined: "shadow-sm border-2 border-gray-300 hover:border-gray-400 bg-gray-50/50",
        ghost: "shadow-none border-transparent hover:bg-gray-50/50",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
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
