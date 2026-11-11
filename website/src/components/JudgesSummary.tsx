import React from 'react';
import { Clock, HelpCircle, Database, ShieldCheck, Award, AlertTriangle } from 'lucide-react';

export const JudgesSummary: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white py-8 border-b border-indigo-800/50 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-mono font-bold tracking-wider uppercase text-amber-300">
              For Judges &amp; Reviewers · 60-Second Executive Summary
            </h2>
          </div>
          <span className="text-[11px] font-mono text-indigo-300">
            Ground Truth: Manuscript (IEEE Transactions Guidelines)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-sans">
          {/* Card 1: The Question */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/25 transition-colors">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>1. The Question</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              Can students at risk of course failure/withdrawal be identified by Day 30 using early academic and VLE behavioral traces without target leakage?
            </p>
          </div>

          {/* Card 2: The Data */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/25 transition-colors">
            <div className="flex items-center gap-1.5 text-sky-300 font-bold mb-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>2. The Data</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              Open University Learning Analytics Dataset (OULAD): 32,593 course enrollments, 28,785 students, across 7 modules and 22 presentations.
            </p>
          </div>

          {/* Card 3: The Day-30 Rule */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/25 transition-colors">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. The Day-30 Rule</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              Strict temporal boundary. Quarantined post-Day-30 clickstream, unregistration timestamps, and end-of-course exams to prevent data leakage.
            </p>
          </div>

          {/* Card 4: Headline Numbers */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/25 transition-colors">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold mb-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>4. Headline Numbers</span>
            </div>
            <div className="text-slate-200 leading-relaxed text-[11px] font-mono">
              <div>ROC-AUC: <strong>0.8406</strong></div>
              <div>Recall: <strong>82.38%</strong> (at θ*=0.45)</div>
              <div>F1: <strong>0.7834</strong> · Brier: <strong>0.1638</strong></div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-sans">(Locked holdout N=4,889)</div>
            </div>
          </div>

          {/* Card 5: Main Limitation */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/25 transition-colors">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>5. Main Limitation</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              Observational study: attributions convey predictive association, not causality. Sensitivity depends partly on Day-30 early withdrawals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
