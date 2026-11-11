<div align="center">

# Student Performance Prediction Using Machine Learning and Explainable AI
### *An Experimental Study on Early-Warning Systems Using the Open University Learning Analytics Dataset (OULAD)*

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.3+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![SHAP](https://img.shields.io/badge/Explainability-SHAP-blueviolet?style=for-the-badge)](https://shap.readthedocs.io/)
[![Format](https://img.shields.io/badge/Format-IEEE%20Format-00629B?style=for-the-badge&logo=ieee&logoColor=white)](https://ieee.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## Executive Summary

Early identification of distance-education learners at risk of academic failure or withdrawal is an important topic in Learning Analytics (LA) and Educational Data Mining (EDM). Experimental studies in this setting often address two design considerations:
1. **Temporal Quarantine**: Ensuring features use only information available up to the intervention cutoff (Day 30), without access to subsequent interaction traces or post-enrollment unregistration dates.
2. **Student-Grouped Partitioning**: Preventing record overlap across training, validation, and holdout splits caused by repeated course enrollments (11.7% in OULAD).

This study evaluates early student risk prediction using the Open University Learning Analytics Dataset (OULAD; Kuzilek, Hlosta, & Zdrahal, Scientific Data 2017), covering **32,593 course enrollments across 28,785 unique students**. All features are restricted to the early-intervention horizon of **Day $\le 30$**.

Using **Histogram-based Gradient Boosting (`HistGradientBoostingClassifier`)**, the primary model achieves a holdout **ROC-AUC of 0.8406** [95% CI: 0.8298, 0.8512], an **At-Risk Recall (Sensitivity) of 82.38%** [95% CI: 80.89%, 83.82%], and an **At-Risk F1 of 0.7834** [95% CI: 0.7721, 0.7944] on the locked holdout evaluation partition ($N = 4,889$ observations, $4,318$ unique students) at the validation-selected operational threshold $\theta^* = 0.45$. Feature attribution analysis using **SHAP (Shapley Additive exPlanations)** indicates that early academic performance ($33.22\%$) and digital VLE engagement ($32.61\%$) together account for **65.83%** of predictive attribution, exceeding static intake attributes ($34.17\%$).

> **Scope Note**: Experimental, observational study. Attributions convey predictive association, not causal effects. Subgroup results are descriptive and are not fairness conclusions. All values reported below are those reported in the manuscript (Kumar & Sharma, 2026).

---

## Key Experimental Findings

### Model Comparison Across Information Horizons (Validation Partition)

The validation comparison across information horizons ($S_0 \rightarrow S_1 \rightarrow S_2$) and model architectures (Logistic Regression, Random Forest, Gradient Boosting) is reported in [`oulad_student_prediction/results/tables/Table_XV_model_comparison.md`](oulad_student_prediction/results/tables/Table_XV_model_comparison.md):

| Scenario | Model Architecture | Val ROC-AUC | Val PR-AUC | Val Accuracy | Val Recall | Val Precision | Val F1 | Val Brier |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$S_0$ (Intake Baseline)** | Logistic Regression | 0.6104 | 0.6042 | 58.95% | 64.97% | 60.32% | 0.6256 | 0.2412 |
| **$S_0$ (Intake Baseline)** | Random Forest | 0.6052 | 0.5986 | 58.36% | 64.01% | 59.88% | 0.6187 | 0.2428 |
| **$S_0$ (Intake Baseline)** | **Gradient Boosting** | **0.6208** | **0.6145** | **59.71%** | **65.67%** | **60.99%** | **0.6325** | **0.2385** |
| **$S_1$ (Early Academic)** | Logistic Regression | 0.7389 | 0.7365 | 68.28% | 73.03% | 68.80% | 0.7085 | 0.2078 |
| **$S_1$ (Early Academic)** | Random Forest | 0.7485 | 0.7468 | 68.97% | 73.73% | 69.40% | 0.7150 | 0.2035 |
| **$S_1$ (Early Academic)** | **Gradient Boosting** | **0.7592** | **0.7578** | **70.12%** | **74.82%** | **0.7042** | **0.7255** | **0.1982** |
| **$S_2$ (Early Behavioral)** | Logistic Regression | 0.8168 | 0.8220 | 74.41% | 78.65% | 74.36% | 0.7645 | 0.1742 |
| **$S_2$ (Early Behavioral)** | Random Forest | 0.8321 | 0.8368 | 75.41% | 79.74% | 75.19% | 0.7740 | 0.1685 |
| **$S_2$ (Early Behavioral)** | **Gradient Boosting** | **0.8425** | **0.8478** | **76.44%** | **80.86%** | **0.7603** | **0.7837** | **0.1624** |

*All values reflect the evaluation on the reserved validation set ($N = 4,889$ observations, $4,318$ students).*

---

### Final Holdout Evaluation Results ($\theta^* = 0.45$, $N = 4,889$ Observations, $4,318$ Students)

| Evaluation Metric | Reported Point Value | 95% Bootstrap Confidence Interval | Formula / Derivation |
| :--- | :---: | :---: | :--- |
| **ROC-AUC** | **0.8406** | [0.8298, 0.8512] | Area under receiver operating characteristic curve |
| **PR-AUC (Average Precision)** | **0.8459** | [0.8348, 0.8567] | Area under precision-recall curve |
| **At-Risk Recall (Sensitivity)** | **82.38%** | [80.89%, 83.82%] | $\text{TP} / (\text{TP} + \text{FN}) = 2,127 / (2,127 + 455)$ |
| **At-Risk Precision (PPV)** | **74.68%** | [73.08%, 76.24%] | $\text{TP} / (\text{TP} + \text{FP}) = 2,127 / (2,127 + 721)$ |
| **At-Risk F1-Score** | **0.7834** | [0.7721, 0.7944] | Harmonic mean: $2 \cdot \text{Prec} \cdot \text{Rec} / (\text{Prec} + \text{Rec})$ |
| **Specificity (TNR)** | **68.75%** | [66.89%, 70.58%] | $\text{TN} / (\text{TN} + \text{FP}) = 1,586 / (1,586 + 721)$ |
| **Overall Accuracy** | **75.95%** | [0.7472%, 77.15%] | $(\text{TP} + \text{TN}) / N = (2,127 + 1,586) / 4,889$ |
| **Brier Calibration Score** | **0.1638** | [0.1565, 0.1712] | Mean squared probability error |
| **False Positive Rate (FPR)** | **31.25%** | — | $\text{FP} / (\text{FP} + \text{TN}) = 721 / (721 + 1,586)$ |
| **False Negative Rate (FNR)** | **17.62%** | — | $\text{FN} / (\text{TP} + \text{FN}) = 455 / (2,127 + 455)$ |
| **True Positives (TP)** | **2,127** | — | Correctly flagged at-risk enrollments |
| **False Negatives (FN)** | **455** | — | Missed at-risk enrollments |
| **False Positives (FP)** | **721** | — | False alarms on successful enrollments |
| **True Negatives (TN)** | **1,586** | — | Correctly identified successful enrollments |

> **Operational Threshold Selection**: $\theta^* = 0.45$ was selected on the validation partition via the operational rule: $\max\{\theta \in [0.10, 0.90] : \text{Recall} \ge 0.82 \text{ and } \text{Precision} \ge 0.70\}$. All reported holdout metrics are evaluated at this frozen validation threshold.

---

## Methodological Architecture

```mermaid
flowchart TD
    subgraph Raw_OULAD [Raw Relational OULAD Tables]
        R1[studentInfo.csv]
        R2[studentRegistration.csv]
        R3[studentAssessment.csv]
        R4[assessments.csv]
        R5[studentVle.csv]
        R6[vle.csv]
        R7[courses.csv]
    end

    subgraph Temporal_Firewall [Temporal Quarantine - Day <= 30]
        TF1[Quarantine Unregistration Dates]
        TF2[Filter Assessments: date_submitted <= 30]
        TF3[Filter Clicks: interaction_day <= 30]
        TF4[Exclude End-of-Term Final Exams]
    end

    subgraph Feature_Horizons [Nested Information Horizons]
        S0["Scenario S0: 13 Raw Predictors -> 52 Transformed"]
        S1["Scenario S1: 21 Raw Predictors -> 60 Transformed"]
        S2["Scenario S2: 29 Raw Predictors -> 68 Transformed"]
    end

    subgraph Validation [Student-Grouped Evaluation]
        SG[Student-Level Grouping: No Overlap]
        Train["70% Train: 22,815 obs (20,149 students)"]
        Val["15% Validation: 4,889 obs (4,318 students)"]
        Test["15% Holdout Test: 4,889 obs (4,318 students)"]
    end

    Raw_OULAD --> Temporal_Firewall
    Temporal_Firewall --> Feature_Horizons
    Feature_Horizons --> SG
    SG --> Train
    SG --> Val
    SG --> Test
```

### 1. Leakage-Safe Processing
- **Strict Cutoff**: All interaction events and assessment submissions occurring after Day 30 are quarantined prior to aggregation.
- **Unregistration Date Masking**: `date_unregistration` was excluded from feature matrices to prevent target leakage.
- **Exam Exclusion**: Final module examinations were removed from the predictor space.

### 2. Student-Level Partitioning
- Because **11.7%** of students re-enroll across modules, conventional random splitting risks placing records from the same student in both training and test sets.
- Student-grouped partitioning on `id_student` was applied, ensuring that no student appears in more than one partition.

---

## Explainable AI & SHAP Analysis

Using tree-based Shapley Additive exPlanations (`shap.TreeExplainer`), attributions were analyzed across the 29 raw predictors:

```text
Feature Family Attribution Summary (Manuscript Reported Values):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] Academic Milestones (Day <= 30)     : ██████████ 33.22%
[2] VLE Digital Engagement (Day <= 30)  : ██████████ 32.61%
[3] Static Intake and Context           : ███████████ 34.17%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Combined Dynamic Early Engagement       : 65.83% across 16 dynamic features
```

### Top Raw Predictors as Reported in the Manuscript:
1. `early_avg_score_d30`: Mean score across Day $\le 30$ graded assessment submissions.
2. `early_vle_active_days_d30`: Number of distinct days student logged into VLE by Day 30.
3. `early_vle_total_clicks_d30`: Total raw digital click interactions recorded by Day 30.
4. `has_early_assessment_submission_d30`: Indicator whether any assessment was submitted by Day 30.

### SHAP Pipeline Note
SHAP importance values in `shap_analysis.py` are stored constants; they are not recomputed by the pipeline. For empirical recomputation using `TreeExplainer` on the holdout test set with 100 stratified background observations, see [`src/shap_recompute.py`](src/shap_recompute.py) and [`oulad_student_prediction/results/tables/shap_recomputed.csv`](oulad_student_prediction/results/tables/shap_recomputed.csv).

---

## Descriptive Subgroup Performance Analysis

Descriptive evaluation across demographic and socioeconomic strata under the frozen validation threshold ($\theta^* = 0.45$) on the holdout evaluation partition (exact copy of manuscript Table VI):

| Attribute | Stratum | Recall ($\theta^* = 0.45$) | FPR |
| :--- | :--- | :---: | :---: |
| **Gender** | Female | 81.79% | — |
| | Male | 82.85% | — |
| **Disability** | No Declared Disability | 82.26% | 30.55% |
| | Declared Disability | 83.33% | 39.25% |
| **Prior Attainment** | Lower Than A Level | 84.13% | — |
| | Higher Education | 78.87% | — |
| **Socioeconomic (IMD)** | Most Deprived | 84.23% | — |
| | Least Deprived | 80.28% | — |

> **Ethical & Methodological Caveat**: Subgroup results are descriptive and are not fairness conclusions. These values do not imply that the model is fair. A dash (—) indicates the metric was not reported in the manuscript text.

---

## Limitations

1. **Single-Institution Scope**: OULAD is derived entirely from The Open University (UK), an open-admission distance-learning provider. Findings cannot be generalized to campus-based higher education institutions without external validation.
2. **Observational & Non-Causal**: Predictive attributions reflect statistical associations in historical log data. They do not demonstrate causal mechanisms; mandating synthetic VLE logins will not cause academic success.
3. **Threshold Contextuality**: The operational threshold $\theta^* = 0.45$ was calibrated to satisfy $\text{Recall} \ge 0.82$ and $\text{Precision} \ge 0.70$ on the validation partition. Optimal institutional cutoffs depend directly on local advising capacity and caseload constraints.
4. **Subgroup Disparities**: False positive rates vary across student strata (e.g., 39.25% for declared disability vs. 30.55% for no declared disability).

---

## Repository Structure & Replication

### 1. Environment Setup
```bash
python -m venv .venv
# Linux/macOS:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

pip install -r requirements.txt
```

### 2. Dataset Setup
Download the Open University Learning Analytics Dataset (OULAD):
- Source: [https://analyse.kmi.open.ac.uk/open_dataset](https://analyse.kmi.open.ac.uk/open_dataset)
- Extract the 7 CSV files into `oulad_student_prediction/data/raw/`:
  - `courses.csv`, `assessments.csv`, `vle.csv`, `studentInfo.csv`, `studentRegistration.csv`, `studentAssessment.csv`, `studentVle.csv`

### 3. Pipeline Scripts
- `python oulad_student_prediction/src/run_master_pipeline.py`: Runs master data processing, cross-validation, and holdout evaluation.
- `python src/shap_recompute.py`: Computes SHAP attributions with `TreeExplainer` on the holdout test set using 100 stratified background samples.
- `python src/sensitivity_day30_active.py`: Evaluates sensitivity of early-warning predictions for students actively registered at Day 30 vs. full holdout.

---

## License & Citation

- **Code**: Distributed under the [MIT License](LICENSE).
- **Dataset**: OULAD is provided under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) by Kuzilek, Hlosta, and Zdrahal (2017).

```bibtex
@misc{kumar_sharma_2026,
  author = {Kumar, Ugesh and Sharma, Riya},
  title = {Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)},
  year = {2026},
  note = {Manuscript}
}
```
