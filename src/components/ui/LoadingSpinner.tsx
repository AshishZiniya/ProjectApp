import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center min-h-screen bg-white bg-opacity-50">
      <div className="animate-spin rounded-full h-18 w-18 border-4 border-t-transparent border-gray-900"></div>
    </div>
  );
};

export default LoadingSpinner;
