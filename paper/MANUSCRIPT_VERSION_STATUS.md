# MANUSCRIPT VERSION STATUS & ARTIFACT REGISTRY

**Project**: *Student Performance Prediction Using Machine Learning and Explainable AI: An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)*  
**Date**: October 2, 2026  
**Auditor**: Antigravity Research Assistant & Quality Assurance Pipeline  
**Status**: COMPLETE — Pipeline Frozen & Audited  

---

## 1. PURPOSE

This registry establishes the authoritative baseline for all research artifacts, source tables, figures, models, and text files associated with the OULAD student performance prediction study. It explicitly enumerates authoritative artifacts approved for IEEE submission and flags obsolete or superseded files to prevent accidental regression.

---

## 2. AUTHORITATIVE MANUSCRIPT FILES

| Document | File Path | Status | Description |
| :--- | :--- | :---: | :--- |
| **Primary Manuscript Text** | `oulad_student_prediction/paper/FINAL_MANUSCRIPT_TEXT.md` | **AUTHORITATIVE** | Complete IEEE-formatted manuscript text containing all 14 sections, equations, tables, confusion matrix diagrams, and references. |
| **IEEE Word Document** | `oulad_student_prediction/paper/Student_Performance_Prediction_OULAD_IEEE_Draft.docx` | **AUTHORITATIVE** | Editable WordprocessingML (.docx) manuscript formatted in standard IEEE Transactions style. |
| **Reference Verification Report** | `oulad_student_prediction/paper/REFERENCE_VERIFICATION_REPORT.md` | **AUTHORITATIVE** | Forensic audit verifying all 14 bibliographic entries against official publishing indexes (Nature, IEEE, ACM, Springer, Elsevier). Zero fabricated citations. |
| **Submission Readiness Report** | `oulad_student_prediction/paper/FINAL_SUBMISSION_READINESS_REPORT.md` | **AUTHORITATIVE** | Comprehensive 10-point audit verifying numerical consistency, non-causal language, and test blinding integrity. |
| **Final Manuscript Audit Report** | `oulad_student_prediction/paper/FINAL_MANUSCRIPT_AUDIT_REPORT.md` | **AUTHORITATIVE** | Complete section-by-section audit report with 32-point numerical reconciliation table and submission recommendation. |

---

## 3. AUTHORITATIVE RESULT TABLES

All tables in the manuscript must be sourced strictly from the following verified artifacts in `oulad_student_prediction/results/tables/`:

