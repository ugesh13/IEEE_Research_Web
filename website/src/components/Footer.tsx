import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-brand-600 text-white font-mono text-xs font-bold flex items-center justify-center">
              OU
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              OULAD Early Student Performance Prediction
            </span>
          </div>

          <div className="font-mono text-slate-600 dark:text-slate-400 font-medium">
            All values are those reported in the manuscript (Kumar & Sharma, 2026).
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Observational study. Attributions reflect predictive associations, not causal effects.
          </div>
        </div>
      </div>
    </footer>
  );
};
