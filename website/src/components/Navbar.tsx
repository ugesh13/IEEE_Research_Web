import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="skeuo-button w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B63CE] min-h-[44px] min-w-[44px]"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
      </button>
    </div>
  );
};
