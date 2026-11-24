import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-slate-200/70 rounded-2xl"></div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-80 bg-slate-200/70 rounded-2xl"></div>
        <div className="lg:col-span-7 h-80 bg-slate-200/70 rounded-2xl"></div>
      </div>

      {/* AI Panel Skeleton */}
      <div className="h-44 bg-slate-200/70 rounded-2xl"></div>
    </div>
  );
}
