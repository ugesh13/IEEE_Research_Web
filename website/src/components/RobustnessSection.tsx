import React from 'react';
import paperResults from '../data/paper_results.json';
import { RefreshCw, Scale, CheckCircle2 } from 'lucide-react';

export const RobustnessSection: React.FC = () => {
  const { robustness } = paperResults;
  const { partition_seeds, seed_statement, class_weighted_variant, decision } = robustness;

  return (
    <section id="robustness" className="py-16 bg-slate-50/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section VIII · Section 9
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Robustness & Sensitivity Analysis
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Evaluating model stability across multiple independent random partitioning seeds and assessing sensitivity to algorithmic class weighting.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Partition Seed Stability */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Partition Seed Stability Evaluation</span>
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  5 Partition Seeds
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                To confirm that predictive discrimination was not an artifact of a single random split assignment,
                the primary model was evaluated across five distinct pseudo-random seeds:
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {partition_seeds.map((seed) => (
                  <div
                    key={seed}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"
                  >
                    <span className="text-slate-400 font-normal">Seed</span>
                    <span>{seed}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mb-1">
                  Manuscript Reported Finding:
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {seed_statement}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Note: Per-seed figures are not reported in the manuscript text; overall consistency is reported.
            </div>
          </div>

          {/* Class-Weighting Sensitivity & Decision */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Class-Weighted Variant Sensitivity</span>
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Section VIII
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Applying inverse class-frequency weighting was examined on the primary HistGradientBoostingClassifier architecture:
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ROC-AUC Delta
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {class_weighted_variant.roc_auc_change.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Negligible discrimination effect
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                  <div className="text-[11px] font-mono text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    Specificity Shift
                  </div>
                  <div className="text-lg font-bold font-mono text-amber-950 dark:text-amber-200 mt-1">
                    {class_weighted_variant.specificity_pct_before.toFixed(2)}% → {class_weighted_variant.specificity_pct_after.toFixed(2)}%
                  </div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-400 mt-0.5">
                    Lower specificity (more false alarms)
                  </div>
                </div>
              </div>

              {/* Final Decision Made */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Methodological Decision Made:</span>
                </div>
                <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-sans">
                  {decision} This comparison was reported on the holdout set, so it is a sensitivity check, not a tuning step.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
              * Showing only reported specificity shifts as specified in the manuscript.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
