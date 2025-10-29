import React from 'react';

interface LoadingProps {
  title?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  size = 'md',
  className = "min-h-screen"
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      {message && (
        <p className="text-sm text-gray-600 mt-4">{message}</p>
      )}
    </div>
  );
};

export default Loading; 