import React from 'react';
import paperResults from '../data/paper_results.json';
import { MessageSquare, AlertOctagon } from 'lucide-react';

export const DiscussionSection: React.FC = () => {
  const { discussion_points, limitations } = paperResults;

  return (
    <section id="discussion" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section 10
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Discussion & Limitations
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Core scientific insights, institutional operational considerations, and methodological constraints documented in the manuscript.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Discussion Points */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-4">
              <MessageSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Key Discussion Points (as reported in the manuscript)</span>
            </div>

            <ul className="space-y-4">
              {discussion_points.map((point, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3 shadow-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-4">
              <AlertOctagon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Study Limitations (as reported in Section X)</span>
            </div>

            <ul className="space-y-3">
              {limitations.map((lim, idx) => (
                <li
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
