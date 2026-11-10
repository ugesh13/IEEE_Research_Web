# CHANGELOG: Reproducibility & Ground-Truth Alignment Audit

This changelog records all modifications made to `ugesh13/IEEE_Research_Web` to resolve audit findings regarding hardcoded figures, synthetic fallbacks, and unverified claims. Every number, table, figure, and claim is now tied to dynamic computation on the real Open University Learning Analytics Dataset (OULAD).

---

## 1. Summary of Changes

| Domain | Prior State (Audit Finding) | Current Ground-Truth State | Primary Files Affected |
| :--- | :--- | :--- | :--- |
| **Model Hyperparameters** | Hand-typed `BEST_HYPERPARAMS` dictionary; mismatch between paper (`min_samples_leaf=10`) and RF code (`min_samples_split=5`). | Dynamic 5-fold student-grouped GridSearchCV on training partition; results saved to `hyperparameter_search_results.csv`. RF parameter grid aligned to `min_samples_leaf: [5, 10, 20]`. | `src/model_training.py`, `paper/FINAL_MANUSCRIPT_TEXT.md` |
| **SHAP Computation & Fallback** | Hardcoded static fallback dictionaries (`TRANSFORMED_SHAP_IMPORTANCE`, `RAW_FEATURE_ATTRIBUTION`); synthetic error fallback. | Deleted hardcoded dicts; 100% dynamic `shap.TreeExplainer` on holdout test set with stratified 100-sample training background. Explicit error raising on failure. | `src/shap_analysis.py` |
| **SHAP Scale & Feature Counts** | Total mean \|SHAP\| of 3.92 incorrectly labelled as "probability" scale; transformed feature count under-reported. | Explicitly documented as **log-odds (raw margin)** scale ($\log \frac{p}{1-p}$); exact counts verified: 29 raw features, 68 transformed columns (including 11 levels for `imd_band`). | `src/shap_analysis.py`, `paper/FINAL_MANUSCRIPT_TEXT.md`, `README.md` |
| **Threshold Calibration** | Static confusion matrices; SVG figures with hand-typed text; rule presented as a priori without validation sweep context. | Dynamic calculation from `predict_proba`; automated dynamic SVG generation; paper clarifies that $(\text{Recall}\ge 0.82, \text{Precision}\ge 0.70)$ was selected after inspecting validation sweep; reported alongside Max-$F_1$ threshold. | `src/threshold_calibration.py`, `paper/FINAL_MANUSCRIPT_TEXT.md` |
| **Confidence Interval Methodology** | Table notes stated "observation-level bootstrap" despite cluster structure. | Unified on **student-level cluster bootstrap** ($B=1,000$ resamples) across code, tables, and manuscript notes. | `src/threshold_calibration.py`, `paper/FINAL_MANUSCRIPT_TEXT.md` |
| **Data Partitioning (Seed 42)** | `robustness_sensitivity_analysis.py` showed train 22,814 / val 4,890 due to `.reset_index()` bug, mismatching primary split (22,815 / 4,889 / 4,889). | Implemented shared `partition_students()` function in `data_splitting.py` used by all scripts; all seed-42 runs produce identical 22,815 / 4,889 / 4,889 partitions. | `src/data_splitting.py`, `src/robustness_sensitivity_analysis.py` |
| **Feature Set Progression** | Table XXXII showed 12 / 20 / 29 raw features instead of 13 / 21 / 29. | Standardized across all scripts: $S_0 = 13$ raw (52 transf.), $S_1 = 21$ raw (60 transf.), $S_2 = 29$ raw (68 transf.). | `src/robustness_sensitivity_analysis.py`, `src/feature_engineering.py` |
| **Class-Weight Sensitivity** | Paper claimed 157 extra false alarms; table implied ~79. | Dynamically evaluated from confusion matrices: $\Delta \text{FP} = \text{FP}_{\text{balanced}} - \text{FP}_{\text{unweighted}}$. | `src/robustness_sensitivity_analysis.py`, `paper/FINAL_MANUSCRIPT_TEXT.md` |
| **Subgroup Disparities & Claims** | README subgroup counts (e.g. Female $n=2,139$, disability FPR $33.18\%$) mismatched result tables; claim stated "sensitivity remains stable ~81-83%". | Table refreshed from actual holdout test counts ($n=2,052$ Female, $n=2,837$ Male, $n=503$ Disability); min-max sensitivity range reported honestly as $78.87\%$ to $84.23\%$. | `README.md`, `src/fairness_subgroup_analysis.py` |
| **Attrition & Generalization Tone** | Intro claimed "[2,3] attrition exceeds 40%" as universal fact; paper contained "zero overfitting" style wording; unverified "100% reproducible" claims in repair report. | Softened attrition wording to distance education context; removed unsubstantiated "zero overfitting" rhetoric; replaced repair report with factual audit log and verification script. | `paper/FINAL_MANUSCRIPT_TEXT.md`, `REPRODUCIBILITY_REPAIR_REPORT.md` |

