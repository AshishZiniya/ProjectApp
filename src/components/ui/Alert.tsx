// components/ui/Alert.tsx

import { cn } from '@/utils';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = 'info',
  className = '',
}) => {
  const typeStyles = {
    success: 'glass-card border-green-400/50 text-green-300 bg-green-500/10',
    error: 'glass-card border-red-400/50 text-red-300 bg-red-500/10',
    warning: 'glass-card border-yellow-400/50 text-yellow-300 bg-yellow-500/10',
    info: 'glass-card border-blue-400/50 text-blue-300 bg-blue-500/10',
  };

  return (
    <div
      className={cn(
        'border-l-4 p-6 rounded-2xl backdrop-blur-md',
        typeStyles[type],
        className
      )}
      role="alert"
    >
      <p className="font-medium text-lg">{message}</p>
    </div>
  );
};

export default Alert;
