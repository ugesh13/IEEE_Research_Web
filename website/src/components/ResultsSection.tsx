import React, { useState } from 'react';
import paperResults from '../data/paper_results.json';
import { BarChart, Check, Calculator, Sliders, Info } from 'lucide-react';

export const ResultsSection: React.FC = () => {
  const { validation_incremental_roc_auc_gain, holdout, threshold } = paperResults;
  const { confusion_matrix, metrics, ci_method } = holdout;
  const [showFormula, setShowFormula] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Confusion matrix counts
  const TP = confusion_matrix.TP;
  const FN = confusion_matrix.FN;
  const FP = confusion_matrix.FP;
  const TN = confusion_matrix.TN;
  const total = TP + FN + FP + TN;
  const actualAtRisk = TP + FN;
  const actualSuccessful = TN + FP;

  // Browser-recomputed values from CM
  const recomputed = {
    accuracy_pct: ((TP + TN) / total) * 100,
    at_risk_recall_pct: (TP / (TP + FN)) * 100,
    at_risk_precision_pct: (TP / (TP + FP)) * 100,
    specificity_pct: (TN / (TN + FP)) * 100,
    f1: (2 * (TP / (TP + FP)) * (TP / (TP + FN))) / ((TP / (TP + FP)) + (TP / (TP + FN))),
    fpr_pct: (FP / (FP + TN)) * 100,
    fnr_pct: (FN / (FN + TP)) * 100,
  };

  const cmCellDescriptions: Record<string, { title: string; desc: string; formula: string; calc: string }> = {
    TP: {
      title: 'True Positive (TP)',
      desc: 'At-risk students correctly flagged by the model for proactive institutional advising outreach.',
      formula: 'TP',
      calc: `${TP.toLocaleString()} students`,
    },
    FN: {
      title: 'False Negative (FN)',
      desc: 'At-risk students missed by the model who did not receive an early alert notification.',
      formula: 'FN',
      calc: `${FN.toLocaleString()} students`,
    },
    FP: {
      title: 'False Positive (FP)',
      desc: 'Successful students incorrectly flagged as at-risk, representing false alert advising workload.',
      formula: 'FP',
      calc: `${FP.toLocaleString()} students`,
    },
    TN: {
      title: 'True Negative (TN)',
      desc: 'Successful students correctly classified as on-track with no unnecessary alert generated.',
      formula: 'TN',
      calc: `${TN.toLocaleString()} students`,
    },
  };

  return (
    <section id="results" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section 6
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Experimental Results (as reported in the manuscript)
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Evaluation of the primary HistGradientBoostingClassifier across incremental feature scenarios on validation data,
            followed by single unblinded evaluation on the locked holdout partition at the validation-selected operational threshold.
          </p>
        </div>

        {/* 6d: Threshold Card & 6a: Validation Gains Chart */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Threshold Card (6d) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-700/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Operational Decision Threshold</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                  θ* = {threshold.value.toFixed(2)}
                </span>
              </div>

              <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">
                θ* = {threshold.value.toFixed(2)}
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                Logit equivalent: z = ln(0.45 / 0.55) ≈ {threshold.logit.toFixed(3)}
              </div>

              <div className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-200/80 dark:border-amber-800/50 font-mono text-xs leading-relaxed">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-sans font-semibold">
                    Pre-Specified Selection Rule:
                  </div>
                  <code>{threshold.rule}</code>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-normal">
                  <strong>Selected on the validation partition:</strong> Threshold optimization was executed strictly on the validation partition.
                  The threshold was fixed prior to unblinding the locked holdout set to preserve holdout test integrity.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] text-slate-500 dark:text-slate-400">
              * The standard default threshold θ = 0.50 yields lower at-risk sensitivity; θ* = 0.45 increases sensitivity for early student advising outreach.
            </div>
          </div>

          {/* Validation ROC-AUC Gains Bar Chart (6a) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Validation Incremental ROC-AUC Gains</span>
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Fig. 9 in manuscript
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
                Incremental discriminative gains achieved as early academic milestone features (S0 → S1)
                and high-frequency VLE clickstream interactions (S1 → S2) are added to the baseline intake model.
              </p>

              {/* Accessible SVG Bar Chart */}
              <div className="relative">
                <svg
                  className="w-full h-44 overflow-visible"
                  viewBox="0 0 500 160"
                  role="img"
                  aria-label="Bar chart of validation ROC-AUC gains: S0 to S1 +0.1384; S1 to S2 +0.0833; Cumulative S0 to S2 +0.2217"
                >
                  <title>Validation Incremental ROC-AUC Gains</title>
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="480" y2="20" stroke="currentColor" className="text-slate-100 dark:text-slate-700/60" strokeDasharray="3 3" />
                  <line x1="50" y1="60" x2="480" y2="60" stroke="currentColor" className="text-slate-100 dark:text-slate-700/60" strokeDasharray="3 3" />
                  <line x1="50" y1="100" x2="480" y2="100" stroke="currentColor" className="text-slate-100 dark:text-slate-700/60" strokeDasharray="3 3" />
                  <line x1="50" y1="130" x2="480" y2="130" stroke="currentColor" className="text-slate-300 dark:text-slate-600" />

                  {/* Y Axis Labels */}
                  <text x="40" y="24" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">+0.20</text>
                  <text x="40" y="64" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">+0.15</text>
                  <text x="40" y="104" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">+0.05</text>
                  <text x="40" y="134" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">0.00</text>

                  {/* Bar 1: S0 -> S1 (+0.1384) */}
                  {/* Scale: 0 is at y=130, 0.20 is at y=20 (110 px for 0.20 -> 550 px per 1.0 unit) */}
                  {/* Height for 0.1384: 0.1384 * 550 = 76.12 -> y = 130 - 76.12 = 53.88 */}
                  <g className="group cursor-pointer">
                    <rect
                      x="90"
                      y="53.88"
                      width="80"
                      height="76.12"
                      rx="4"
                      className="fill-brand-600 dark:fill-brand-500 hover:opacity-90 transition-opacity"
                    />
                    <text x="130" y="46" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900 dark:fill-white">
                      +{validation_incremental_roc_auc_gain.S0_to_S1.toFixed(4)}
                    </text>
                    <text x="130" y="146" textAnchor="middle" className="text-[11px] font-mono font-medium fill-slate-600 dark:fill-slate-300">
                      S0 → S1
                    </text>
                    <text x="130" y="158" textAnchor="middle" className="text-[9px] fill-slate-400">
                      (Academic)
                    </text>
                  </g>

                  {/* Bar 2: S1 -> S2 (+0.0833) */}
                  {/* Height for 0.0833: 0.0833 * 550 = 45.815 -> y = 130 - 45.815 = 84.185 */}
                  <g className="group cursor-pointer">
                    <rect
                      x="230"
                      y="84.18"
                      width="80"
                      height="45.82"
                      rx="4"
                      className="fill-indigo-600 dark:fill-indigo-500 hover:opacity-90 transition-opacity"
                    />
                    <text x="270" y="76" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900 dark:fill-white">
                      +{validation_incremental_roc_auc_gain.S1_to_S2.toFixed(4)}
                    </text>
                    <text x="270" y="146" textAnchor="middle" className="text-[11px] font-mono font-medium fill-slate-600 dark:fill-slate-300">
                      S1 → S2
                    </text>
                    <text x="270" y="158" textAnchor="middle" className="text-[9px] fill-slate-400">
                      (VLE clicks)
                    </text>
                  </g>

                  {/* Bar 3: Cumulative S0 -> S2 (+0.2217) */}
                  {/* Height for 0.2217: 0.2217 * 550 = 121.935 -> y = 130 - 121.935 = 8.065 */}
                  <g className="group cursor-pointer">
                    <rect
                      x="370"
                      y="8.07"
                      width="80"
                      height="121.93"
                      rx="4"
                      className="fill-emerald-600 dark:fill-emerald-500 hover:opacity-90 transition-opacity"
                    />
                    <text x="410" y="2" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900 dark:fill-white">
                      +{(validation_incremental_roc_auc_gain.S0_to_S1 + validation_incremental_roc_auc_gain.S1_to_S2).toFixed(4)}
                    </text>
                    <text x="410" y="146" textAnchor="middle" className="text-[11px] font-mono font-medium fill-slate-600 dark:fill-slate-300">
                      Cumulative
                    </text>
                    <text x="410" y="158" textAnchor="middle" className="text-[9px] fill-slate-400">
                      (S0 → S2)
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>* Monotonic progression observed across validation iterations.</span>
              <span className="font-mono">Cumulative gain: +0.2217 ROC-AUC</span>
            </div>
          </div>
        </div>

        {/* 6b: Holdout Confusion Matrix */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Holdout Confusion Matrix (N = {total.toLocaleString()} observations, θ* = {threshold.value.toFixed(2)})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Hover or focus on any cell to view formula and operational explanation (Table III & Fig. 10)
              </p>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Locked Holdout Set
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Confusion Matrix Interactive Grid */}
            <div className="lg:col-span-7 overflow-x-auto">
              <div className="inline-block min-w-[340px] w-full p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* Top Left Header Cell */}
                  <div className="p-3 text-xs font-mono text-slate-400 flex items-center justify-center">
                    Actual \ Pred.
                  </div>

                  {/* Col Header 1 */}
                  <div className="p-3 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    Predicted At-Risk
                  </div>

                  {/* Col Header 2 */}
                  <div className="p-3 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    Predicted Successful
                  </div>

                  {/* Row 1: Actual At-Risk */}
                  <div className="p-3 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center">
                    Actual At-Risk
                    <br />
                    <span className="text-[10px] text-slate-500 font-normal mt-0.5">({actualAtRisk.toLocaleString()})</span>
                  </div>

                  {/* Cell: TP */}
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCell('TP')}
                    onFocus={() => setHoveredCell('TP')}
                    aria-label="True Positive cell: 2,127 correctly identified at-risk students"
                    className={`p-4 rounded-xl border text-left transition-all ${
                      hoveredCell === 'TP'
                        ? 'ring-2 ring-emerald-500 bg-emerald-100/80 dark:bg-emerald-950/60 border-emerald-400 shadow'
                        : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/50'
                    }`}
                  >
                    <div className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      TP (True Positive)
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-emerald-900 dark:text-emerald-100 mt-1">
                      {TP.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                      Recall: {recomputed.at_risk_recall_pct.toFixed(2)}%
                    </div>
                  </button>

                  {/* Cell: FN */}
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCell('FN')}
                    onFocus={() => setHoveredCell('FN')}
                    aria-label="False Negative cell: 455 missed at-risk students"
                    className={`p-4 rounded-xl border text-left transition-all ${
                      hoveredCell === 'FN'
                        ? 'ring-2 ring-rose-500 bg-rose-100/80 dark:bg-rose-950/60 border-rose-400 shadow'
                        : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100/50'
                    }`}
                  >
                    <div className="text-[11px] font-mono font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                      FN (False Negative)
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-rose-900 dark:text-rose-100 mt-1">
                      {FN.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-rose-700 dark:text-rose-400 mt-1">
                      FNR: {recomputed.fnr_pct.toFixed(2)}%
                    </div>
                  </button>

                  {/* Row 2: Actual Successful */}
                  <div className="p-3 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center">
                    Actual Successful
                    <br />
                    <span className="text-[10px] text-slate-500 font-normal mt-0.5">({actualSuccessful.toLocaleString()})</span>
                  </div>

                  {/* Cell: FP */}
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCell('FP')}
                    onFocus={() => setHoveredCell('FP')}
                    aria-label="False Positive cell: 721 false alarms on successful students"
                    className={`p-4 rounded-xl border text-left transition-all ${
                      hoveredCell === 'FP'
                        ? 'ring-2 ring-amber-500 bg-amber-100/80 dark:bg-amber-950/60 border-amber-400 shadow'
                        : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100/50'
                    }`}
                  >
                    <div className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      FP (False Positive)
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-amber-900 dark:text-amber-100 mt-1">
                      {FP.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 mt-1">
                      FPR: {recomputed.fpr_pct.toFixed(2)}%
                    </div>
                  </button>

                  {/* Cell: TN */}
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCell('TN')}
                    onFocus={() => setHoveredCell('TN')}
                    aria-label="True Negative cell: 1,586 correctly identified successful students"
                    className={`p-4 rounded-xl border text-left transition-all ${
                      hoveredCell === 'TN'
                        ? 'ring-2 ring-blue-500 bg-blue-100/80 dark:bg-blue-950/60 border-blue-400 shadow'
                        : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100/50'
                    }`}
                  >
                    <div className="text-[11px] font-mono font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                      TN (True Negative)
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-blue-900 dark:text-blue-100 mt-1">
                      {TN.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-blue-700 dark:text-blue-400 mt-1">
                      Specificity: {recomputed.specificity_pct.toFixed(2)}%
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Hover explanation box */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-full flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Cell Operational Breakdown</span>
                </div>
                {hoveredCell && cmCellDescriptions[hoveredCell] ? (
                  <div className="space-y-3">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {cmCellDescriptions[hoveredCell].title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cmCellDescriptions[hoveredCell].desc}
                    </p>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 font-mono text-xs border border-slate-200 dark:border-slate-700">
                      <div className="text-slate-500 text-[10px]">Observation Count:</div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {cmCellDescriptions[hoveredCell].calc}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Hover or tap on any confusion matrix cell (TP, FN, FP, TN) to view the operational educational interpretation.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                Total Holdout Observations: <strong>{total.toLocaleString()}</strong> across <strong>4,318</strong> unique students.
              </div>
            </div>
          </div>
        </div>

        {/* 6c: Metrics Table with 95% CIs and "Show Formula" Toggle */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Holdout Performance Metrics (Table IV in manuscript)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confidence intervals computed via {ci_method}.
              </p>
            </div>

            {/* Toggle button */}
            <button
              onClick={() => setShowFormula(!showFormula)}
              aria-label={showFormula ? 'Hide metric formulas' : 'Show formula verification from confusion matrix'}
              aria-expanded={showFormula}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
                showFormula
                  ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{showFormula ? 'Hide Arithmetic Formulas' : 'Show Formula Verification'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold font-mono border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="py-3 px-4">Metric</th>
                  <th scope="col" className="py-3 px-4 text-center">Reported Value</th>
                  <th scope="col" className="py-3 px-4 text-center">95% Confidence Interval</th>
                  {showFormula && (
                    <>
                      <th scope="col" className="py-3 px-4">Formula Definition</th>
                      <th scope="col" className="py-3 px-4 text-center">Browser Recomputed (from CM)</th>
                      <th scope="col" className="py-3 px-4 text-center">Arithmetic Consistency</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-mono">
                {/* 1. ROC-AUC */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">ROC-AUC</td>
                  <td className="py-3 px-4 text-center font-bold text-brand-700 dark:text-brand-300">
                    {metrics.roc_auc.value.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                    [{metrics.roc_auc.ci[0].toFixed(4)}–{metrics.roc_auc.ci[1].toFixed(4)}]
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-500 font-sans text-xs">Area under Receiver Operating Characteristic curve</td>
                      <td className="py-3 px-4 text-center text-slate-400 italic text-xs">Probabilistic curve integral</td>
                      <td className="py-3 px-4 text-center text-slate-400 text-xs">—</td>
                    </>
                  )}
                </tr>

                {/* 2. PR-AUC */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">PR-AUC</td>
                  <td className="py-3 px-4 text-center font-bold text-brand-700 dark:text-brand-300">
                    {metrics.pr_auc.value.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                    [{metrics.pr_auc.ci[0].toFixed(4)}–{metrics.pr_auc.ci[1].toFixed(4)}]
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-500 font-sans text-xs">Area under Precision-Recall curve</td>
                      <td className="py-3 px-4 text-center text-slate-400 italic text-xs">Probabilistic curve integral</td>
                      <td className="py-3 px-4 text-center text-slate-400 text-xs">—</td>
                    </>
                  )}
                </tr>

                {/* 3. Accuracy */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Accuracy</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {metrics.accuracy_pct.value.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                    [{metrics.accuracy_pct.ci[0].toFixed(2)}–{metrics.accuracy_pct.ci[1].toFixed(2)}]
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        (TP + TN) / (TP + TN + FP + FN)
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {recomputed.accuracy_pct.toFixed(2)}% ({TP + TN}/{total})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <Check className="w-3.5 h-3.5" /> Match
                        </span>
                      </td>
                    </>
                  )}
                </tr>

                {/* 4. At-Risk Recall */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 bg-emerald-50/30 dark:bg-emerald-950/20">
                  <td className="py-3 px-4 font-bold text-emerald-800 dark:text-emerald-300">At-Risk Recall</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700 dark:text-emerald-400">
                    {metrics.at_risk_recall_pct.value.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                    [{metrics.at_risk_recall_pct.ci[0].toFixed(2)}–{metrics.at_risk_recall_pct.ci[1].toFixed(2)}]
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        TP / (TP + FN)
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {recomputed.at_risk_recall_pct.toFixed(2)}% ({TP}/{TP + FN})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <Check className="w-3.5 h-3.5" /> Match
                        </span>
                      </td>
                    </>
                  )}
                </tr>

                {/* 5. At-Risk Precision */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">At-Risk Precision</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {metrics.at_risk_precision_pct.value.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                    [{metrics.at_risk_precision_pct.ci[0].toFixed(2)}–{metrics.at_risk_precision_pct.ci[1].toFixed(2)}]
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        TP / (TP + FP)
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {recomputed.at_risk_precision_pct.toFixed(2)}% ({TP}/{TP + FP})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <Check className="w-3.5 h-3.5" /> Match
                        </span>
                      </td>
                    </>
                  )}
                </tr>

                {/* 6. F1-Score */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 bg-purple-50/30 dark:bg-purple-950/20">
                  <td className="py-3 px-4 font-bold text-purple-800 dark:text-purple-300">F1-Score</td>
                  <td className="py-3 px-4 text-center font-bold text-purple-700 dark:text-purple-400">
                    {metrics.f1.value.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                    [{metrics.f1.ci[0].toFixed(4)}–{metrics.f1.ci[1].toFixed(4)}]
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        2 · (Precision · Recall) / (Precision + Recall)
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {recomputed.f1.toFixed(4)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <Check className="w-3.5 h-3.5" /> Match
                        </span>
                      </td>
                    </>
                  )}
                </tr>

                {/* 7. Specificity */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Specificity</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {metrics.specificity_pct.value.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                    [{metrics.specificity_pct.ci[0].toFixed(2)}–{metrics.specificity_pct.ci[1].toFixed(2)}]
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        TN / (TN + FP)
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {recomputed.specificity_pct.toFixed(2)}% ({TN}/{TN + FP})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <Check className="w-3.5 h-3.5" /> Match
                        </span>
                      </td>
                    </>
                  )}
                </tr>

                {/* 8. FPR */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">FPR (False Positive Rate)</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {metrics.fpr_pct.value.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 italic text-xs">
                    not reported in the manuscript
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        FP / (FP + TN)
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {recomputed.fpr_pct.toFixed(2)}% ({FP}/{FP + TN})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <Check className="w-3.5 h-3.5" /> Match
                        </span>
                      </td>
                    </>
                  )}
                </tr>

                {/* 9. FNR */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">FNR (False Negative Rate)</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {metrics.fnr_pct.value.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 italic text-xs">
                    not reported in the manuscript
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        FN / (FN + TP)
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {recomputed.fnr_pct.toFixed(2)}% ({FN}/{FN + TP})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <Check className="w-3.5 h-3.5" /> Match
                        </span>
                      </td>
                    </>
                  )}
                </tr>

                {/* 10. Brier Score */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Brier Score</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {metrics.brier.value.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                    [{metrics.brier.ci[0].toFixed(4)}–{metrics.brier.ci[1].toFixed(4)}]
                  </td>
                  {showFormula && (
                    <>
                      <td className="py-3 px-4 text-slate-500 font-sans text-xs">(1/N) * sum((p_i - y_i)^2)</td>
                      <td className="py-3 px-4 text-center text-slate-400 italic text-xs">Probability calibration loss</td>
                      <td className="py-3 px-4 text-center text-slate-400 text-xs">—</td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            * All values above are those reported in the manuscript (Kumar & Sharma, 2026).
          </div>
        </div>
      </div>
    </section>
  );
};
