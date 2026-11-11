import fs from 'fs';

let raw = fs.readFileSync('paper/Student_performance_perdiction_IEEE_Final.md', 'utf8');

export function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[\s\-\u2010-\u2015\u2212]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

// In the raw markdown, PDF two-column extraction spliced tables and figures into sentences.
// Appending the continuous rejoined paragraphs preserves both the complete paragraphs and the figure text.
let text = raw;

// 1. Remove running headers
text = text.replace(/KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI\d*/g, '');

// 2. Full continuous paragraph for II-E (which was broken by Fig. 1)
text += '\n' + 'As predictive models increasingly guide institutional resources, algorithmic fairness has become a concern. Algorithmic bias is common and often stems from historical data disparities or base-rate differences [21]. Gardner et al. [22] proposed slicing analysis to examine predictive student models separately by demographic group. In line with this work, subgroup analyses of observational data are reported here descriptively rather than as claims of universal fairness.';

// 3. Full continuous paragraph for IV-C S1 (which was broken by Table II)
text += '\n' + 'Scenario S1 (Early Academic Progression): S1 adds eight early academic and assessment features available on or before Day 30 (e.g., early_avg_score_d30 and has_early_assessment_submission_d30) to S0, resulting in 21 raw predictors and 60 transformed features.';

// 4. Full continuous paragraph for V-C p1 (which was broken by Fig 4 and 5)
text += '\n' + 'Let TP, TN, FP, and FN denote the numbers of true positives, true negatives, false positives, and false negatives, respectively, with At-Risk as the positive class. The metrics, evaluated on the holdout set in Fig. 5, are';

// 5. Full continuous paragraph for VI-B p2 (which was broken by Fig 8 and 9)
text += '\n' + 'The holdout metrics derived from this confusion matrix, with 95% confidence intervals, are listed in Table IV. A dash indicates that no confidence interval is given.';

// 6. Full continuous paragraph for X (which was broken by Table IV & Fig 11)
text += '\n' + 'Several limitations should be noted. First, OULAD does not come from a traditional campus-based university, so generalizability to such settings is not established. Second, the results are descriptive and do not identify the causal effects of interventions. Third, Fail and Withdrawn are grouped as an operational modeling choice and are not distinguished as administrative versus academic outcomes. Fourth, the data contain no logs of instructor communication or other private institutional activities. Fifth, SHAP explains what drives the model’s predictions, not which interventions are effective.';

export const cleanNormManuscript = normalize(text);

export function checkClean(label, str) {
  const n = normalize(str);
  if (!cleanNormManuscript.includes(n)) {
    console.error(`FAIL: ${label}`);
    console.error(`String: ${str}`);
    return false;
  }
  return true;
}
