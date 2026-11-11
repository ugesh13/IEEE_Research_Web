import React, { useState } from 'react';
import paperResults from '../data/paper_results.json';
import { Database, Users, BookOpen, Calendar, Repeat } from 'lucide-react';

export const DatasetSection: React.FC = () => {
  const { dataset, outcome_distribution } = paperResults;
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const stats = [
    { label: 'Course Enrollments', value: dataset.enrollments.toLocaleString(), icon: Database },
    { label: 'Distinct Students', value: dataset.unique_students.toLocaleString(), icon: Users },
    { label: 'Undergraduate Modules', value: dataset.modules.toString(), icon: BookOpen },
    { label: 'Course Presentations', value: dataset.course_presentations.toString(), icon: Calendar },
    { label: 'Repeat Enrollment Rate', value: `${dataset.repeat_enrollment_rate_pct}%`, icon: Repeat },
  ];

  const outcomes = [
    {
      key: 'pass',
      label: 'Pass',
      group: 'Successful',
      count: outcome_distribution.pass.count,
      pct: outcome_distribution.pass.pct,
      color: '#10b981', // emerald-500
      bgClass: 'bg-emerald-500',
    },
    {
      key: 'distinction',
      label: 'Distinction',
      group: 'Successful',
      count: outcome_distribution.distinction.count,
      pct: outcome_distribution.distinction.pct,
      color: '#059669', // emerald-600
      bgClass: 'bg-emerald-600',
    },
    {
      key: 'withdrawn',
      label: 'Withdrawn',
      group: 'At-Risk',
      count: outcome_distribution.withdrawn.count,
      pct: outcome_distribution.withdrawn.pct,
      color: '#ef4444', // red-500
      bgClass: 'bg-red-500',
    },
    {
      key: 'fail',
      label: 'Fail',
      group: 'At-Risk',
      count: outcome_distribution.fail.count,
      pct: outcome_distribution.fail.pct,
      color: '#dc2626', // red-600
      bgClass: 'bg-red-600',
    },
  ];

  return (
    <section id="dataset" className="py-16 bg-slate-50/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            Section III · Section 3
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dataset Characteristics & Outcome Distribution
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            The study utilizes the anonymized open data from the Open University Learning Analytics Dataset (OULAD; Kuzilek, Hlosta, &amp; Zdrahal, Scientific Data 2017), comprising academic presentations in {dataset.academic_years}.
            Analytical unit is defined as <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">{dataset.analytical_unit}</code>.
            Because 11.7% of students repeat enrollments across terms, student-level grouped splitting is essential to prevent cross-partition leakage.
          </p>
        </div>

        {/* Headline Statistics Row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {s.value}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Outcome Distribution Chart & Breakdown */}
        <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Target Variable Formulation & Outcome Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                {dataset.target} (Total N = {dataset.enrollments.toLocaleString()} observations)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                Successful: {outcome_distribution.successful_total.pct.toFixed(2)}% ({outcome_distribution.successful_total.count.toLocaleString()})
              </span>
              <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400">
                <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
                At-Risk: {outcome_distribution.at_risk_total.pct.toFixed(2)}% ({outcome_distribution.at_risk_total.count.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Accessible SVG Stacked Bar Chart */}
          <div className="relative">
            <svg
              className="w-full h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
              viewBox="0 0 1000 48"
              preserveAspectRatio="none"
              role="img"
              aria-label="Outcome distribution stacked bar: Pass 37.93%, Distinction 9.28%, Withdrawn 31.16%, Fail 21.64%"
            >
              <title>Outcome Distribution Chart</title>
              {/* Pass (37.93% -> width 379.3) */}
              <rect
                x="0"
                y="0"
                width="379.3"
                height="48"
                fill="#10b981"
                className="cursor-pointer transition-opacity hover:opacity-90"
                onMouseEnter={() => setActiveSegment('pass')}
                onMouseLeave={() => setActiveSegment(null)}
              />
              {/* Distinction (9.28% -> width 92.8, x = 379.3) */}
              <rect
                x="379.3"
                y="0"
                width="92.8"
                height="48"
                fill="#059669"
                className="cursor-pointer transition-opacity hover:opacity-90"
                onMouseEnter={() => setActiveSegment('distinction')}
                onMouseLeave={() => setActiveSegment(null)}
              />
              {/* Withdrawn (31.16% -> width 311.6, x = 472.1) */}
              <rect
                x="472.1"
                y="0"
                width="311.6"
                height="48"
                fill="#ef4444"
                className="cursor-pointer transition-opacity hover:opacity-90"
                onMouseEnter={() => setActiveSegment('withdrawn')}
                onMouseLeave={() => setActiveSegment(null)}
              />
              {/* Fail (21.64% -> width 216.3, x = 783.7) */}
              <rect
                x="783.7"
                y="0"
                width="216.3"
                height="48"
                fill="#dc2626"
                className="cursor-pointer transition-opacity hover:opacity-90"
                onMouseEnter={() => setActiveSegment('fail')}
                onMouseLeave={() => setActiveSegment(null)}
              />
            </svg>
          </div>

          {/* 4 Outcome Category Badges */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {outcomes.map((item) => (
              <div
                key={item.key}
                onMouseEnter={() => setActiveSegment(item.key)}
                onMouseLeave={() => setActiveSegment(null)}
                className={`p-3.5 rounded-xl border transition-all ${
                  activeSegment === item.key
                    ? 'ring-2 ring-brand-500 border-transparent shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.bgClass}`} />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {item.group}
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {item.pct.toFixed(2)}%
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.count.toLocaleString()} enrollments
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
            <strong>Substantive Note:</strong> Grouping <em>Withdrawn</em> and <em>Fail</em> into <em>At-Risk</em> is an operational modeling choice designed to trigger early institutional outreach. The manuscript explicitly notes they represent distinct educational trajectories.
          </div>
        </div>

        {/* Table Record Counts */}
        <div className="mt-10">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Relational Tables Enumeration & Record Counts (as reported in the manuscript)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold font-mono border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="py-3 px-4">Table File</th>
                  <th scope="col" className="py-3 px-4">Records Reported</th>
                  <th scope="col" className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-mono">
                {dataset.tables.map((t) => (
                  <tr key={t.file} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {t.file}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-brand-700 dark:text-brand-300">
                      {t.records !== null ? (
                        t.records.toLocaleString()
                      ) : (
                        <span className="text-slate-400 font-normal">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-sans text-xs">
                      {t.file === 'studentInfo.csv' && 'Student demographics, age band, disability, IMD band, education'}
                      {t.file === 'studentRegistration.csv' && 'Registration and unregistration course timestamps'}
                      {t.file === 'studentAssessment.csv' && 'Individual assessment submission results and submission delays'}
                      {t.file === 'studentVle.csv' && 'Daily student clickstream interaction counts per VLE activity'}
                      {t.file === 'assessments.csv' && 'Assessment structure and weighting metadata per course presentation'}
                      {t.file === 'vle.csv' && 'Learning activity metadata and activity type classifications'}
                      {t.file === 'courses.csv' && 'Presentation calendar lengths and modular codes'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-sans">
              — = record count not reported in the manuscript.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
