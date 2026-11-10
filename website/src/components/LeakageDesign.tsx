import React from 'react';
import paperResults from '../data/paper_results.json';
import { ShieldCheck, ShieldAlert, Check, X, Clock } from 'lucide-react';

export const LeakageDesign: React.FC = () => {
  const { cutoff_day, quarantined, scenarios } = paperResults;

  return (
    <section id="leakage-design" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section 4
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Leakage-Safe Temporal Protocol
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Many early warning studies introduce severe temporal data leakage by incorporating course-wide features or post-intake outcomes.
            Our protocol establishes a strict Day-{cutoff_day} boundary: any predictor must be fully observable by Day {cutoff_day} of the course presentation.
          </p>
        </div>

        {/* Visual Timeline Diagram (Day 0 -> Day 30 -> End) */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>Temporal Information Horizon Timeline (as reported in Fig. 3 of manuscript)</span>
          </div>

          <div className="relative">
            {/* Timeline track */}
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full mb-8 relative">
              {/* Highlighted allowed zone (Day 0 to Day 30) */}
              <div className="absolute left-0 top-0 h-full w-[30%] bg-emerald-500 rounded-l-full" />
              {/* Quarantined zone (Day 30 to End) */}
              <div className="absolute left-[30%] top-0 h-full w-[70%] bg-red-400/50 dark:bg-red-900/40 rounded-r-full" />
            </div>

            {/* Timeline Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Day 0 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
                <div className="absolute -top-11 left-6 w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-mono text-xs font-bold flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                  0
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Day 0 (Course Start)
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                  Pre-Commencement Intake
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Static demographic profile, age band, disability status, highest education, IMD deprivation quintile, and registration timing.
                </p>
              </div>

              {/* Day 30 Gate */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-500 dark:border-amber-500/80 relative">
                <div className="absolute -top-11 left-6 w-6 h-6 rounded-full bg-amber-500 text-white font-mono text-xs font-bold flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                  30
                </div>
                <div className="text-sm font-bold text-amber-950 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                  <span>Day 30 (Cutoff Boundary)</span>
                </div>
                <div className="text-xs font-mono text-amber-700 dark:text-amber-400 mb-2">
                  Temporal Prediction Gate
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200">
                  Strict cutoff. Only early continuous assessment scores and high-frequency VLE clickstream interactions on or before Day 30 are retained.
                </p>
              </div>

              {/* End of Presentation */}
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 relative">
                <div className="absolute -top-11 left-6 w-6 h-6 rounded-full bg-red-500 text-white font-mono text-xs font-bold flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                  End
                </div>
                <div className="text-sm font-bold text-red-950 dark:text-red-300 mb-1">
                  Presentation Conclusion
                </div>
                <div className="text-xs font-mono text-red-700 dark:text-red-400 mb-2">
                  Quarantined Data Stream
                </div>
                <p className="text-xs text-red-900 dark:text-red-300">
                  Post-Day-30 clicks, late assignments, unregistration dates, and final examinations are fully quarantined and discarded from model inputs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Allowed vs Quarantined Comparison Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Allowed */}
          <div className="p-5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Allowed Predictors (Observed Day &le; 30)</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Static intake demographics: gender, age band, disability, education level, IMD deprivation quintile.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Early academic progress: assessment submissions and graded scores completed on or before Day 30.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Early behavioral traces: total VLE clicks, active days, and click volumes prior to the Day 30 threshold.</span>
              </li>
            </ul>
          </div>

          {/* Quarantined */}
          <div className="p-5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm mb-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>Quarantined & Excluded (Leakage Risks)</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-900 dark:text-rose-200">
              {quarantined.map((item) => (
                <li key={item} className="flex items-start gap-2 font-mono">
                  <X className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[11px] text-rose-800 dark:text-rose-300/80 leading-normal border-t border-rose-200 dark:border-rose-900/60 pt-2">
              <strong>Rationale:</strong> <code>date_unregistration</code> presence is a deterministic outcome proxy; exams occur at term completion; post-cutoff clicks introduce future information into historical predictions.
            </div>
          </div>
        </div>

        {/* Nested Scenario Progression Table */}
        <div className="mt-10">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Nested Information Scenarios (Summary of Temporal Information Scenarios)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold font-mono border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="py-3 px-4">Scenario</th>
                  <th scope="col" className="py-3 px-4">Name</th>
                  <th scope="col" className="py-3 px-4 text-center">Raw Predictors</th>
                  <th scope="col" className="py-3 px-4 text-center">Transformed Features</th>
                  <th scope="col" className="py-3 px-4">Feature Additions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-mono">
                {scenarios.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">
                      {sc.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white font-sans">
                      {sc.name}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {sc.raw_predictors}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {sc.transformed_features}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-sans text-xs">
                      {sc.adds || 'Static intake demographics and enrollment context'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right text-xs font-mono text-slate-500 dark:text-slate-400">
            Strict nested containment: S0 (13/52) ⊂ S1 (21/60) ⊂ S2 (29/68)
          </div>
        </div>
      </div>
    </section>
  );
};
