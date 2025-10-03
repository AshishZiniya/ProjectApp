import React, { ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const gradientTextVariants = cva(
  "bg-clip-text text-transparent font-bold",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800",
        secondary: "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800",
        success: "bg-gradient-to-r from-green-600 via-emerald-600 to-green-800",
        warning: "bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-800",
        danger: "bg-gradient-to-r from-red-600 via-pink-600 to-red-800",
        cosmic: "bg-gradient-to-r from-indigo-600 via-purple-600 via-pink-600 to-orange-500",
        ocean: "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600",
        sunset: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
        "6xl": "text-6xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
    },
  }
);

interface GradientTextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof gradientTextVariants> {
  children: React.ReactNode;
  as?: ElementType;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  variant,
  size,
  as: Component = "span",
  ...props
}) => {
  return (
    <Component
      className={cn(gradientTextVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GradientText;
