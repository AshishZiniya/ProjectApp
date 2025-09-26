// components/ui/GradientText.tsx

import React from "react";
import { cn } from "@/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "success" | "warning";
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  variant = "primary",
  as: Component = "span",
}) => {
  const gradientStyles = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    success: "bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent",
    warning: "bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent",
  };

  const Element = Component as React.ElementType;

  return (
    <Element className={cn(gradientStyles[variant], className)}>
      {children}
    </Element>
  );
};

export default GradientText;