| Table ID | File Path | Content & Purpose |
| :--- | :--- | :--- |
| **Table XII** | `results/tables/Table_XII_preprocessing_specification.md` | Preprocessing architecture and feature dimensionality ($S_0$: 13 raw $\rightarrow$ 52, $S_1$: 21 raw $\rightarrow$ 60, $S_2$: 29 raw $\rightarrow$ 68 transformed). |
| **Table XIII** | `results/tables/Table_XIII_preprocessing_leakage_audit.md` | 16-point leakage audit confirming zero data snooping across splits. |
| **Table XIV** | `results/tables/Table_XIV_cv_results.csv` | 5-fold student-grouped cross-validation performance across models and scenarios. |
| **Table XV** | `results/tables/Table_XV_model_comparison.md` | Multi-model evaluation on reserved validation set ($N = 4,889$). |
| **Table XVI** | `results/tables/Table_XVI_final_model_specification.md` | Final frozen model hyperparameter specification and operational threshold rule ($\theta^* = 0.45$). |
| **Table XVII** | `results/tables/Table_XVII_threshold_analysis.csv` | Validation threshold sweep ($\theta \in [0.10, 0.90]$). |
| **Table XVIII** | `results/tables/Table_XVIII_final_test_results.md` | Primary holdout test results at $\theta^* = 0.45$ with student-cluster bootstrap 95% CIs. |
| **Table XIX** | `results/tables/Table_XIX_test_confusion_matrix.csv` | Primary holdout test confusion matrix ($\text{TP}=2,127, \text{FN}=455, \text{TN}=1,586, \text{FP}=721$). |
| **Table XXI** | `results/tables/Table_XXI_shap_global_importance.md` | Transformed predictor SHAP global importance ranking. |
| **Table XXII** | `results/tables/Table_XXII_shap_raw_feature_group_importance.md` | Raw feature family SHAP attribution (Academic: 33.22%, VLE: 32.61%, Total Behavioral: 65.83%). |
| **Table XXIII** | `results/tables/Table_XXIII_shap_local_examples.md` | Case-level local waterfall explanations across confusion matrix quadrants. |
| **Table XXIV** | `results/tables/Table_XXIV_subgroup_sample_sizes.md` | Subgroup sample sizes and target prevalence under $n \ge 100$ threshold. |
| **Table XXV** | `results/tables/Table_XXV_subgroup_performance_metrics.md` | Descriptive subgroup performance metrics on holdout test set with cluster bootstrap CIs. |
| **Table XXVI** | `results/tables/Table_XXVI_subgroup_error_counts.md` | Integer confusion matrix counts across demographic strata. |
| **Table XXVII** | `results/tables/Table_XXVII_exploratory_intersectional_analysis.md` | Gender $\times$ Disability intersectional performance. |
| **Table XXVIII** | `results/tables/Table_XXVIII_threshold_sensitivity.md` & `.csv` | Holdout test sensitivity across operating thresholds ($\theta \in [0.20, 0.80]$). |
| **Table XXIX** | `results/tables/Table_XXIX_seed_robustness.md` & `.csv` | Partition stability across 5 random seeds (7, 21, 42, 84, 123). |
| **Table XXX** | `results/tables/Table_XXX_bootstrap_sensitivity.md` & `.csv` | Uncertainty estimation comparison (Student Cluster vs. Observation Bootstrap). |
| **Table XXXI** | `results/tables/Table_XXXI_class_weight_sensitivity.md` & `.csv` | Sensitivity comparison of unweighted vs. balanced loss formulations. |
| **Table XXXII** | `results/tables/Table_XXXII_scenario_robustness.md` & `.csv` | Multi-seed verification of $S_0 < S_1 < S_2$ performance progression. |

---

## 4. AUTHORITATIVE FIGURES & UNDERLYING DATA

All figures must be rendered from the following publication-quality vector SVG files and matched with their underlying data tables in `oulad_student_prediction/results/figures/`:

| Figure ID | Visual Artifact (SVG) | Data Artifact (CSV) | Depicted Content |
| :--- :--- | :--- | :--- | :--- |
| **Fig. 12** | `results/figures/Figure_12_roc_curves.svg` | `results/figures/data/fig12_roc_curves.csv` | Validation ROC curves across models and scenarios. |
| **Fig. 13** | `results/figures/Figure_13_pr_curves.svg` | `results/figures/data/fig13_pr_curves.csv` | Validation Precision-Recall curves across models and scenarios. |
| **Fig. 14** | `results/figures/Figure_14_confusion_matrices.svg` | `results/figures/data/fig14_confusion_matrices.csv` | Validation confusion matrices across 9 core experiments. |
| **Fig. 15** | `results/figures/Figure_15_threshold_analysis.svg` | `results/figures/data/fig15_threshold_analysis.csv` | Validation trade-offs across decision thresholds ($\theta$). |
| **Fig. 16** | `results/figures/Figure_16_calibration_curve.svg` | `results/figures/data/fig16_calibration_curve.csv` | Reliability diagrams comparing uncalibrated vs. Platt calibrated probabilities. |
| **Fig. 17** | `results/figures/Figure_17_final_test_confusion_matrix.svg` | `results/figures/data/fig17_final_test_confusion_matrix.csv` | Primary locked holdout test confusion matrix at $\theta^* = 0.45$. |
| **Fig. 18** | `results/figures/Figure_18_shap_global_bar.svg` | `results/figures/data/fig18_shap_global_bar.csv` | Mean absolute SHAP attribution across top 15 predictors. |
| **Fig. 19** | `results/figures/Figure_19_shap_beeswarm_summary.svg` | `results/figures/data/fig19_shap_beeswarm_summary.csv` | SHAP beeswarm summary depicting feature value impact on predicted risk. |
| **Fig. 20** | `results/figures/Figure_20_dependence_plots.svg` | `results/figures/data/fig20_dependence_plots.csv` | SHAP dependence plots for assessment score and active study days. |
| **Fig. 21** | `results/figures/Figure_21_local_waterfall.svg` | `results/figures/data/fig21_local_waterfall.csv` | Case-level local waterfall attribution plots across confusion matrix quadrants. |
| **Figs. 22–25** | `results/figures/Figure_22_subgroup_recall.svg` – `Figure_25_subgroup_roc_auc_f1.svg` | `results/figures/data/fig22_25_subgroup_metrics.csv` | Subgroup performance metrics across Gender, Disability, Education, and IMD. |
| **Figs. 26–28** | `results/figures/Figure_26_threshold_sensitivity.svg` – `Figure_28_scenario_robustness.svg` | `results/figures/data/fig26_threshold_sensitivity.csv` – `fig28_scenario_robustness.csv` | Holdout threshold sensitivity, random seed stability, and scenario progression robustness. |

