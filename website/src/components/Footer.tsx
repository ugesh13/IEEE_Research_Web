import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-white border-t border-[#E5E7EB] text-xs text-[#4B5563]">
      <div className="layout-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
          {/* Brand Block */}
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[#0B63CE] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
              OU
            </span>
            <span className="font-semibold text-[#111827] text-sm">
              OULAD Early Student Performance Prediction
            </span>
          </div>

          {/* Academic Statement */}
          <div className="font-mono text-[#4B5563] text-xs text-center">
            All values are those reported in the manuscript (Kumar &amp; Sharma, 2026).
          </div>

          {/* Scope / Legal Notice */}
          <div className="text-[12px] text-[#4B5563] text-center md:text-right leading-relaxed">
            Observational study. Attributions reflect predictive associations, not causal effects.
          </div>
        </div>
      </div>
    </footer>
  );
};
