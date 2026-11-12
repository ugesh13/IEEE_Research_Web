import React from 'react';
import paperResults from '../data/paper_results.json';
import { Target, TrendingUp, BarChart3, AlertCircle, ArrowDown } from 'lucide-react';
import { ViewSwitch } from './ViewSwitch';

interface HeroProps {
  viewMode?: 'interactive' | 'paper';
  setViewMode?: (mode: 'interactive' | 'paper') => void;
}

export const Hero: React.FC<HeroProps> = ({ viewMode = 'interactive', setViewMode = () => {} }) => {
  const { paper, holdout, threshold } = paperResults;
  const { roc_auc, at_risk_recall_pct, f1 } = holdout.metrics;

  return (
    <section id="hero" className="py-12 md:py-20 bg-white border-b border-[#E5E7EB]">
      <div className="layout-container">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200/80 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Manuscript, 2026</span>
        </div>

        {/* Title & Metadata */}
        <div className="max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight md:leading-tight">
            {paper.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#4B5563]">
            <div className="font-medium text-[#111827]">
              Authors: <span className="text-[#0B63CE] font-semibold">{paper.authors.join(' and ')}</span>
            </div>
            <div className="text-[#4B5563]">
              {paper.affiliation}
            </div>
          </div>

          <p className="mt-4 text-base md:text-lg text-[#4B5563] leading-relaxed font-normal">
            {/* One-sentence summary */}
            Early identification of distance education students at risk of academic failure or withdrawal using strictly leakage-quarantined behavioral and academic indicators observed on or before Day 30 across 32,593 enrollments.
          </p>
        </div>

        {/* Scope Statement Banner */}
        <div className="mt-8 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-sm leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#0B63CE] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-blue-900">
              Scope & Interpretation Notice (as reported in the manuscript):
            </p>
            <p className="font-medium">
              Experimental, observational study. Attributions convey predictive association, not causal effects.
            </p>
            <p className="text-blue-800">
              Subgroup results are descriptive and are not fairness conclusions.
            </p>
          </div>
        </div>

        {/* View Switch Centered directly ABOVE the 3 headline metric cards with 24-32px gap */}
        <div className="mt-10 mb-7">
          <ViewSwitch
            id="hero-view-switch"
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        {/* Three Headline Metric Cards from JSON */}
        <div
          id="metric-cards-row"
          data-testid="metric-cards-row"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1: ROC-AUC */}
          <div className="skeuo-card relative p-6 bg-white border border-[#E5E7EB]">
            <div className="flex items-center justify-between text-[#4B5563] mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Discrimination</span>
              <TrendingUp className="w-4 h-4 text-[#0B63CE]" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827] font-mono">
              {roc_auc.value.toFixed(4)}
            </div>
            <div className="mt-1 text-sm font-semibold text-[#111827]">
              Holdout ROC-AUC
            </div>
            <div className="mt-2 text-xs font-mono text-[#4B5563]">
              95% CI: [{roc_auc.ci[0].toFixed(4)}–{roc_auc.ci[1].toFixed(4)}]
            </div>
            <div className="mt-3 text-[11px] text-[#4B5563] border-t border-[#E5E7EB] pt-2">
              As reported in the manuscript on locked holdout
            </div>
          </div>

          {/* Card 2: At-Risk Recall */}
          <div className="skeuo-card relative p-6 bg-white border border-[#E5E7EB]">
            <div className="flex items-center justify-between text-[#4B5563] mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Early-Warning Sensitivity</span>
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827] font-mono">
              {at_risk_recall_pct.value.toFixed(2)}%
            </div>
            <div className="mt-1 text-sm font-semibold text-[#111827]">
              At-Risk Recall (θ = {threshold.value.toFixed(2)})
            </div>
            <div className="mt-2 text-xs font-mono text-[#4B5563]">
              95% CI: [{at_risk_recall_pct.ci[0].toFixed(2)}%–{at_risk_recall_pct.ci[1].toFixed(2)}%]
            </div>
            <div className="mt-3 text-[11px] text-[#4B5563] border-t border-[#E5E7EB] pt-2">
              2,127 of 2,582 at-risk enrollments flagged
            </div>
          </div>

          {/* Card 3: F1-Score */}
          <div className="skeuo-card relative p-6 bg-white border border-[#E5E7EB]">
            <div className="flex items-center justify-between text-[#4B5563] mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Harmonic Balance</span>
              <BarChart3 className="w-4 h-4 text-[#0B63CE]" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827] font-mono">
              {f1.value.toFixed(4)}
            </div>
            <div className="mt-1 text-sm font-semibold text-[#111827]">
              Holdout F1-Score
            </div>
            <div className="mt-2 text-xs font-mono text-[#4B5563]">
              95% CI: [{f1.ci[0].toFixed(4)}–{f1.ci[1].toFixed(4)}]
            </div>
            <div className="mt-3 text-[11px] text-[#4B5563] border-t border-[#E5E7EB] pt-2">
              Precision: {holdout.metrics.at_risk_precision_pct.value.toFixed(2)}% (CI: [{holdout.metrics.at_risk_precision_pct.ci[0].toFixed(2)}%–{holdout.metrics.at_risk_precision_pct.ci[1].toFixed(2)}%])
            </div>
          </div>
        </div>

        {/* Quick jump anchor */}
        <div className="mt-8 flex items-center justify-center">
          <a
            href="#approach"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B5563] hover:text-[#0B63CE] transition-colors"
          >
            <span>Explore study methodology and empirical findings</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
