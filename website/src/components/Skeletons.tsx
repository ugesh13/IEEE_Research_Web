import React from 'react';

export const ShimmerBlock: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div
    className={`relative overflow-hidden rounded bg-slate-100 dark:bg-slate-800/50 ${className}`}
    style={style}
  >
    <div
      aria-hidden="true"
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[shimmer_1.6s_infinite]"
    />
  </div>
);

export const PaperViewSkeleton: React.FC = () => {
  return (
    <article className="layout-container py-10 max-w-4xl mx-auto" aria-busy="true" aria-label="Loading manuscript view">
      {/* Header Skeleton */}
      <div className="pb-8 mb-8 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <ShimmerBlock className="h-9 w-4/5" />
        <ShimmerBlock className="h-5 w-1/3" />
        <ShimmerBlock className="h-4 w-1/2" />
      </div>

      {/* Abstract Box Skeleton */}
      <div className="mb-10 p-6 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-5/6" />
        <ShimmerBlock className="h-4 w-2/3" />
      </div>

      {/* Section Skeleton */}
      <div className="space-y-6">
        <ShimmerBlock className="h-6 w-1/4" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-11/12" />
        <ShimmerBlock className="h-48 w-full rounded-xl" />
      </div>
    </article>
  );
};

export const SectionSkeleton: React.FC<{ minHeight?: string; title?: string }> = ({
  minHeight = 'min-h-[400px]',
  title = 'Loading section...'
}) => {
  return (
    <div className={`layout-container py-16 ${minHeight}`} aria-busy="true" aria-label={title}>
      <div className="space-y-4">
        <ShimmerBlock className="h-7 w-48" />
        <ShimmerBlock className="h-4 w-96 max-w-full" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShimmerBlock className="h-44 rounded-xl" />
          <ShimmerBlock className="h-44 rounded-xl" />
          <ShimmerBlock className="h-44 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

