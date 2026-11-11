import React from 'react';
import paperResults from '../data/paper_results.json';
import { AlertCircle, BarChart2, Scale } from 'lucide-react';

export const SubgroupsSection: React.FC = () => {
  const { subgroups_recall_at_threshold_0_45, subgroup_note, threshold } = paperResults;

  // Disability FPR comparison items
  const noDisability = subgroups_recall_at_threshold_0_45.find(
    (s) => s.stratum.toLowerCase().includes('no declared')
  );
  const declaredDisability = subgroups_recall_at_threshold_0_45.find(
    (s) => s.stratum.toLowerCase() === 'declared disability'
  );

  return (
    <section id="subgroups" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section 8
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Descriptive Subgroup Performance
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Evaluating performance under the fixed operational threshold θ* = {threshold.value.toFixed(2)} across demographic and socioeconomic strata.
          </p>
        </div>

        {/* Prominent Mandatory Descriptive Note */}
        <div className="mt-8 p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-900 dark:text-amber-100">
              Descriptive Stratum Evaluation Notice (as reported in the manuscript):
            </div>
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Subgroup results are descriptive and are not fairness conclusions.
            </p>
            <p className="text-amber-800 dark:text-amber-300 text-xs">
              {subgroup_note} No confidence interval or sample size is reported for these strata in the manuscript.
            </p>
          </div>
        </div>

        {/* Subgroup Recall Bar Chart (Fig. 12) - Full 0-1.0 scale */}
        <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>At-Risk Recall by Subgroup Stratum (θ = {threshold.value.toFixed(2)})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Full 0 to 1.0 (0–100 percentage points) axis scale across all eight manuscript strata (Fig. 12)
              </p>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Holdout Evaluation
            </div>
          </div>

          {/* Axis Labels / Grid Guide Header */}
          <div className="relative mb-2 h-4 border-b border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400 flex justify-between px-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>1.0 (100 pts)</span>
          </div>

          {/* Accessible SVG Bar Chart for Subgroup Recalls */}
          <div className="space-y-3">
            {subgroups_recall_at_threshold_0_45.map((item) => {
              // Full 0% to 100% bar scale
              const widthPct = Math.max(0, Math.min(100, item.recall_pct));

              return (
                <div key={`${item.attribute}-${item.stratum}`} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      <span className="text-slate-400 dark:text-slate-500 mr-2 font-sans font-normal">[{item.attribute}]</span>
                      {item.stratum}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.recall_pct.toFixed(2)}%
                    </span>
                  </div>

                  <div className="h-6 w-full bg-slate-100 dark:bg-slate-700/60 rounded-md overflow-hidden relative">
                    {/* Gridlines at 25%, 50%, 75% */}
                    <div className="absolute top-0 bottom-0 left-[25%] border-r border-slate-200/80 dark:border-slate-600/60 pointer-events-none" />
                    <div className="absolute top-0 bottom-0 left-[50%] border-r border-slate-200/80 dark:border-slate-600/60 pointer-events-none" />
                    <div className="absolute top-0 bottom-0 left-[75%] border-r border-slate-200/80 dark:border-slate-600/60 pointer-events-none" />
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-brand-500 dark:from-brand-500 dark:to-brand-400 rounded-md transition-all duration-300"
                      style={{ width: `${widthPct}%` }}
                      role="progressbar"
                      aria-valuenow={item.recall_pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${item.stratum} recall: ${item.recall_pct.toFixed(2)}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
            <span>Scale baseline axis: 0.00%</span>
            <span>Scale maximum axis: 1.00 (100 percentage points)</span>
          </div>
        </div>

        {/* Disability False Positive Rate Comparison Card */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Declared Disability False Positive Rate (FPR) Comparison</span>
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Table VI in manuscript
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            While sensitivity (At-Risk Recall) remained comparable between students with declared disability (83.33%) and without (82.26%),
            a descriptive difference appears in the reported False Positive Rates under the uniform θ* = 0.45 operational cutoff:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* No declared disability */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                No Declared Disability
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {noDisability?.fpr_pct !== null && noDisability?.fpr_pct !== undefined
                  ? `${noDisability.fpr_pct.toFixed(2)}%`
                  : 'not reported'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                False Positive Rate (Recall: {noDisability?.recall_pct.toFixed(2)}%)
              </div>
            </div>

            {/* Declared disability */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/70">
              <div className="text-xs font-mono text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                Declared Disability
              </div>
              <div className="text-3xl font-extrabold font-mono text-amber-900 dark:text-amber-100">
                {declaredDisability?.fpr_pct !== null && declaredDisability?.fpr_pct !== undefined
                  ? `${declaredDisability.fpr_pct.toFixed(2)}%`
                  : 'not reported'}
              </div>
              <div className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                False Positive Rate (Recall: {declaredDisability?.recall_pct.toFixed(2)}%)
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-100/60 dark:bg-amber-950/60 text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-sans">
            <strong>Descriptive Note:</strong> In the holdout evaluation, students with declared disabilities have a reported false positive rate of 39.25% compared to 30.55% for students without declared disabilities. No confidence interval or sample size is reported for these strata in the manuscript.
          </div>
        </div>

        {/* Complete Table VI: Descriptive Subgroup Evaluation */}
        <div className="mt-10">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Table VI: Descriptive Subgroup Evaluation (as reported in the manuscript)
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold font-mono border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="py-3 px-4">Attribute</th>
                  <th scope="col" className="py-3 px-4">Stratum</th>
                  <th scope="col" className="py-3 px-4 text-center">At-Risk Recall</th>
                  <th scope="col" className="py-3 px-4 text-center">False Positive Rate (FPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-mono">
                {subgroups_recall_at_threshold_0_45.map((row) => (
                  <tr key={`${row.attribute}-${row.stratum}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {row.attribute}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white font-sans">
                      {row.stratum}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-brand-700 dark:text-brand-300">
                      {row.recall_pct.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {row.fpr_pct !== null && row.fpr_pct !== undefined ? (
                        <span className="font-bold text-slate-900 dark:text-white">
                          {row.fpr_pct.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal italic">
                          not reported in the manuscript
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
