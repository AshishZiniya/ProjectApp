import React from 'react';
import Card from './Card';

interface SkeletonCardProps {
  variant?: 'default' | 'project' | 'task' | 'user';
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'default',
  className = '',
  style = {}
}) => {
  const getSkeletonContent = () => {
    switch (variant) {
      case 'project':
        return (
          <>
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex-shrink-0" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="flex items-center text-gray-700 text-sm mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded mr-1 flex-shrink-0" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            <div className="flex space-x-2 mt-auto">
              <div className="h-8 bg-gray-200 rounded flex-1" />
              <div className="h-8 bg-gray-200 rounded flex-1" />
            </div>
          </>
        );

      case 'task':
        return (
          <>
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3" />
              <div className="flex gap-2 mb-2">
                <div className="h-5 bg-gray-200 rounded w-16" />
                <div className="h-5 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="flex space-x-2 mt-4">
              <div className="h-8 w-24 bg-gray-200 rounded flex-1" />
              <div className="h-8 w-20 bg-gray-200 rounded flex-1" />
            </div>
          </>
        );

      case 'user':
        return (
          <>
            <div>
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3" />
                <div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-1" />
                  <div className="h-5 bg-gray-200 rounded w-16" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
            <div className="flex space-x-2 mt-4">
              <div className="h-8 w-24 bg-gray-200 rounded flex-1" />
              <div className="h-8 w-20 bg-gray-200 rounded flex-1" />
            </div>
          </>
        );

      default:
        return (
          <>
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex-shrink-0" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
            </div>
            <div className="flex space-x-2 mt-auto">
              <div className="h-8 bg-gray-200 rounded flex-1" />
              <div className="h-8 bg-gray-200 rounded flex-1" />
            </div>
          </>
        );
    }
  };

  const getCardHeight = () => {
    switch (variant) {
      case 'user':
        return '200px';
      default:
        return '280px';
    }
  };

  return (
    <Card
      className={`flex flex-col justify-between animate-pulse ${className}`}
      style={{
        minHeight: getCardHeight(),
        contain: 'layout style',
        ...style
      }}
    >
      {getSkeletonContent()}
    </Card>
  );
};

export default SkeletonCard;