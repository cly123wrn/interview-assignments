import React from 'react';

function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]}`}>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className = '' }) {
  return (
    <div className={`loading-skeleton ${className}`}>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="article-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="h-4 w-16" />
        </div>
        <LoadingSkeleton className="h-6 w-16" />
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="h-6 w-full" />
          <LoadingSkeleton className="h-6 w-3/4" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-5/6" />
          <LoadingSkeleton className="h-4 w-2/3" />
        </div>
        <LoadingSkeleton className="w-32 h-24 lg:w-40 lg:h-28 rounded-lg" />
      </div>
      
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <LoadingSkeleton className="h-4 w-12" />
          <LoadingSkeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center space-x-2">
          <LoadingSkeleton className="h-8 w-8 rounded-md" />
          <LoadingSkeleton className="h-8 w-8 rounded-md" />
          <LoadingSkeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;