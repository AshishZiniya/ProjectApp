// components/ui/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = "", style }) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-6 transition-all duration-200 border border-gray-100 min-h-[100px] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
