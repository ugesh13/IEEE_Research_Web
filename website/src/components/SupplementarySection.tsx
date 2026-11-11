import React from 'react';
import supplementaryData from '../data/supplementary.json';
import { Database, FileCode, Users, Activity, AlertCircle } from 'lucide-react';

export const SupplementarySection: React.FC = () => {
  const { s2_validation_models, subgroup_sample_sizes, day30_active_sensitivity } = supplementaryData;

  return (
    <section id="supplementary" className="py-16 bg-slate-100/80 dark:bg-slate-950 border-y-2 border-dashed border-slate-300 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-800 mb-3">
            <Database className="w-3.5 h-3.5" />
            <span>Repository Supplement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Supplementary repository results (not in the manuscript)
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            These results are computed from the repository code and data tables to provide additional experimental context.
            They are not part of the primary manuscript text.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="mt-6 p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 text-purple-950 dark:text-purple-200 text-xs leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Provenance Note:</strong> All numbers in this section are extracted from repository output files and tables.
            They are presented here for transparency and comprehensive peer examination.
          </div>
        </div>

        <div className="mt-10 space-y-12">
          {/* Sub-item A: S2 Validation Model Comparison */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>A. Scenario S2 Validation Model Comparison</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Source: <code>{s2_validation_models.source}</code>
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {s2_validation_models.partition}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-4 font-sans">Model Architecture</th>
                    <th className="py-2.5 px-4 text-center">ROC-AUC</th>
                    <th className="py-2.5 px-4 text-center">PR-AUC</th>
                    <th className="py-2.5 px-4 text-center">At-Risk Recall</th>
                    <th className="py-2.5 px-4 text-center">At-Risk Precision</th>
                    <th className="py-2.5 px-4 text-center">At-Risk F1</th>
                    <th className="py-2.5 px-4 text-center">Brier Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {s2_validation_models.models.map((m) => (
                    <tr key={m.model} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white font-sans">
                        {m.model}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-brand-700 dark:text-brand-300">
                        {m.roc_auc.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-700 dark:text-slate-300">
                        {m.pr_auc.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 dark:text-emerald-400 font-bold">
                        {m.recall_pct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-700 dark:text-slate-300">
                        {m.precision_pct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-4 text-center text-purple-700 dark:text-purple-300 font-bold">
                        {m.f1.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400">
                        {m.brier.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-item B: Per-Stratum Sample Sizes for Manuscript Table VI */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>B. Holdout Sample Sizes for Manuscript Table VI Strata</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Source: <code>{subgroup_sample_sizes.source}</code>
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {subgroup_sample_sizes.partition}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-4 font-sans">Attribute</th>
                    <th className="py-2.5 px-4 font-sans">Stratum</th>
                    <th className="py-2.5 px-4 text-center">Observations (n)</th>
                    <th className="py-2.5 px-4 text-center">Unique Students</th>
                    <th className="py-2.5 px-4 text-center">At-Risk Count</th>
                    <th className="py-2.5 px-4 text-center">Successful Count</th>
                    <th className="py-2.5 px-4 text-center">At-Risk Prevalence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subgroup_sample_sizes.strata.map((row) => (
                    <tr key={`${row.attribute}-${row.stratum}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 font-sans">
                        {row.attribute}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white font-sans">
                        {row.stratum}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900 dark:text-white">
                        {row.observations.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400">
                        {row.unique_students.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 dark:text-emerald-400">
                        {row.at_risk_count.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-center text-blue-700 dark:text-blue-400">
                        {row.successful_count.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-700 dark:text-slate-300">
                        {row.at_risk_prevalence_pct.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-item C: Part A4 Sensitivity Result */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>C. Sensitivity Audit: Predictions for Students Active at Day 30</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Source: <code>{day30_active_sensitivity.source}</code> (evaluated at θ* = 0.45)
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Filter: date_unregistration &gt; 30 or missing
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              In the holdout dataset, <strong>{day30_active_sensitivity.unregistered_early_observations.toLocaleString()}</strong> enrollments ({day30_active_sensitivity.unregistered_early_share_pct}%)
              were officially unregistered on or before Day 30 ({day30_active_sensitivity.unregistered_early_outcome}).
              Because these students had minimal or zero activity by Day 30, they are readily detected.
              Evaluating the frozen model solely on students actively enrolled at Day 30 provides an informative sensitivity boundary:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-4 font-sans">Evaluation Cohort</th>
                    <th className="py-2.5 px-4 text-center">Observations</th>
                    <th className="py-2.5 px-4 text-center">At-Risk Rate</th>
                    <th className="py-2.5 px-4 text-center">ROC-AUC</th>
                    <th className="py-2.5 px-4 text-center">Recall</th>
                    <th className="py-2.5 px-4 text-center">Precision</th>
                    <th className="py-2.5 px-4 text-center">F1-Score</th>
                    <th className="py-2.5 px-4 text-center">TP / FN / FP / TN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {day30_active_sensitivity.cohorts.map((c) => (
                    <tr key={c.cohort} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white font-sans">
                        {c.cohort}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900 dark:text-white">
                        {c.observations.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400">
                        {c.at_risk_prevalence_pct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-brand-700 dark:text-brand-300">
                        {c.roc_auc.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 dark:text-emerald-400 font-bold">
                        {c.recall_pct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-700 dark:text-slate-300">
                        {c.precision_pct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-4 text-center text-purple-700 dark:text-purple-300 font-bold">
                        {c.f1.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-500 text-[11px]">
                        {c.tp} / {c.fn} / {c.fp} / {c.tn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

