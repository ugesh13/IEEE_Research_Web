import React, { useState } from 'react';
import referencesData from '../data/references.json';
import { FileText, Github, Copy, Check, ExternalLink, Bookmark, BookOpen } from 'lucide-react';

export const ResourcesSection: React.FC = () => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const plainCitation =
    'U. Kumar and R. Sharma, "Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)," Manuscript, 2026.';

  const bibtexCitation = `@misc{kumar_sharma_2026,
  author = {Kumar, Ugesh and Sharma, Riya},
  title  = {Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)},
  year   = {2026},
  note   = {Manuscript}
}`;

  const copyToClipboard = (text: string, isBibtex: boolean) => {
    navigator.clipboard.writeText(text);
    if (isBibtex) {
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2000);
    } else {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <section id="resources" className="py-16 bg-slate-50/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section 11
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Resources, References & Citation
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Access the manuscript PDF, open GitHub repository, 30 peer references from the manuscript, and bibliographic citations.
          </p>
        </div>

        {/* Quick Links Card Row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Download Paper Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 border border-brand-100 dark:border-brand-900">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Research Paper PDF
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Full manuscript draft formatted per IEEE Transactions guidelines, with figures and tables.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="/paper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <FileText className="w-4 h-4" />
                <span>Open Manuscript PDF (/paper.pdf)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* GitHub Repo Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-600">
                <Github className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                GitHub Repository
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Source code, analysis outputs and this website. Note: the repository does not regenerate the manuscript's headline numbers (see Repository Supplement).
              </p>
            </div>
            <div className="mt-6">
              <a
                href="https://github.com/ugesh13/IEEE_Research_Web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub (ugesh13/IEEE_Research_Web)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>

        {/* Citation Block */}
        <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Recommended Citation</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(plainCitation, false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Copied Text' : 'Copy Text'}</span>
              </button>
              <button
                onClick={() => copyToClipboard(bibtexCitation, true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBibtex ? 'Copied BibTeX' : 'Copy BibTeX'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto">
            {plainCitation}
          </div>

          <details className="mt-4">
            <summary className="text-xs font-mono text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
              Show BibTeX Entry
            </summary>
            <pre className="mt-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto">
              {bibtexCitation}
            </pre>
          </details>
        </div>

        {/* 30 Clickable References */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Clickable Reference Links (30 references)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              From CLICKABLE REFERENCE LINKS in manuscript
            </span>
          </div>

          <div className="space-y-3">
            {referencesData.map((ref) => (
              <div
                key={ref.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
                    [{ref.id}]
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="leading-relaxed">
                      {ref.citation}
                    </p>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-brand-600 dark:text-brand-400 hover:underline mt-1 break-all"
                    >
                      <span>{ref.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
