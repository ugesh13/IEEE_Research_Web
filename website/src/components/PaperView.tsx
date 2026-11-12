import React, { useState } from 'react';
import { Download, FileText, Copy, Check, ExternalLink, ArrowUp } from 'lucide-react';
import { paperHeader, paperAbstract, indexTerms, paperSections, paperReferences } from '../data/paper_text';
import results from '../data/paper_results.json';
import { MathView } from './MathView';
import {
  Figure4Sigmoid,
  Figure5HoldoutMetrics,
  Figure6F1Tradeoff,
  Figure7BrierLoss,
  Figure8FeasibleRegion,
} from './PaperFigures';
import { downloadTableCsv } from '../utils/csvExport';
import { ViewSwitch } from './ViewSwitch';

interface PaperViewProps {
  viewMode?: 'interactive' | 'paper';
  setViewMode?: (mode: 'interactive' | 'paper') => void;
  onSwitchToInteractive: () => void;
}

export const PaperView: React.FC<PaperViewProps> = ({
  viewMode = 'paper',
  setViewMode = () => {},
  onSwitchToInteractive
}) => {
  const [copiedType, setCopiedType] = useState<'text' | 'bibtex' | null>(null);
  const [exportingTable, setExportingTable] = useState<string | null>(null);

  const handleExport = (tableNum: string) => {
    setExportingTable(tableNum);
    try {
      downloadTableCsv(tableNum);
    } finally {
      setTimeout(() => setExportingTable(null), 350);
    }
  };

  const plainCitation =
    'U. Kumar and R. Sharma, "Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)," Manuscript, 2026.';

  const bibtexCitation = `@misc{kumar_sharma_2026,
  author = {Kumar, Ugesh and Sharma, Riya},
  title  = {Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)},
  year   = {2026},
  note   = {Manuscript}
}`;

  const copyCitation = (type: 'text' | 'bibtex') => {
    const text = type === 'text' ? plainCitation : bibtexCitation;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Helper to render text with clickable citation links [n]
  const renderParagraphWithCitations = (p: string) => {
    const parts = p.split(/(\[[0-9,\s–-]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[([0-9]+)\]$/);
      if (match) {
        const refNum = parseInt(match[1], 10);
        return (
          <a
            key={i}
            href={`#ref-${refNum}`}
            className="text-brand-600 dark:text-brand-400 hover:underline font-mono font-semibold"
            title={`Jump to Reference [${refNum}]`}
          >
            [{refNum}]
          </a>
        );
      }
      return part;
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-serif text-slate-800 dark:text-slate-200 [max-width:72ch] page-dock-clearance">
      {/* Top Academic Centered View Switch directly at the top of paper content */}
      <div className="no-print mb-8">
        <ViewSwitch
          id="paper-view-switch"
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      {/* Top Academic Toolbar */}
      <div className="no-print mb-8 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 font-sans text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-mono font-bold">
            Paper View
          </span>
          <span className="text-slate-500">IEEE Transactions format</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSwitchToInteractive}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            ← Interactive View
          </button>
          <a
            href="/paper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download PDF</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
          <button
            onClick={() => copyCitation('text')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copiedType === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Citation</span>
          </button>
          <button
            onClick={() => copyCitation('bibtex')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copiedType === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy BibTeX</span>
          </button>
        </div>
      </div>

      {/* Header Block */}
      <header className="border-b border-slate-300 dark:border-slate-700 pb-8 mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight font-sans">
          {paperHeader.title}
        </h1>
        <div className="mt-4 text-sm font-sans font-semibold text-slate-900 dark:text-slate-100">
          {paperHeader.authors.join(' and ')}
        </div>
        <div className="mt-1 text-xs font-sans text-slate-600 dark:text-slate-400">
          {paperHeader.affiliation}
        </div>
        <div className="mt-3 text-[11px] font-mono text-slate-600 dark:text-slate-400 italic">
          {paperHeader.statusNotice}
        </div>
      </header>

      {/* Abstract & Index Terms */}
      <section className="mb-10 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed">
        <p className="text-justify font-serif">
          <strong className="font-sans font-bold">Abstract</strong>—{paperAbstract}
        </p>
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs font-sans">
          <strong className="font-bold">Index Terms</strong>—{indexTerms.join(', ')}.
        </div>
      </section>

      {/* Section I: Introduction */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          I. Introduction
        </h2>
        {paperSections[0].paragraphs.map((p, idx) => (
          <p key={idx} className="mb-4 text-justify leading-relaxed text-sm sm:text-base">
            {renderParagraphWithCitations(p)}
          </p>
        ))}
        {paperSections[0].bullets && (
          <ul className="list-disc pl-6 space-y-2 mb-6 text-sm sm:text-base">
            {paperSections[0].bullets.map((b, bIdx) => (
              <li key={bIdx} className="leading-relaxed">
                {b}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Section II: Related Work */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          II. Related Work
        </h2>
        {paperSections[1].subsections?.map((sub) => (
          <div key={sub.letter} className="mb-6">
            <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-2">
              {sub.letter}. {sub.title}
            </h3>
            {sub.paragraphs.map((p, idx) => (
              <p key={idx} className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                {renderParagraphWithCitations(p)}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* Section III: Dataset and Problem Formulation */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          III. Dataset and Problem Formulation
        </h2>
        {paperSections[2].paragraphs.map((p, idx) => (
          <p key={idx} className="mb-4 text-justify leading-relaxed text-sm sm:text-base">
            {renderParagraphWithCitations(p)}
          </p>
        ))}

        {/* Subsection III-A */}
        <div className="mb-6">
          <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-2">
            A. Analytical Unit
          </h3>
          <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
            {paperSections[2].subsections?.[0].paragraphs[0]}
          </p>
          <div className="flex items-center justify-between p-3 my-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <MathView math="u = (\text{code\_module}, \text{code\_presentation}, \text{id\_student})" block />
            <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-4">(1)</span>
          </div>
          <p className="mt-3 text-justify leading-relaxed text-sm sm:text-base">
            {paperSections[2].subsections?.[0].paragraphs[1]}
          </p>
        </div>

        {/* Subsection III-B */}
        <div className="mb-6">
          <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-2">
            B. Primary Binary Target
          </h3>
          <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
            {paperSections[2].subsections?.[1].paragraphs[0]}
          </p>
          <div className="flex items-center justify-between p-3 my-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <MathView
              math="y_u = \begin{cases} 1, & \text{if outcome is Withdrawn or Fail} \\ 0, & \text{if outcome is Pass or Distinction} \end{cases}"
              block
            />
            <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-4">(2)</span>
          </div>
          <p className="mt-3 text-justify leading-relaxed text-sm sm:text-base">
            {paperSections[2].subsections?.[1].paragraphs[1]}
          </p>

          {/* Table I */}
          <div className="my-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                TABLE I: OUTCOME DISTRIBUTION OF THE BINARY TARGET (N=32,593)
              </h4>
              <button
                disabled={exportingTable === 'I'}
                onClick={() => handleExport('I')}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-60 transition-opacity"
              >
                <Download className={`w-3 h-3 ${exportingTable === 'I' ? 'animate-bounce' : ''}`} />
                <span>{exportingTable === 'I' ? 'Exporting...' : 'CSV'}</span>
              </button>
            </div>
            <table className="w-full text-xs font-mono text-left">
              <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="py-2 px-3">Class</th>
                  <th className="py-2 px-3">Outcome</th>
                  <th className="py-2 px-3 text-right">Count</th>
                  <th className="py-2 px-3 text-right">Share (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td rowSpan={2} className="py-2 px-3 font-semibold text-emerald-700 dark:text-emerald-400">Successful (47.20%)</td>
                  <td className="py-1.5 px-3">Pass</td>
                  <td className="py-1.5 px-3 text-right">12,361</td>
                  <td className="py-1.5 px-3 text-right">37.93</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Distinction</td>
                  <td className="py-1.5 px-3 text-right">3,024</td>
                  <td className="py-1.5 px-3 text-right">9.28</td>
                </tr>
                <tr>
                  <td rowSpan={2} className="py-2 px-3 font-semibold text-red-700 dark:text-red-400">At-Risk (52.80%)</td>
                  <td className="py-1.5 px-3">Withdrawn</td>
                  <td className="py-1.5 px-3 text-right">10,156</td>
                  <td className="py-1.5 px-3 text-right">31.16</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Fail</td>
                  <td className="py-1.5 px-3 text-right">7,052</td>
                  <td className="py-1.5 px-3 text-right">21.64</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section IV: Methodology & Equations 3 - 12 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          IV. Methodology
        </h2>
        {paperSections[3].subsections?.map((sub) => (
          <div key={sub.letter} className="mb-6">
            <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-2">
              {sub.letter}. {sub.title}
            </h3>
            {sub.paragraphs.map((p, idx) => (
              <p key={idx} className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                {renderParagraphWithCitations(p)}
              </p>
            ))}

            {/* Table II in Section IV-C */}
            {sub.letter === 'C' && (
              <div className="my-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    TABLE II: SUMMARY OF TEMPORAL INFORMATION SCENARIOS
                  </h4>
                  <button
                    disabled={exportingTable === 'II'}
                    onClick={() => handleExport('II')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-60 transition-opacity"
                  >
                    <Download className={`w-3 h-3 ${exportingTable === 'II' ? 'animate-bounce' : ''}`} />
                    <span>{exportingTable === 'II' ? 'Exporting...' : 'CSV'}</span>
                  </button>
                </div>
                <table className="w-full text-xs font-mono text-left">
                  <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                    <tr>
                      <th className="py-2 px-3">Scenario</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-center">Raw Predictors</th>
                      <th className="py-2 px-3 text-center">Transformed Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">S0</td>
                      <td className="py-2 px-3">Intake Baseline</td>
                      <td className="py-2 px-3 text-center">13</td>
                      <td className="py-2 px-3 text-center">52</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">S1</td>
                      <td className="py-2 px-3">Early Academic Progression</td>
                      <td className="py-2 px-3 text-center">21</td>
                      <td className="py-2 px-3 text-center">60</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">S2</td>
                      <td className="py-2 px-3">Early Behavioral Progression</td>
                      <td className="py-2 px-3 text-center">29</td>
                      <td className="py-2 px-3 text-center">68</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Sigmoid formula & Fig 4 in Section IV-C / Model Architectures */}
            {sub.letter === 'C' && (
              <div className="my-4">
                <div className="flex items-center justify-between p-3 my-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <MathView math="P(y=1 \mid x) = \sigma(w^\top x + b) = \frac{1}{1 + \exp[-(w^\top x + b)]}" block />
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-4">(3)</span>
                </div>
                <div className="my-6">
                  <Figure4Sigmoid />
                </div>
              </div>
            )}

            {/* Evaluation Metrics formulas & Fig 5, 6, 7 in Section IV-D */}
            {sub.letter === 'D' && (
              <div className="my-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <MathView math="\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}" block />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-2">(4)</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <MathView math="\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}" block />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-2">(5)</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <MathView math="\text{Specificity} = \frac{\text{TN}}{\text{TN} + \text{FP}}" block />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-2">(6)</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <MathView math="F_1 = \frac{2 \cdot (\text{Precision} \cdot \text{Recall})}{\text{Precision} + \text{Recall}}" block />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-2">(7)</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <MathView math="\text{Accuracy} = \frac{\text{TP} + \text{TN}}{\text{TP} + \text{TN} + \text{FP} + \text{FN}}" block />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-2">(8)</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <MathView math="\text{FPR} = \frac{\text{FP}}{\text{FP} + \text{TN}}" block />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-2">(9)</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between sm:col-span-2">
                    <MathView math="\text{FNR} = \frac{\text{FN}}{\text{FN} + \text{TP}}" block />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-2">(10)</span>
                  </div>
                </div>

                <div className="my-6">
                  <Figure5HoldoutMetrics />
                </div>

                {/* Brier Score Eq 11 */}
                <div className="flex items-center justify-between p-3 my-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <MathView math="\text{BS} = \frac{1}{N} \sum_{i=1}^N (p_i - y_i)^2" block />
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-4">(11)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <Figure6F1Tradeoff />
                  <Figure7BrierLoss />
                </div>
              </div>
            )}

            {/* Threshold Rule Eq 12 & Fig 8 in Section IV-E */}
            {sub.letter === 'E' && (
              <div className="my-4">
                <div className="flex items-center justify-between p-3 my-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <MathView
                    math="\theta^* = \max \{ \theta \in [0.10, 0.90] : \text{Recall}(\theta) \ge 0.82 \land \text{Precision}(\theta) \ge 0.70 \}"
                    block
                  />
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400 pl-4">(12)</span>
                </div>
                <div className="my-6">
                  <Figure8FeasibleRegion />
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Section V: Experimental Design */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          V. Experimental Design
        </h2>
        {paperSections[4].subsections?.map((sub) => (
          <div key={sub.letter} className="mb-6">
            <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-2">
              {sub.letter}. {sub.title}
            </h3>
            {sub.paragraphs.map((p, idx) => (
              <p key={idx} className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                {renderParagraphWithCitations(p)}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* Section VI: Results & Tables III, IV */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          VI. Results
        </h2>
        {paperSections[5].subsections?.map((sub) => (
          <div key={sub.letter} className="mb-6">
            <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-2">
              {sub.letter}. {sub.title}
            </h3>
            {sub.paragraphs.map((p, idx) => (
              <p key={idx} className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                {renderParagraphWithCitations(p)}
              </p>
            ))}

            {sub.letter === 'B' && (
              <div className="my-6 space-y-6">
                {/* Table III */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      TABLE III: HOLDOUT TEST SET CONFUSION MATRIX (N=4,889)
                    </h4>
                    <button
                      disabled={exportingTable === 'III'}
                      onClick={() => handleExport('III')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-60 transition-opacity"
                    >
                      <Download className={`w-3 h-3 ${exportingTable === 'III' ? 'animate-bounce' : ''}`} />
                      <span>{exportingTable === 'III' ? 'Exporting...' : 'CSV'}</span>
                    </button>
                  </div>
                  <table className="w-full text-xs font-mono text-center">
                    <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                      <tr>
                        <th className="py-2 px-3 text-left">Actual Outcome</th>
                        <th className="py-2 px-3">Predicted At-Risk</th>
                        <th className="py-2 px-3">Predicted Successful</th>
                        <th className="py-2 px-3">Row Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="py-2 px-3 text-left font-semibold text-red-700 dark:text-red-400">Actual At-Risk</td>
                        <td className="py-2 px-3 font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">TP = 2,127</td>
                        <td className="py-2 px-3 font-bold text-red-700 dark:text-red-400">FN = 455</td>
                        <td className="py-2 px-3 font-bold">2,582 (52.81%)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-left font-semibold text-emerald-800 dark:text-emerald-300">Actual Successful</td>
                        <td className="py-2 px-3 font-bold text-amber-800 dark:text-amber-300">FP = 721</td>
                        <td className="py-2 px-3 font-bold text-blue-800 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950/20">TN = 1,586</td>
                        <td className="py-2 px-3 font-bold">2,307 (47.19%)</td>
                      </tr>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/30 font-bold">
                        <td className="py-2 px-3 text-left">Column Total</td>
                        <td className="py-2 px-3">2,848 (58.25%)</td>
                        <td className="py-2 px-3">2,041 (41.75%)</td>
                        <td className="py-2 px-3">N = 4,889</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Table IV */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      TABLE IV: HOLDOUT PERFORMANCE OF THE PRIMARY MODEL (HGB, S2, θ*=0.45)
                    </h4>
                    <button
                      disabled={exportingTable === 'IV'}
                      onClick={() => handleExport('IV')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-60 transition-opacity"
                    >
                      <Download className={`w-3 h-3 ${exportingTable === 'IV' ? 'animate-bounce' : ''}`} />
                      <span>{exportingTable === 'IV' ? 'Exporting...' : 'CSV'}</span>
                    </button>
                  </div>
                  <table className="w-full text-xs font-mono text-left">
                    <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                      <tr>
                        <th className="py-2 px-3 font-sans">Metric</th>
                        <th className="py-2 px-3 text-center">Value</th>
                        <th className="py-2 px-3 text-center">95% Confidence Interval</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">ROC-AUC</td>
                        <td className="py-1.5 px-3 text-center font-bold text-brand-700 dark:text-brand-300">0.8406</td>
                        <td className="py-1.5 px-3 text-center text-slate-600 dark:text-slate-400">[0.8298 – 0.8512]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">PR-AUC</td>
                        <td className="py-1.5 px-3 text-center font-bold text-brand-700 dark:text-brand-300">0.8459</td>
                        <td className="py-1.5 px-3 text-center text-slate-600 dark:text-slate-400">[0.8348 – 0.8567]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">Accuracy</td>
                        <td className="py-1.5 px-3 text-center font-bold text-slate-900 dark:text-white">75.95%</td>
                        <td className="py-1.5 px-3 text-center text-slate-600 dark:text-slate-400">[74.74 – 77.15]</td>
                      </tr>
                      <tr className="bg-emerald-50/40 dark:bg-emerald-950/20">
                        <td className="py-1.5 px-3 font-semibold text-emerald-800 dark:text-emerald-300 font-sans">At-Risk Recall</td>
                        <td className="py-1.5 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">82.38%</td>
                        <td className="py-1.5 px-3 text-center text-emerald-700 dark:text-emerald-400">[80.89 – 83.82]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">At-Risk Precision</td>
                        <td className="py-1.5 px-3 text-center font-bold text-slate-900 dark:text-white">74.68%</td>
                        <td className="py-1.5 px-3 text-center text-slate-600 dark:text-slate-400">[73.08 – 76.24]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">F1-score</td>
                        <td className="py-1.5 px-3 text-center font-bold text-purple-700 dark:text-purple-300">0.7834</td>
                        <td className="py-1.5 px-3 text-center text-slate-600 dark:text-slate-400">[0.7721 – 0.7944]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">Specificity</td>
                        <td className="py-1.5 px-3 text-center text-slate-700 dark:text-slate-300">68.75%</td>
                        <td className="py-1.5 px-3 text-center text-slate-600 dark:text-slate-400">[66.85 – 70.61]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">False Positive Rate (FPR)</td>
                        <td className="py-1.5 px-3 text-center text-red-600 dark:text-red-400">31.25%</td>
                        <td className="py-1.5 px-3 text-center text-slate-400">—</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">False Negative Rate (FNR)</td>
                        <td className="py-1.5 px-3 text-center text-red-600 dark:text-red-400">17.62%</td>
                        <td className="py-1.5 px-3 text-center text-slate-400">—</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white font-sans">Brier Score</td>
                        <td className="py-1.5 px-3 text-center font-bold text-slate-900 dark:text-white">0.1638</td>
                        <td className="py-1.5 px-3 text-center text-slate-600 dark:text-slate-400">[0.1565 – 0.1712]</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Section VII: Explainability and Subgroup Analysis & Tables V, VI */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          VII. Explainability and Subgroup Analysis
        </h2>
        {paperSections[6].paragraphs.map((p, idx) => (
          <p key={idx} className="mb-4 text-justify leading-relaxed text-sm sm:text-base">
            {renderParagraphWithCitations(p)}
          </p>
        ))}

        {/* Table V */}
        <div className="my-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white">
              TABLE V: FEATURE FAMILY SHAP ATTRIBUTION SUMMARY
            </h4>
            <button
              disabled={exportingTable === 'V'}
              onClick={() => handleExport('V')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-60 transition-opacity"
            >
              <Download className={`w-3 h-3 ${exportingTable === 'V' ? 'animate-bounce' : ''}`} />
              <span>{exportingTable === 'V' ? 'Exporting...' : 'CSV'}</span>
            </button>
          </div>
          <table className="w-full text-xs font-mono text-left">
            <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="py-2 px-3 font-sans">Feature Family</th>
                <th className="py-2 px-3 text-center font-sans">Raw Predictors</th>
                <th className="py-2 px-3 text-right">Contribution (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white font-sans">Static Intake & Context</td>
                <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-400">13</td>
                <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">34.17%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white font-sans">Academic Milestones</td>
                <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-400">8</td>
                <td className="py-2 px-3 text-right font-bold text-indigo-700 dark:text-indigo-400">33.22%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white font-sans">VLE Digital Engagement</td>
                <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-400">8</td>
                <td className="py-2 px-3 text-right font-bold text-sky-800 dark:text-sky-400">32.61%</td>
              </tr>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td className="py-2 px-3 text-slate-900 dark:text-white font-sans">Dynamic Combined (Academic + VLE)</td>
                <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-400">16</td>
                <td className="py-2 px-3 text-right text-indigo-700 dark:text-indigo-300">65.83%</td>
              </tr>
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                <td className="py-2 px-3 font-sans">Total</td>
                <td className="py-2 px-3 text-center">29</td>
                <td className="py-2 px-3 text-right">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Subsection VII-A */}
        <div className="mb-6">
          <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-2">
            A. Descriptive Subgroup Evaluation
          </h3>
          {paperSections[6].subsections?.[0].paragraphs.map((p, idx) => (
            <p key={idx} className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
              {p}
            </p>
          ))}

          {/* Table VI */}
          <div className="my-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                TABLE VI: DESCRIPTIVE SUBGROUP EVALUATION (HOLDOUT, θ*=0.45)
              </h4>
              <button
                disabled={exportingTable === 'VI'}
                onClick={() => handleExport('VI')}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-60 transition-opacity"
              >
                <Download className={`w-3 h-3 ${exportingTable === 'VI' ? 'animate-bounce' : ''}`} />
                <span>{exportingTable === 'VI' ? 'Exporting...' : 'CSV'}</span>
              </button>
            </div>
            <table className="w-full text-xs font-mono text-left">
              <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="py-2 px-3 font-sans">Attribute</th>
                  <th className="py-2 px-3 font-sans">Stratum</th>
                  <th className="py-2 px-3 text-center">Recall (%)</th>
                  <th className="py-2 px-3 text-center">False Positive Rate (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.subgroups_recall_at_threshold_0_45.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5 px-3 font-semibold text-slate-700 dark:text-slate-300 font-sans border-r border-slate-100 dark:border-slate-800">
                      {item.attribute}
                    </td>
                    <td className="py-1.5 px-3 font-sans">{item.stratum}</td>
                    <td className="py-1.5 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">
                      {item.recall_pct.toFixed(2)}%
                    </td>
                    <td className="py-1.5 px-3 text-center text-slate-600 dark:text-slate-400">
                      {item.fpr_pct !== null ? `${item.fpr_pct.toFixed(2)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section VIII: Robustness and Sensitivity Analysis */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          VIII. Robustness and Sensitivity Analysis
        </h2>
        {paperSections[7].paragraphs.map((p, idx) => (
          <p key={idx} className="mb-4 text-justify leading-relaxed text-sm sm:text-base">
            {p}
          </p>
        ))}
      </section>

      {/* Section IX: Discussion */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          IX. Discussion
        </h2>
        {paperSections[8].paragraphs.map((p, idx) => (
          <p key={idx} className="mb-4 text-justify leading-relaxed text-sm sm:text-base">
            {p}
          </p>
        ))}
      </section>

      {/* Section X: Limitations */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          X. Limitations
        </h2>
        {paperSections[9].paragraphs.map((p, idx) => (
          <p key={idx} className="mb-4 text-justify leading-relaxed text-sm sm:text-base">
            {p}
          </p>
        ))}
      </section>

      {/* Section XI: Conclusion */}
      <section className="mb-12">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          XI. Conclusion
        </h2>
        {paperSections[10].paragraphs.map((p, idx) => (
          <p key={idx} className="mb-4 text-justify leading-relaxed text-sm sm:text-base">
            {p}
          </p>
        ))}
      </section>

      {/* References */}
      <section className="mb-8 border-t border-slate-300 dark:border-slate-700 pt-8" id="paper-references">
        <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider mb-6">
          References
        </h2>
        <ol className="space-y-3 font-sans text-xs sm:text-sm">
          {paperReferences.map((ref) => (
            <li key={ref.id} id={`ref-${ref.id}`} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400 min-w-[2.5rem]">
                [{ref.id}]
              </span>
              <div className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed font-serif break-words [overflow-wrap:anywhere]">
                <span>{ref.citation}</span>
                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-brand-600 hover:underline font-mono text-[11px] break-all [overflow-wrap:anywhere]"
                  >
                    <span>[Link]</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                  </a>
                )}
                <a
                  href="#hero"
                  className="ml-2 inline-flex items-center text-slate-400 hover:text-slate-600 font-mono text-[10px]"
                  title="Back to top"
                >
                  <ArrowUp className="w-3 h-3" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
};

export default PaperView;
