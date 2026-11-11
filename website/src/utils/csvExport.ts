import results from '../data/paper_results.json';

export const downloadTableCsv = (tableNum: string) => {
  let filename = '';
  let csvContent = '';

  switch (tableNum) {
    case 'I':
      filename = 'Table_I_Outcome_Distribution.csv';
      csvContent = 'Class,Outcome,Count,Share_Pct\n' +
        `Successful,Pass,${results.outcome_distribution.pass.count},${results.outcome_distribution.pass.pct}\n` +
        `Successful,Distinction,${results.outcome_distribution.distinction.count},${results.outcome_distribution.distinction.pct}\n` +
        `At-Risk,Withdrawn,${results.outcome_distribution.withdrawn.count},${results.outcome_distribution.withdrawn.pct}\n` +
        `At-Risk,Fail,${results.outcome_distribution.fail.count},${results.outcome_distribution.fail.pct}\n` +
        `Successful,Total,${results.outcome_distribution.successful_total.count},${results.outcome_distribution.successful_total.pct}\n` +
        `At-Risk,Total,${results.outcome_distribution.at_risk_total.count},${results.outcome_distribution.at_risk_total.pct}\n`;
      break;

    case 'II':
      filename = 'Table_II_Temporal_Scenarios.csv';
      csvContent = 'Scenario,Description,Raw_Predictors,Transformed_Features\n' +
        `S0,${results.scenarios[0].name},${results.scenarios[0].raw_predictors},${results.scenarios[0].transformed_features}\n` +
        `S1,${results.scenarios[1].name},${results.scenarios[1].raw_predictors},${results.scenarios[1].transformed_features}\n` +
        `S2,${results.scenarios[2].name},${results.scenarios[2].raw_predictors},${results.scenarios[2].transformed_features}\n`;
      break;

    case 'III':
      filename = 'Table_III_Holdout_Confusion_Matrix.csv';
      csvContent = 'Actual_Class,Predicted_At_Risk,Predicted_Successful,Total\n' +
        `Actual_At_Risk,${results.holdout.confusion_matrix.TP},${results.holdout.confusion_matrix.FN},${results.holdout.confusion_matrix.TP + results.holdout.confusion_matrix.FN}\n` +
        `Actual_Successful,${results.holdout.confusion_matrix.FP},${results.holdout.confusion_matrix.TN},${results.holdout.confusion_matrix.FP + results.holdout.confusion_matrix.TN}\n` +
        `Total,${results.holdout.confusion_matrix.TP + results.holdout.confusion_matrix.FP},${results.holdout.confusion_matrix.FN + results.holdout.confusion_matrix.TN},${results.partitions.holdout.observations}\n`;
      break;

    case 'IV':
      filename = 'Table_IV_Primary_Model_Performance.csv';
      csvContent = 'Metric,Value,CI_95_Lower,CI_95_Upper\n' +
        `ROC-AUC,${results.holdout.metrics.roc_auc.value},${results.holdout.metrics.roc_auc.ci[0]},${results.holdout.metrics.roc_auc.ci[1]}\n` +
        `PR-AUC,${results.holdout.metrics.pr_auc.value},${results.holdout.metrics.pr_auc.ci[0]},${results.holdout.metrics.pr_auc.ci[1]}\n` +
        `Accuracy_Pct,${results.holdout.metrics.accuracy_pct.value},${results.holdout.metrics.accuracy_pct.ci[0]},${results.holdout.metrics.accuracy_pct.ci[1]}\n` +
        `At_Risk_Recall_Pct,${results.holdout.metrics.at_risk_recall_pct.value},${results.holdout.metrics.at_risk_recall_pct.ci[0]},${results.holdout.metrics.at_risk_recall_pct.ci[1]}\n` +
        `At_Risk_Precision_Pct,${results.holdout.metrics.at_risk_precision_pct.value},${results.holdout.metrics.at_risk_precision_pct.ci[0]},${results.holdout.metrics.at_risk_precision_pct.ci[1]}\n` +
        `F1_Score,${results.holdout.metrics.f1.value},${results.holdout.metrics.f1.ci[0]},${results.holdout.metrics.f1.ci[1]}\n` +
        `Specificity_Pct,${results.holdout.metrics.specificity_pct.value},${results.holdout.metrics.specificity_pct.ci[0]},${results.holdout.metrics.specificity_pct.ci[1]}\n` +
        `False_Positive_Rate_Pct,${results.holdout.metrics.fpr_pct.value},,\n` +
        `False_Negative_Rate_Pct,${results.holdout.metrics.fnr_pct.value},,\n` +
        `Brier_Score,${results.holdout.metrics.brier.value},${results.holdout.metrics.brier.ci[0]},${results.holdout.metrics.brier.ci[1]}\n`;
      break;

    case 'V':
      filename = 'Table_V_SHAP_Family_Attribution.csv';
      csvContent = 'Feature_Family,Contribution_Pct\n' +
        `Static Intake & Context,${results.shap.family_share_pct.static_intake_and_context}\n` +
        `Academic Milestones,${results.shap.family_share_pct.academic_milestones}\n` +
        `VLE Digital Engagement,${results.shap.family_share_pct.vle_digital_engagement}\n` +
        `Dynamic Combined (Academic + VLE),${results.shap.dynamic_combined_pct}\n` +
        `Total,100.0\n`;
      break;

    case 'VI':
      filename = 'Table_VI_Descriptive_Subgroup_Evaluation.csv';
      csvContent = 'Attribute,Stratum,Recall_Pct,FPR_Pct\n';
      results.subgroups_recall_at_threshold_0_45.forEach((item) => {
        csvContent += `"${item.attribute}","${item.stratum}",${item.recall_pct},${item.fpr_pct !== null ? item.fpr_pct : ''}\n`;
      });
      break;

    default:
      return;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
