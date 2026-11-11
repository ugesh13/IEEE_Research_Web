import React from 'react';
import paperResults from '../data/paper_results.json';
import { Target, TrendingUp, BarChart3, AlertCircle, ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const { paper, holdout, threshold } = paperResults;
  const { roc_auc, at_risk_recall_pct, f1 } = holdout.metrics;

  return (
    <section id="hero" className="py-12 md:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Manuscript, 2026</span>
        </div>

        {/* Title & Metadata */}
        <div className="max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight md:leading-tight">
            {paper.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="font-medium text-slate-900 dark:text-white">
              Authors: <span className="text-brand-700 dark:text-brand-300 font-semibold">{paper.authors.join(' and ')}</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              {paper.affiliation}
            </div>
          </div>

          <p className="mt-4 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {/* One-sentence summary */}
            Early identification of distance education students at risk of academic failure or withdrawal using strictly leakage-quarantined behavioral and academic indicators observed on or before Day 30 across 32,593 enrollments.
          </p>
        </div>

        {/* Scope Statement Banner */}
        <div className="mt-8 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-950 dark:text-blue-200 text-sm leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              Scope & Interpretation Notice (as reported in the manuscript):
            </p>
            <p className="font-medium">
              Experimental, observational study. Attributions convey predictive association, not causal effects.
            </p>
            <p className="text-blue-800 dark:text-blue-300">
              Subgroup results are descriptive and are not fairness conclusions.
            </p>
          </div>
        </div>

        {/* Three Headline Metric Cards from JSON */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: ROC-AUC */}
          <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Discrimination</span>
              <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
              {roc_auc.value.toFixed(4)}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              Holdout ROC-AUC
            </div>
            <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              95% CI: [{roc_auc.ci[0].toFixed(4)}–{roc_auc.ci[1].toFixed(4)}]
            </div>
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2">
              As reported in the manuscript on locked holdout
            </div>
          </div>

          {/* Card 2: At-Risk Recall */}
          <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Early-Warning Sensitivity</span>
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
              {at_risk_recall_pct.value.toFixed(2)}%
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              At-Risk Recall (θ = {threshold.value.toFixed(2)})
            </div>
            <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              95% CI: [{at_risk_recall_pct.ci[0].toFixed(2)}%–{at_risk_recall_pct.ci[1].toFixed(2)}%]
            </div>
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2">
              2,127 of 2,582 at-risk enrollments flagged
            </div>
          </div>

          {/* Card 3: F1-Score */}
          <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Harmonic Balance</span>
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
              {f1.value.toFixed(4)}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              Holdout F1-Score
            </div>
            <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              95% CI: [{f1.ci[0].toFixed(4)}–{f1.ci[1].toFixed(4)}]
            </div>
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2">
              Precision: {holdout.metrics.at_risk_precision_pct.value.toFixed(2)}% (CI: [{holdout.metrics.at_risk_precision_pct.ci[0].toFixed(2)}%–{holdout.metrics.at_risk_precision_pct.ci[1].toFixed(2)}%])
            </div>
          </div>
        </div>

        {/* Quick jump anchor */}
        <div className="mt-8 flex items-center justify-center">
          <a
            href="#approach"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
          >
            <span>Explore study methodology and empirical findings</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
