import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-surface-container dark:bg-surface-variant rounded-lg ${className}`}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="border border-outline-variant/30 rounded-2xl p-6 bg-surface-container-lowest dark:bg-surface-container/10 flex flex-col space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
};

export const SkeletonTimelineItem: React.FC = () => {
  return (
    <div className="flex gap-6 mb-8">
      <div className="flex flex-col items-center">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="w-0.5 h-32 bg-outline-variant/30 mt-2" />
      </div>
      <div className="flex-1">
        <div className="border border-outline-variant/30 rounded-2xl p-6 bg-surface-container-lowest dark:bg-surface-container/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonMapPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