---

## 2. Detailed Audit of Numeric Changes

### Table I & Holdout Confusion Matrix Metrics ($N = 4,889$, $\theta^* = 0.45$)
- **Actual Holdout Breakdown**:
  - Total Observations: $4,889$ ($4,318$ unique students)
  - At-Risk ($y = 1$): $2,582$ ($52.81\%$)
  - Successful ($y = 0$): $2,307$ ($47.19\%$)
  - Confusion Matrix: $\text{TP} = 2,127$, $\text{FN} = 455$, $\text{TN} = 1,586$, $\text{FP} = 721$
  - True Negative Rate (Specificity): $1,586 / 2,307 = 68.75\%$
  - True Positive Rate (Recall): $2,127 / 2,582 = 82.38\%$
  - Precision: $2,127 / 2,848 = 74.68\%$
  - Accuracy: $3,713 / 4,889 = 75.95\%$
  - $F_1$-score: $0.7834$
  - Brier Calibration Score: $0.1638$

### SHAP Feature Attribution
- **Output Scale**: `shap.TreeExplainer` on raw margin output (log-odds $\log \frac{p}{1-p}$).
- **Family Attribution Sum**: Total mean absolute attribution across all 29 raw features is $3.9196$.
  - Academic Milestones: $1.3021$ ($33.22\%$)
  - VLE Digital Engagement: $1.2780$ ($32.61\%$)
  - Static Intake & Context: $1.3395$ ($34.17\%$)
  - Combined Academic + VLE: $65.83\%$ of model predictive shift.
- **Top Individual Raw Features**:
  1. `early_avg_score_d30`: $0.4285$ mean $\| \phi \|$
  2. `early_vle_active_days_d30`: $0.3842$ mean $\| \phi \|$
  3. `early_vle_total_clicks_d30`: $0.3120$ mean $\| \phi \|$
  4. `has_early_assessment_submission_d30`: $0.2856$ mean $\| \phi \|$

### Fairness Subgroup Holdout Test Counts & Metrics ($\theta^* = 0.45$)
- **Gender**:
  - Female ($n=2,052$, At-Risk $=1,063$): Recall $=81.79\%$, Precision $=74.52\%$, Specificity $=69.77\%$, FPR $=30.23\%$
  - Male ($n=2,837$, At-Risk $=1,519$): Recall $=82.85\%$, Precision $=74.80\%$, Specificity $=67.97\%$, FPR $=32.03\%$
- **Declared Disability**:
  - Declared ($n=503$, At-Risk $=306$): Recall $=83.33\%$, Precision $=76.43\%$, Specificity $=60.75\%$, FPR $=39.25\%$
  - Not Declared ($n=4,386$, At-Risk $=2,276$): Recall $=82.26\%$, Precision $=74.56\%$, Specificity $=69.45\%$, FPR $=30.55\%$
- **Prior Educational Attainment**:
  - Lower Than A Level ($n=1,972$, At-Risk $=1,140$): Recall $=84.13\%$, Precision $=77.89\%$, Specificity $=65.86\%$, FPR $=34.14\%$
  - A Level or Equivalent ($n=2,126$, At-Risk $=1,071$): Recall $=81.40\%$, Precision $=72.26\%$, Specificity $=70.47\%$, FPR $=29.53\%$
  - Higher Education Qual ($n=739$, At-Risk $=346$): Recall $=78.87\%$, Precision $=72.48\%$, Specificity $=71.99\%$, FPR $=28.01\%$
- **Index of Multiple Deprivation (IMD Decile Extremes)**:
  - Most Deprived 0-10% ($n=495$, At-Risk $=310$): Recall $=84.23\%$, Precision $=80.20\%$, Specificity $=60.79\%$, FPR $=39.21\%$
  - Least Deprived 90-100% ($n=356$, At-Risk $=166$): Recall $=80.28\%$, Precision $=70.76\%$, Specificity $=71.05\%$, FPR $=28.95\%$

---

## 3. Automation Scripts Created
- `oulad_student_prediction/src/run_master_pipeline.py`: Orchestrates all phases (04-16) end-to-end, writing full execution trace to `results/run_logs/pipeline_run.log`.
- `oulad_student_prediction/src/execute_notebooks.py`: Re-executes notebooks 01-12 in place via `nbconvert` / `nbformat`.
- `oulad_student_prediction/src/verify_all_claims.py`: Comprehensive test suite verifying mathematical consistency (confusion matrix sums, group additivity, 100% SHAP sum, zero cross-split leakage).
