import React from 'react';
import paperResults from '../data/paper_results.json';
import { Sparkles, AlertTriangle, Award } from 'lucide-react';

export const ExplainabilitySection: React.FC = () => {
  const { shap } = paperResults;
  const { family_share_pct, dynamic_combined_pct, top_four_raw_predictors, background_observations, aggregated_from_to, caveat } = shap;

  return (
    <section id="explainability" className="py-16 bg-slate-50/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section 7
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Explainability & Feature Attribution (SHAP)
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Shapley Additive Explanations (SHAP) quantify the contribution of each feature to the model's predicted probability P(y=1|x).
            Evaluated on {background_observations} stratified background observations with {aggregated_from_to}.
          </p>
        </div>

        {/* Non-causal Caveat Banner */}
        <div className="mt-8 p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900 dark:text-amber-100">
              Non-Causal Interpretability Caveat:
            </div>
            <p className="mt-0.5">
              Experimental, observational study. Attributions convey predictive association, not causal effects.
            </p>
            <p className="text-amber-800 dark:text-amber-300 text-xs mt-1">
              {caveat} <span className="font-semibold">[Website note (not from the manuscript): Artificially inducing student clicks or logging interactions will not increase subject mastery.]</span>
            </p>
          </div>
        </div>

        {/* SHAP Family Shares Chart (3 families + 65.83% combined) */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Feature Family SHAP Attribution Shares</span>
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Table V & Fig. 11
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono">
              Aggregated across 29 raw predictors ({aggregated_from_to})
            </p>

            {/* Accessible SVG Bar Chart for Family Shares */}
            <div className="relative">
              <svg
                className="w-full h-52 overflow-visible"
                viewBox="0 0 520 180"
                role="img"
                aria-label="Bar chart of SHAP family shares: Academic Milestones 33.22%, VLE Engagement 32.61%, Static Intake 34.17%, Combined Dynamic 65.83%"
              >
                <title>SHAP Feature Family Attribution</title>
                {/* Horizontal guide lines */}
                <line x1="50" y1="20" x2="500" y2="20" stroke="currentColor" className="text-slate-100 dark:text-slate-700/60" strokeDasharray="3 3" />
                <line x1="50" y1="60" x2="500" y2="60" stroke="currentColor" className="text-slate-100 dark:text-slate-700/60" strokeDasharray="3 3" />
                <line x1="50" y1="100" x2="500" y2="100" stroke="currentColor" className="text-slate-100 dark:text-slate-700/60" strokeDasharray="3 3" />
                <line x1="50" y1="140" x2="500" y2="140" stroke="currentColor" className="text-slate-300 dark:text-slate-600" />

                {/* Y Axis Labels */}
                <text x="40" y="24" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">70%</text>
                <text x="40" y="64" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">50%</text>
                <text x="40" y="104" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">25%</text>
                <text x="40" y="144" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">0%</text>

                {/* Bar 1: Academic Milestones (33.22%) */}
                {/* Scale: 0% is at y=140, 70% is at y=20 (120 px for 70% -> 1.714 px per 1%) */}
                {/* Height for 33.22%: 33.22 * 1.714 = 56.94 -> y = 140 - 56.94 = 83.06 */}
                <g className="group cursor-pointer">
                  <rect
                    x="75"
                    y="83.06"
                    width="65"
                    height="56.94"
                    rx="4"
                    className="fill-blue-500 hover:opacity-90 transition-opacity"
                  />
                  <text x="107.5" y="75" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900 dark:fill-white">
                    {family_share_pct.academic_milestones.toFixed(2)}%
                  </text>
                  <text x="107.5" y="156" textAnchor="middle" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">
                    Academic
                  </text>
                  <text x="107.5" y="167" textAnchor="middle" className="text-[9px] fill-slate-400">
                    (Milestones)
                  </text>
                </g>

                {/* Bar 2: VLE Digital Engagement (32.61%) */}
                {/* Height for 32.61%: 32.61 * 1.714 = 55.89 -> y = 140 - 55.89 = 84.11 */}
                <g className="group cursor-pointer">
                  <rect
                    x="180"
                    y="84.11"
                    width="65"
                    height="55.89"
                    rx="4"
                    className="fill-cyan-500 hover:opacity-90 transition-opacity"
                  />
                  <text x="212.5" y="76" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900 dark:fill-white">
                    {family_share_pct.vle_digital_engagement.toFixed(2)}%
                  </text>
                  <text x="212.5" y="156" textAnchor="middle" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">
                    VLE Clicks
                  </text>
                  <text x="212.5" y="167" textAnchor="middle" className="text-[9px] fill-slate-400">
                    (Engagement)
                  </text>
                </g>

                {/* Bar 3: Static Intake & Context (34.17%) */}
                {/* Height for 34.17%: 34.17 * 1.714 = 58.57 -> y = 140 - 58.57 = 81.43 */}
                <g className="group cursor-pointer">
                  <rect
                    x="285"
                    y="81.43"
                    width="65"
                    height="58.57"
                    rx="4"
                    className="fill-slate-500 hover:opacity-90 transition-opacity"
                  />
                  <text x="317.5" y="73" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900 dark:fill-white">
                    {family_share_pct.static_intake_and_context.toFixed(2)}%
                  </text>
                  <text x="317.5" y="156" textAnchor="middle" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">
                    Static Intake
                  </text>
                  <text x="317.5" y="167" textAnchor="middle" className="text-[9px] fill-slate-400">
                    (& Demographics)
                  </text>
                </g>

                {/* Bar 4: Combined Dynamic (65.83%) */}
                {/* Height for 65.83%: 65.83 * 1.714 = 112.83 -> y = 140 - 112.83 = 27.17 */}
                <g className="group cursor-pointer">
                  <rect
                    x="400"
                    y="27.17"
                    width="75"
                    height="112.83"
                    rx="4"
                    className="fill-indigo-600 dark:fill-indigo-500 hover:opacity-90 transition-opacity"
                  />
                  <text x="437.5" y="20" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900 dark:fill-white">
                    {dynamic_combined_pct.toFixed(2)}%
                  </text>
                  <text x="437.5" y="156" textAnchor="middle" className="text-[10px] font-mono font-bold fill-indigo-700 dark:fill-indigo-300">
                    Combined
                  </text>
                  <text x="437.5" y="167" textAnchor="middle" className="text-[9px] fill-slate-400">
                    (Academic + VLE)
                  </text>
                </g>
              </svg>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span>Dynamic Behavioral Share:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {dynamic_combined_pct.toFixed(2)}% (Academic + VLE)
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                <strong>Family Share Structure:</strong> The static intake family is the largest single family (34.17%) while the two dynamic families together are 65.83%.
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-2">
                <strong>Derived Average Share per Predictor:</strong> Per raw predictor, static intake averages 34.17 / 13 = 2.63 percentage points, academic milestones average 33.22 / 8 = 4.15 percentage points, and VLE engagement averages 32.61 / 8 = 4.08 percentage points.
              </div>
              <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/60 font-sans leading-relaxed">
                A recomputation on a different local run (holdout N=4,859) gave different family shares and top predictors (VLE share 26.48% vs 32.61% reported; top recomputed predictor is code_module). See{' '}
                <a href="#supplementary" className="underline font-semibold hover:text-amber-900 dark:hover:text-amber-100">
                  Supplement C
                </a>.
              </div>
            </div>
          </div>

          {/* Top 4 Raw Predictors */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Four Top Raw Predictors</span>
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Top Predictors
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              The four highest-ranked predictors identified by Shapley attribution on Day &le; 30 data (descriptions from Table XXII in repository):
            </p>

            <div className="space-y-3">
              {top_four_raw_predictors.map((predictorName, idx) => (
                <div
                  key={predictorName}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-md bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate">
                      {predictorName}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {idx === 0 && 'Mean score across Day <= 30 graded assessment submissions (repository description)'}
                      {idx === 1 && 'Number of distinct days student logged into VLE by Day 30 (repository description)'}
                      {idx === 2 && 'Total raw digital click interactions recorded by Day 30 (repository description)'}
                      {idx === 3 && 'Indicator whether any assessment was submitted by Day 30 (repository description)'}
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-brand-600 dark:text-brand-400">
                      {idx === 0 || idx === 3 ? 'Academic Milestones Family' : 'VLE Digital Engagement Family'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg bg-slate-100 dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Technical Context:</span> Computed with <code>{background_observations}</code> stratified training background samples. Attributions reflect observational associations with predicted risk.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
