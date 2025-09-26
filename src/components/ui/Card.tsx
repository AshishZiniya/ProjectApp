// components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = "", style }) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-6 transition-shadow duration-200 border border-gray-100 ${className}`}
      style={{
        // Enhanced CLS prevention
        contain: 'layout style paint',
        containIntrinsicSize: 'auto 200px',
        willChange: 'auto',
        // Prevent layout shifts
        minHeight: '100px',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        // Smooth transitions
        transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Card;
