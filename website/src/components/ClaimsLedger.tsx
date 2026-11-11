import React from 'react';
import { ShieldCheck, Database, HelpCircle, AlertTriangle } from 'lucide-react';
import results from '../data/paper_results.json';

interface ClaimItem {
  claim: string;
  value: string;
  source: string;
  provenance: 'Manuscript Table' | 'Derived' | 'Repo Supplement' | 'Website Note';
  status: 'Reported' | 'Derived' | 'Does Not Reproduce' | 'Methodological Note';
  notes: string;
}

export const ClaimsLedger: React.FC = () => {
  const claims: ClaimItem[] = [
    {
      claim: 'Locked Holdout ROC-AUC',
      value: `${results.holdout.metrics.roc_auc.value} [${results.holdout.metrics.roc_auc.ci.join('–')}]`,
      source: 'Manuscript Table IV',
      provenance: 'Manuscript Table',
      status: 'Reported',
      notes: 'Primary HGB model evaluated on locked holdout (N=4,889 observations, 4,318 students).',
    },
    {
      claim: 'Locked Holdout At-Risk Recall',
      value: `${results.holdout.metrics.at_risk_recall_pct.value}% [${results.holdout.metrics.at_risk_recall_pct.ci.join('–')}]`,
      source: 'Manuscript Table IV',
      provenance: 'Manuscript Table',
      status: 'Reported',
      notes: 'Satisfies the operational recall constraint (≥ 82%) set during validation threshold tuning.',
    },
    {
      claim: 'Locked Holdout F1-Score',
      value: `${results.holdout.metrics.f1.value} [${results.holdout.metrics.f1.ci.join('–')}]`,
      source: 'Manuscript Table IV',
      provenance: 'Manuscript Table',
      status: 'Reported',
      notes: 'Harmonic mean of holdout precision (74.68%) and recall (82.38%).',
    },
    {
      claim: 'Holdout Operating Decision Threshold',
      value: `θ* = ${results.threshold.value}`,
      source: 'Manuscript Section VI-B / Eq. (12)',
      provenance: 'Manuscript Table',
      status: 'Reported',
      notes: 'Selected on validation partition only: max θ where Recall ≥ 0.82 and Precision ≥ 0.70.',
    },
    {
      claim: 'Holdout Confusion Matrix Counts',
      value: `TP=${results.holdout.confusion_matrix.TP}, FN=${results.holdout.confusion_matrix.FN}, FP=${results.holdout.confusion_matrix.FP}, TN=${results.holdout.confusion_matrix.TN}`,
      source: 'Manuscript Table III & Fig. 10',
      provenance: 'Manuscript Table',
      status: 'Reported',
      notes: 'Total N=4,889. Primary HGB model at θ*=0.45.',
    },
    {
      claim: 'Dynamic Feature Families SHAP Share',
      value: `${results.shap.dynamic_combined_pct}% (Academic: ${results.shap.family_share_pct.academic_milestones}%, VLE: ${results.shap.family_share_pct.vle_digital_engagement}%)`,
      source: 'Manuscript Table V & Fig. 11',
      provenance: 'Manuscript Table',
      status: 'Reported',
      notes: 'Static intake family accounts for 34.17%. Two dynamic families combine to 65.83%.',
    },
    {
      claim: 'Derived S2 Validation ROC-AUC',
      value: '0.8425',
      source: 'Supplement Table XV',
      provenance: 'Repo Supplement',
      status: 'Reported',
      notes: 'Validation ROC-AUC reported in original Table XV for HGB S2.',
    },
    {
      claim: 'Derived S1 Validation ROC-AUC',
      value: '0.7592 (= 0.8425 − 0.0833)',
      source: 'Derived from Table XV & Fig. 9',
      provenance: 'Derived',
      status: 'Derived',
      notes: 'Derived by subtracting manuscript VLE increment (0.0833) from S2 validation AUC.',
    },
    {
      claim: 'Derived S0 Validation ROC-AUC',
      value: '0.6208 (= 0.7592 − 0.1384)',
      source: 'Derived from Table XV & Fig. 9',
      provenance: 'Derived',
      status: 'Derived',
      notes: 'Derived by subtracting manuscript academic increment (0.1384) from S1 validation AUC.',
    },
    {
      claim: 'Recomputed SHAP Feature Family Shares',
      value: 'Static: 40.80%, Academic: 32.72%, VLE: 26.48% (Dynamic: 59.20%)',
      source: 'Supplement Block C',
      provenance: 'Repo Supplement',
      status: 'Does Not Reproduce',
      notes: 'Recomputed on local test run (N=4,859). VLE share is 26.48% vs 32.61% reported in manuscript.',
    },
    {
      claim: 'Day-30 Early Unregistration Sensitivity Disparity',
      value: 'All-cohort AUC 0.8487 (recall 76.12%) vs Active-only AUC 0.7931 (recall 67.24%)',
      source: 'Supplement Block D',
      provenance: 'Repo Supplement',
      status: 'Does Not Reproduce',
      notes: 'Local run audit (N=4,859). Removing 756 early-withdrawn enrollments reduces AUC by 0.0556 and recall by 8.88 pp.',
    },
    {
      claim: 'Early Unregistration Retention in Sample',
      value: 'Unspecified in manuscript text',
      source: 'Discussion Section X (Limitation #6)',
      provenance: 'Website Note',
      status: 'Methodological Note',
      notes: 'Audit demonstrates that keeping vs excluding Day-30 early departures changes model sensitivity.',
    },
  ];

  return (
    <section id="claims" className="py-12 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 mb-3">
            Traceability &amp; Audit Ledger
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Claims Ledger &amp; Provenance Matrix
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Every numerical claim on this website is mapped to its precise source of truth, distinguishing reported manuscript findings from derived calculations and repository supplement audits.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700 font-mono">
              <tr>
                <th className="py-3 px-4">Claim / Finding</th>
                <th className="py-3 px-4">Value / Metric</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-center">Provenance Chip</th>
                <th className="py-3 px-4 text-center">Parity Status</th>
                <th className="py-3 px-4">Audit Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {claims.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-sans">
                    {c.claim}
                  </td>
                  <td className="py-3 px-4 text-brand-700 dark:text-brand-300 font-bold">
                    {c.value}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-sans text-[11px]">
                    {c.source}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.provenance === 'Manuscript Table'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : c.provenance === 'Derived'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : c.provenance === 'Repo Supplement'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {c.provenance}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Reported'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : c.status === 'Derived'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : c.status === 'Does Not Reproduce'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {c.status === 'Reported' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                      {c.status === 'Derived' && <Database className="w-3 h-3 text-blue-600" />}
                      {c.status === 'Does Not Reproduce' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      {c.status === 'Methodological Note' && <HelpCircle className="w-3 h-3 text-slate-500" />}
                      <span>{c.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-sans text-xs max-w-xs">
                    {c.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ClaimsLedger;
