import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MacDock } from './components/MacDock';
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
import { ResourcesSection } from './components/ResourcesSection';
import { Footer } from './components/Footer';
import { PaperViewSkeleton, SectionSkeleton } from './components/Skeletons';

// Real async code-splitting with React.lazy
const PaperView = React.lazy(() => import('./components/PaperView'));
const ClaimsLedger = React.lazy(() => import('./components/ClaimsLedger'));
const ReproductionSection = React.lazy(() => import('./components/ReproductionSection'));
const SupplementarySection = React.lazy(() => import('./components/SupplementarySection'));

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'interactive' | 'paper'>('interactive');
  const [scrollProgress, setScrollProgress] = useState(0);
  // Theme is in-memory only; always starts false (light) on load, never reads or writes localStorage
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Lenis smooth scrolling initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenisInstance: any = null;
    let animId: number;

    import('lenis').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenisInstance?.raf(time);
        animId = requestAnimationFrame(raf);
      }
      animId = requestAnimationFrame(raf);
    }).catch(() => {
      // Fallback silently if Lenis fails to load
    });

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      lenisInstance?.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans transition-colors duration-200">
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>

      {/* Thin scroll-progress bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-1 bg-brand-600 dark:bg-brand-400 z-50 origin-left pointer-events-none transition-transform duration-75"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Top Right Floating Theme Toggle (Small, In-Memory) */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {viewMode === 'paper' ? (
          <React.Suspense fallback={<PaperViewSkeleton />}>
            <PaperView
              viewMode={viewMode}
              setViewMode={setViewMode}
              onSwitchToInteractive={() => setViewMode('interactive')}
            />
          </React.Suspense>
        ) : (
          <>
            {/* For Judges 60-Second Summary */}
            <JudgesSummary />

            {/* 1. Hero */}
            <Hero viewMode={viewMode} setViewMode={setViewMode} />

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
            <React.Suspense fallback={<SectionSkeleton title="Loading Claims Ledger..." minHeight="min-h-[300px]" />}>
              <ClaimsLedger />
            </React.Suspense>

            {/* Reproduction Status */}
            <React.Suspense fallback={<SectionSkeleton title="Loading Reproduction Status..." minHeight="min-h-[300px]" />}>
              <ReproductionSection />
            </React.Suspense>

            {/* Supplementary Repository Results */}
            <React.Suspense fallback={<SectionSkeleton title="Loading Supplementary Tables..." minHeight="min-h-[400px]" />}>
              <SupplementarySection />
            </React.Suspense>

            {/* 11. Resources */}
            <ResourcesSection />
          </>
        )}
      </main>

      {/* macOS Dock Navigation */}
      <MacDock />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