---

## 5. AUTHORITATIVE EXECUTABLE MODEL ARTIFACT

| Artifact | File Path | Verification Status |
| :--- | :--- | :---: |
| **Frozen S2 HGB Model** | `models/s2_hgb_frozen_model.joblib` | **VERIFIED & REPRODUCIBLE** |

- Model architecture: `HistGradientBoostingClassifier`
- Hyperparameters: `learning_rate=0.05`, `max_iter=200`, `max_leaf_nodes=31`, `min_samples_leaf=20`, `class_weight=None`, `random_state=42`
- Pipeline: Scikit-learn Pipeline with fitted Median Imputer and OneHotEncoder
- Input dimension: 29 raw predictors
- Transformed dimension: 68 numeric/encoded features

---

## 6. OBSOLETE OR SUPERSEDED FILES (DO NOT USE FOR SUBMISSION)

To prevent accidental inclusion of unverified or intermediate draft content, the following files and patterns are marked as **SUPERSEDED / OBSOLETE**:

1. **Obsolete Phrasing: "46 additional at-risk students" / "reducing missed failures"**:
   - *Reason for obsolescence*: Technically inaccurate because the unit of analysis is course-presentation observations ($N = 4,889$), not unique students ($4,318$). Furthermore, At-Risk combines Fail and Withdrawn.
   - *Authoritative replacement*: *"At the frozen threshold of 0.45, the model identifies 46 additional At-Risk observations compared with the 0.50 benchmark, reducing the false-negative count from 501 to 455."*

2. **Obsolete Phrasing: "66.8% behavioral SHAP attribution" / "heavily outweighing"**:
   - *Reason for obsolescence*: Early uncalibrated narrative approximation.
   - *Authoritative replacement*: Exact audited calculation: Combined Academic + VLE attribution = $65.83\%$ ($2.5801 / 3.9196$).

3. **Observation-Level Bootstrap Confidence Intervals**:
   - *Reason for obsolescence*: Fails to account for within-student clustering across repeat course enrollments, deflating standard errors by $3.4\%$ to $6.1\%$.
   - *Authoritative replacement*: Student-level block cluster bootstrap ($B = 1,000$ resamples of `id_student`, `random_state=42`).

4. **Calibrated Probabilities as Primary Test Predictions**:
   - *Reason for obsolescence*: Platt scaling was strictly an auxiliary validation diagnostic.
   - *Authoritative replacement*: Native, uncalibrated `predict_proba()` from the frozen HGB model.

5. **Arbitrary Default Threshold ($\theta = 0.50$) as Operating Standard**:
   - *Reason for obsolescence*: Suboptimal for early advising intervention caseloads.
   - *Authoritative replacement*: Operational threshold $\theta^* = 0.45$, selected on validation data under the pre-specified constraint: $\text{Recall}_{\text{At-Risk}} \ge 0.82 \text{ and } \text{Precision}_{\text{At-Risk}} \ge 0.70$.

6. **Static/Hardcoded Script Outputs in Early Training Pipelines**:
   - *Reason for obsolescence*: Resolved during the Final Reproducibility Repair.
   - *Authoritative replacement*: Fully executable, dynamic scripts (`src/model_training.py`, `src/threshold_calibration.py`, `src/shap_analysis.py`).
