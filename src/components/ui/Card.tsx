// components/ui/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-lg hover:shadow-xl rounded-xl p-6 transition-all duration-300 border border-gray-100 hover:border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
