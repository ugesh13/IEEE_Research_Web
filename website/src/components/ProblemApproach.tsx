import React from 'react';
import { Database, Filter, Layers, Split, Cpu, Sliders, CheckCircle, PieChart, ShieldAlert } from 'lucide-react';

export const ProblemApproach: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'OULAD Tables',
      subtitle: '7 Relational Tables',
      desc: 'Raw demographic, registration, assessment, and VLE interaction tables from 22 presentations across 7 modules.',
      icon: Database,
      badge: 'Raw Input',
    },
    {
      num: 2,
      title: 'Integrate Tables',
      subtitle: 'Analytical Unit u',
      desc: 'Formulate analytical unit u = (code_module, code_presentation, id_student) across 32,593 enrollments.',
      icon: Layers,
      badge: 'Unit Level',
    },
    {
      num: 3,
      title: 'Day-30 Gate',
      subtitle: 'Leakage Containment',
      desc: 'Recorded on or before Day 30? If NO, quarantine and discard post-Day-30 traces, unregistration dates, and exams.',
      icon: Filter,
      badge: 'Day <= 30 Gate',
      highlight: true,
    },
    {
      num: 4,
      title: 'Nested Scenarios',
      subtitle: 'S0 ⊂ S1 ⊂ S2',
      desc: 'Progressive temporal scopes: S0 (Intake Baseline) -> S1 (+ Academic Milestones) -> S2 (+ VLE Clickstreams).',
      icon: Sliders,
      badge: '3 Horizons',
    },
    {
      num: 5,
      title: 'Student-Grouped Split',
      subtitle: 'Seed 42 (0 Overlap)',
      desc: 'Group by student ID into Train (22,815 obs), Validation (4,889 obs), and Locked Holdout (4,889 obs).',
      icon: Split,
      badge: 'Leakage-Safe',
    },
    {
      num: 6,
      title: 'Model Training & CV',
      subtitle: '5-Fold Grouped CV',
      desc: 'Train Logistic Regression, Random Forest, and HistGradientBoostingClassifier strictly within the training cohort.',
      icon: Cpu,
      badge: 'Grouped CV',
    },
    {
      num: 7,
      title: 'Validation Threshold',
      subtitle: 'theta* = 0.45',
      desc: 'Select threshold on validation partition only satisfying Recall >= 0.82 and Precision >= 0.70 before holdout unblinding.',
      icon: ShieldAlert,
      badge: 'Validation Only',
    },
    {
      num: 8,
      title: 'Holdout Evaluation',
      subtitle: 'Validation-Fixed',
      desc: 'Holdout Evaluation: primary model and threshold fixed using validation only; evaluated on the locked holdout.',
      icon: CheckCircle,
      badge: 'Locked Holdout',
    },
    {
      num: 9,
      title: 'Explainability & Audits',
      subtitle: 'SHAP, Subgroups, Robustness',
      desc: 'Compute SHAP attributions, descriptive subgroup error rates, seed stability (5 seeds), and class-weight sensitivity; robustness checks (seeds, class weighting) are also reported on the holdout and were not used for threshold tuning.',
      icon: PieChart,
      badge: 'Post-Hoc',
    },
  ];

  return (
    <section id="approach" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section 2
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Problem Formulation & Study Workflow
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Students in distance higher education require early identification to enable timely academic advising.
            However, models utilizing post-outcome or full-term aggregates suffer from temporal data leakage.
            Below is the full end-to-end experimental protocol as reported in the manuscript (Fig. 1).
          </p>
        </div>

        {/* Step Diagram Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`relative p-5 rounded-xl border transition-all ${
                  step.highlight
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-sm'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono text-xs font-bold flex items-center justify-center">
                      {step.num}
                    </span>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {step.badge}
                    </span>
                  </div>
                  <Icon
                    className={`w-5 h-5 ${
                      step.highlight ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <div className="text-xs font-mono text-brand-600 dark:text-brand-400 font-medium mb-2">
                  {step.subtitle}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Step Connection Flow Summary Bar */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-center gap-2 text-center">
          <span>OULAD tables</span>
          <span className="text-slate-400">→</span>
          <span>Integrate (unit u)</span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold text-amber-700 dark:text-amber-400">Day-30 Gate</span>
          <span className="text-slate-400">→</span>
          <span>Nested S0/S1/S2</span>
          <span className="text-slate-400">→</span>
          <span>Student-grouped split</span>
          <span className="text-slate-400">→</span>
          <span>Train LR/RF/HGB (5-fold CV)</span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold text-brand-600 dark:text-brand-400">Validation θ* = 0.45</span>
          <span className="text-slate-400">→</span>
          <span>Holdout evaluation</span>
          <span className="text-slate-400">→</span>
          <span>SHAP, Subgroups & Robustness</span>
        </div>
      </div>
    </section>
  );
};

