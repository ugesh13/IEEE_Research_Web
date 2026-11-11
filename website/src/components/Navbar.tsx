import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, FileText, Github } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#hero' },
    { label: 'Approach', href: '#approach' },
    { label: 'Dataset', href: '#dataset' },
    { label: 'Leakage Gate', href: '#leakage-design' },
    { label: 'Experiments', href: '#experimental-design' },
    { label: 'Results', href: '#results' },
    { label: 'Explainability', href: '#explainability' },
    { label: 'Subgroups', href: '#subgroups' },
    { label: 'Robustness', href: '#robustness' },
    { label: 'Discussion', href: '#discussion' },
    { label: 'Supplement', href: '#supplementary' },
    { label: 'Resources', href: '#resources' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#hero"
            className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-md px-1"
          >
            <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-mono text-sm font-semibold shadow-sm group-hover:bg-brand-700 transition-colors">
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

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="/paper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              title="Download manuscript PDF"
            >
              <FileText className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>PDF</span>
            </a>

            <a
              href="https://github.com/ugesh13/IEEE_Research_Web"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <a
              href="/paper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              <FileText className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Download Manuscript PDF</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

