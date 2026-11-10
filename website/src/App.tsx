import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemApproach } from './components/ProblemApproach';
import { DatasetSection } from './components/DatasetSection';
import { LeakageDesign } from './components/LeakageDesign';
import { ExperimentalDesign } from './components/ExperimentalDesign';
import { ResultsSection } from './components/ResultsSection';
import { ExplainabilitySection } from './components/ExplainabilitySection';
import { SubgroupsSection } from './components/SubgroupsSection';
import { RobustnessSection } from './components/RobustnessSection';
import { DiscussionSection } from './components/DiscussionSection';
import { ResourcesSection } from './components/ResourcesSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-600 text-white rounded-md text-xs font-medium shadow-md"
      >
        Skip to main content
      </a>

      {/* Sticky Navigation */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Problem and Approach */}
        <ProblemApproach />

        {/* 3. Dataset */}
        <DatasetSection />

        {/* 4. Leakage-Safe Design */}
        <LeakageDesign />

        {/* 5. Experimental Design */}
        <ExperimentalDesign />

        {/* 6. Results */}
        <ResultsSection />

        {/* 7. Explainability */}
        <ExplainabilitySection />

        {/* 8. Subgroups */}
        <SubgroupsSection />

        {/* 9. Robustness */}
        <RobustnessSection />

        {/* 10. Discussion & Limitations */}
        <DiscussionSection />

        {/* 11. Resources */}
        <ResourcesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;

