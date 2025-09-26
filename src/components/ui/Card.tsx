// components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-6 transition-shadow duration-200 border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
