import React from 'react';
import { motion } from 'framer-motion';

interface ViewSwitchProps {
  viewMode: 'interactive' | 'paper';
  setViewMode: (val: 'interactive' | 'paper') => void;
  className?: string;
  id?: string;
}

export const ViewSwitch: React.FC<ViewSwitchProps> = ({
  viewMode,
  setViewMode,
  className = '',
  id = 'view-switch'
}) => {
  const handleViewChange = (mode: 'interactive' | 'paper') => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setViewMode(mode);
        requestAnimationFrame(() => {
          const target = document.getElementById(id) || document.getElementById('view-switch');
          target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      });
    } else {
      setViewMode(mode);
      requestAnimationFrame(() => {
        const target = document.getElementById(id) || document.getElementById('view-switch');
        target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  };

  return (
    <div
      id={id}
      data-testid="view-switch-container"
      className={`flex justify-center w-full ${className}`}
    >
      <div
        role="radiogroup"
        aria-label="View Mode"
        className="skeuo-segmented-switch inline-flex items-center relative p-1 rounded-xl bg-slate-100 border border-slate-200/90 shadow-sm max-w-[calc(100vw-32px)]"
        style={{ minHeight: '44px' }}
      >
        <button
          type="button"
          role="radio"
          aria-checked={viewMode === 'interactive'}
          onClick={() => handleViewChange('interactive')}
          className={`relative z-10 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] min-h-[44px] flex items-center justify-center ${
            viewMode === 'interactive'
              ? 'text-slate-900'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {viewMode === 'interactive' && (
            <motion.div
              layoutId="view-knob"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute inset-0 rounded-lg bg-white shadow-sm border border-slate-200/90 -z-10"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
              }}
            />
          )}
          Interactive
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={viewMode === 'paper'}
          onClick={() => handleViewChange('paper')}
          className={`relative z-10 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] min-h-[44px] flex items-center justify-center ${
            viewMode === 'paper'
              ? 'text-slate-900'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {viewMode === 'paper' && (
            <motion.div
              layoutId="view-knob"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute inset-0 rounded-lg bg-white shadow-sm border border-slate-200/90 -z-10"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
              }}
            />
          )}
          Paper View
        </button>
      </div>
    </div>
  );
};
