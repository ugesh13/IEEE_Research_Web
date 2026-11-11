import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { JudgesSummary } from './components/JudgesSummary';
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
import { ClaimsLedger } from './components/ClaimsLedger';
import { ReproductionSection } from './components/ReproductionSection';
import { SupplementarySection } from './components/SupplementarySection';
import { ResourcesSection } from './components/ResourcesSection';
import { PaperView } from './components/PaperView';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'interactive' | 'paper'>('interactive');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (darkMode) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch {
      // In private browsing or sandboxed iframes, localStorage may throw
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>

      {/* Sticky Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {viewMode === 'paper' ? (
          <PaperView onSwitchToInteractive={() => setViewMode('interactive')} />
        ) : (
          <>
            {/* For Judges 60-Second Summary */}
            <JudgesSummary />

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

            {/* Claims Ledger & Provenance Matrix */}
            <ClaimsLedger />

            {/* Reproduction Status */}
            <ReproductionSection />

            {/* Supplementary Repository Results */}
            <SupplementarySection />

            {/* 11. Resources */}
            <ResourcesSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
