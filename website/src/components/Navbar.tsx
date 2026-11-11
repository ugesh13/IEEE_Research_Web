import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  viewMode: 'interactive' | 'paper';
  setViewMode: (val: 'interactive' | 'paper') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, viewMode, setViewMode }) => {
  const handleViewChange = (mode: 'interactive' | 'paper') => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setViewMode(mode);
      });
    } else {
      setViewMode(mode);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="layout-container">
        <div className="flex items-center justify-between h-14">
          {/* Title */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md py-1"
          >
            <span className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-mono text-xs font-bold shadow-sm group-hover:bg-brand-700 transition-colors">
              OU
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold tracking-tight leading-none text-slate-900 dark:text-slate-100">
                OULAD Study
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                Kumar & Sharma (2026)
              </span>
            </div>
          </a>

          {/* Controls: Segmented View Switch & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Skeuomorphic physical segmented switch */}
            <div
              role="radiogroup"
              aria-label="View Mode"
              className="skeuo-segmented-switch flex items-center relative text-xs font-sans font-medium"
            >
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === 'interactive'}
                onClick={() => handleViewChange('interactive')}
                className={`relative z-10 px-3 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  viewMode === 'interactive'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {viewMode === 'interactive' && (
                  <motion.div
                    layoutId="view-knob"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute inset-0 rounded-md bg-white dark:bg-slate-700 shadow-sm border border-slate-200/80 dark:border-slate-600/80 -z-10"
                    style={{
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
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
                className={`relative z-10 px-3 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  viewMode === 'paper'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {viewMode === 'paper' && (
                  <motion.div
                    layoutId="view-knob"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute inset-0 rounded-md bg-white dark:bg-slate-700 shadow-sm border border-slate-200/80 dark:border-slate-600/80 -z-10"
                    style={{
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}
                  />
                )}
                Paper View
              </button>
            </div>

            {/* Dark Mode Keycap Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="skeuo-button p-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
