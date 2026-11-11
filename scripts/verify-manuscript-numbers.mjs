import fs from 'fs';
import path from 'path';

// Locate paths
let msPath = path.resolve('paper/Student_performance_perdiction_IEEE_Final.md');
if (!fs.existsSync(msPath)) msPath = path.resolve('../paper/Student_performance_perdiction_IEEE_Final.md');

let jsonPath = path.resolve('website/src/data/paper_results.json');
if (!fs.existsSync(jsonPath)) jsonPath = path.resolve('src/data/paper_results.json');

const msContent = fs.readFileSync(msPath, 'utf8');
const results = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let comparedCount = 0;

function assertMatch(label, actual, expected) {
  comparedCount++;
  if (typeof actual === 'number' && typeof expected === 'number') {
    if (Math.abs(actual - expected) > 1e-4) {
      console.error(`[FAIL] ${label}: actual=${actual}, expected=${expected}`);
      process.exit(1);
    }
  } else if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(`[FAIL] ${label}: actual=${JSON.stringify(actual)}, expected=${JSON.stringify(expected)}`);
    process.exit(1);
  }
}

console.log('[AUDIT] Verifying paper_results.json against Manuscript Tables I, III, IV, V, VI...');

// --- TABLE I: Outcome Distribution ---
assertMatch('Table I Total Observations', results.dataset.enrollments, 32593);
assertMatch('Table I Unique Students', results.dataset.unique_students, 28785);
assertMatch('Table I Pass Count', results.outcome_distribution.pass.count, 12361);
assertMatch('Table I Pass Share', results.outcome_distribution.pass.pct, 37.93);
assertMatch('Table I Distinction Count', results.outcome_distribution.distinction.count, 3024);
assertMatch('Table I Distinction Share', results.outcome_distribution.distinction.pct, 9.28);
assertMatch('Table I Withdrawn Count', results.outcome_distribution.withdrawn.count, 10156);
assertMatch('Table I Withdrawn Share', results.outcome_distribution.withdrawn.pct, 31.16);
assertMatch('Table I Fail Count', results.outcome_distribution.fail.count, 7052);
assertMatch('Table I Fail Share', results.outcome_distribution.fail.pct, 21.64);
assertMatch('Table I Successful Total Count', results.outcome_distribution.successful_total.count, 15385);
assertMatch('Table I Successful Total Pct', results.outcome_distribution.successful_total.pct, 47.20);
assertMatch('Table I At-Risk Total Count', results.outcome_distribution.at_risk_total.count, 17208);
assertMatch('Table I At-Risk Total Pct', results.outcome_distribution.at_risk_total.pct, 52.80);

// --- TABLE III: Confusion Matrix ---
assertMatch('Table III TP', results.holdout.confusion_matrix.TP, 2127);
assertMatch('Table III FN', results.holdout.confusion_matrix.FN, 455);
assertMatch('Table III FP', results.holdout.confusion_matrix.FP, 721);
assertMatch('Table III TN', results.holdout.confusion_matrix.TN, 1586);

// --- TABLE IV: Holdout Performance & 95% CIs ---
assertMatch('Table IV ROC-AUC Value', results.holdout.metrics.roc_auc.value, 0.8406);
assertMatch('Table IV ROC-AUC CI', results.holdout.metrics.roc_auc.ci, [0.8298, 0.8512]);

assertMatch('Table IV PR-AUC Value', results.holdout.metrics.pr_auc.value, 0.8459);
assertMatch('Table IV PR-AUC CI', results.holdout.metrics.pr_auc.ci, [0.8348, 0.8567]);

assertMatch('Table IV Accuracy Value', results.holdout.metrics.accuracy_pct.value, 75.95);
assertMatch('Table IV Accuracy CI', results.holdout.metrics.accuracy_pct.ci, [74.74, 77.15]);

assertMatch('Table IV Recall Value', results.holdout.metrics.at_risk_recall_pct.value, 82.38);
assertMatch('Table IV Recall CI', results.holdout.metrics.at_risk_recall_pct.ci, [80.89, 83.82]);

assertMatch('Table IV Precision Value', results.holdout.metrics.at_risk_precision_pct.value, 74.68);
assertMatch('Table IV Precision CI', results.holdout.metrics.at_risk_precision_pct.ci, [73.08, 76.24]);

assertMatch('Table IV F1 Value', results.holdout.metrics.f1.value, 0.7834);
assertMatch('Table IV F1 CI', results.holdout.metrics.f1.ci, [0.7721, 0.7944]);

assertMatch('Table IV Specificity Value', results.holdout.metrics.specificity_pct.value, 68.75);
assertMatch('Table IV Specificity CI', results.holdout.metrics.specificity_pct.ci, [66.85, 70.61]);

assertMatch('Table IV FPR Value', results.holdout.metrics.fpr_pct.value, 31.25);
assertMatch('Table IV FPR CI', results.holdout.metrics.fpr_pct.ci, null);

assertMatch('Table IV FNR Value', results.holdout.metrics.fnr_pct.value, 17.62);
assertMatch('Table IV FNR CI', results.holdout.metrics.fnr_pct.ci, null);

assertMatch('Table IV Brier Score Value', results.holdout.metrics.brier.value, 0.1638);
assertMatch('Table IV Brier Score CI', results.holdout.metrics.brier.ci, [0.1565, 0.1712]);

// --- TABLE V: SHAP Attribution Summary ---
assertMatch('Table V Academic Milestones Share', results.shap.family_share_pct.academic_milestones, 33.22);
assertMatch('Table V VLE Digital Engagement Share', results.shap.family_share_pct.vle_digital_engagement, 32.61);
assertMatch('Table V Static Intake & Context Share', results.shap.family_share_pct.static_intake_and_context, 34.17);
assertMatch('Table V Dynamic Combined Share', results.shap.dynamic_combined_pct, 65.83);

// --- TABLE VI: Subgroup Evaluation ---
const expectedSubgroups = [
  { attribute: 'Gender', stratum: 'Female', recall: 81.79, fpr: null },
  { attribute: 'Gender', stratum: 'Male', recall: 82.85, fpr: null },
  { attribute: 'Disability', stratum: 'No declared disability', recall: 82.26, fpr: 30.55 },
  { attribute: 'Disability', stratum: 'Declared disability', recall: 83.33, fpr: 39.25 },
  { attribute: 'Prior attainment', stratum: 'Lower than A Level', recall: 84.13, fpr: null },
  { attribute: 'Prior attainment', stratum: 'Higher education', recall: 78.87, fpr: null },
  { attribute: 'Socioeconomic (IMD)', stratum: 'Most deprived', recall: 84.23, fpr: null },
  { attribute: 'Socioeconomic (IMD)', stratum: 'Least deprived', recall: 80.28, fpr: null }
];

for (let i = 0; i < expectedSubgroups.length; i++) {
  const exp = expectedSubgroups[i];
  const act = results.subgroups_recall_at_threshold_0_45[i];
  assertMatch(`Table VI [${i}] Stratum`, act.stratum, exp.stratum);
  assertMatch(`Table VI [${i}] Recall`, act.recall_pct, exp.recall);
  assertMatch(`Table VI [${i}] FPR`, act.fpr_pct, exp.fpr);
}

console.log(`[PASS] verify-manuscript-numbers passed: ${comparedCount} values successfully compared and verified.`);
process.exit(0);
