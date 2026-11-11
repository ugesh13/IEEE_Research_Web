import React from 'react';
import paperResults from '../data/paper_results.json';
import { Layers, Cpu, Award } from 'lucide-react';

export const ExperimentalDesign: React.FC = () => {
  const { partitions, models, primary_model } = paperResults;

  const partitionList = [
    {
      name: 'Training',
      role: 'Model parameter learning & grouped 5-fold CV',
      obs: partitions.train.observations,
      students: partitions.train.students,
      share: '70.00%',
      colorClass: 'text-brand-600 dark:text-brand-400',
    },
    {
      name: 'Validation',
      role: 'Model selection & threshold optimization (θ* = 0.45)',
      obs: partitions.validation.observations,
      students: partitions.validation.students,
      share: '15.00%',
      colorClass: 'text-amber-600 dark:text-amber-400',
    },
    {
      name: 'Holdout Test',
      role: 'Locked holdout (not used for model or threshold selection) (2,582 at-risk, 2,307 successful)',
      obs: partitions.holdout.observations,
      students: partitions.holdout.students,
      share: '15.00%',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <section id="experimental-design" className="py-16 bg-slate-50/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section 5
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Experimental Design & Model Architectures
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            To prevent cross-partition contamination from repeating students (11.7%), partitioning is performed strictly at the student level using random seed {partitions.seed}.
            Model comparison uses {partitions.cross_validation} cross-validation strictly on the training partition.
          </p>
        </div>

        {/* Partition Summary Table */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Student-Level Grouped Partitions (Seed {partitions.seed}, 0 Student Overlap)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Total: 32,593 obs (28,785 students)
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold font-mono border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="py-3 px-4">Partition</th>
                  <th scope="col" className="py-3 px-4 text-center">Observations</th>
                  <th scope="col" className="py-3 px-4 text-center">Distinct Students</th>
                  <th scope="col" className="py-3 px-4 text-center">Nominal Ratio</th>
                  <th scope="col" className="py-3 px-4">Methodological Function</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-mono">
                {partitionList.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className={`py-3 px-4 font-bold ${p.colorClass}`}>
                      {p.name}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                      {p.obs.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300">
                      {p.students.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 dark:text-slate-400">
                      {p.share}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-sans text-xs">
                      {p.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            * No student overlap (as stated in the manuscript): (Train ∩ Validation = ∅, Train ∩ Holdout = ∅, Validation ∩ Holdout = ∅).
          </div>
        </div>

        {/* Model Specifications */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Model Specifications & Hyperparameters</span>
            </h3>
            <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 flex-wrap">
              <Award className="w-3.5 h-3.5" />
              <span>Primary: {primary_model}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {models.map((m) => {
              const isPrimary = m.name.includes('HistGradientBoostingClassifier');
              return (
                <div
                  key={m.name}
                  className={`min-w-0 p-5 rounded-xl border transition-all ${isPrimary
                      ? 'bg-brand-50/50 dark:bg-brand-950/20 border-brand-300 dark:border-brand-700/80 ring-1 ring-brand-500/20 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {isPrimary ? 'Primary Selected Model' : 'Candidate Baseline'}
                    </span>
                    {isPrimary && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-600 text-white">
                        Best Performer
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 break-words">
                    {m.name}
                  </h4>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed break-words">
                    {m.params || m.note}
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                    {m.name.includes('Logistic') && 'Standard linear baseline with regularized log-loss.'}
                    {m.name.includes('Forest') && 'Bagged ensemble of decorrelated decision trees.'}
                    {m.name.includes('HistGradient') && 'Histogram-binned gradient boosting with native missingness handling.'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
