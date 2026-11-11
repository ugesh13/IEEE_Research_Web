# Reproducibility Guide & End-to-End Execution Protocol

**Project**: Student Performance Prediction Using Machine Learning and Explainable AI: An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)  
**Primary Analytical Unit**: `(code_module, code_presentation, id_student)`  
**Prediction Target**: Binary classification (`is_at_risk`: 1 = Fail + Withdrawn, 0 = Pass + Distinction)  
**Frozen Model**: `HistGradientBoostingClassifier` on Scenario $S_2$ (Day $\le$ 30 Cutoff)  
**Operational Decision Threshold**: $\theta^* = 0.45$  

---

## 1. System Requirements & Recommended Environment

- **Operating System**: Linux (Ubuntu 20.04/22.04), macOS (12+), or Windows 10/11
- **Python Version**: `>= 3.10`, `< 3.12` (Python 3.10.12 tested and verified)
- **Virtual Environment**: Strongly recommended using `venv` or `conda`

### Environment Setup Commands:
```bash
# Using standard venv:
python -m venv venv
# Linux / macOS:
source venv/bin/activate
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Upgrade pip and install pinned dependencies:
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 2. Repository Directory Structure

```text
Anitgravity-Research-Paper/
├── README.md
├── requirements.txt
├── REPRODUCIBILITY.md
└── oulad_student_prediction/
    ├── requirements.txt
    ├── data/
    │   ├── raw/                           <-- Place 7 original OULAD CSV files here
    │   │   ├── courses.csv
    │   │   ├── assessments.csv
    │   │   ├── vle.csv
    │   │   ├── studentInfo.csv
    │   │   ├── studentRegistration.csv
    │   │   ├── studentAssessment.csv
    │   │   └── studentVle.csv
    │   └── processed/                     <-- Generated scenario datasets (S0, S1, S2)
    ├── models/
    │   └── s2_hgb_frozen_model.joblib     <-- Serialized frozen fitted estimator & pipeline
    ├── notebooks/
    │   ├── 01_dataset_understanding.ipynb
    │   ├── 04_exploratory_data_analysis.ipynb
    │   ├── 06_train_val_test_splitting.ipynb
    │   ├── 08_model_training.ipynb        <-- Fully executed demonstration notebook
    │   └── ...
    ├── results/
    │   ├── figures/                       <-- Generated SVG figures
    │   │   └── data/                      <-- Raw plotting coordinates and distributions
    │   ├── metrics/                       <-- Model metric JSON dumps
    │   ├── splits/                        <-- Student partition mapping (70/15/15)
    │   └── tables/                        <-- Audited markdown and CSV result tables
    └── src/
        ├── inspect_dataset.py             <-- Phase 1: Dataset profiling
        ├── data_integration.py            <-- Phase 4: Entity-relationship joins
        ├── feature_engineering.py         <-- Phase 6: Temporal scenario engineering (Day <= 30)
        ├── verify_temporal_integrity.py   <-- Phase 7: Leakage verification
        ├── data_splitting.py              <-- Phase 9: Student-grouped 70/15/15 partitioning
        ├── preprocessing.py               <-- Phase 10: ColumnTransformer & imputers
        ├── model_training.py              <-- Phase 11: 5-fold CV & validation evaluation
        ├── threshold_calibration.py       <-- Phase 12: Threshold sweep & test evaluation
        ├── shap_analysis.py               <-- Phase 13: Post-hoc SHAP explainability
        ├── fairness_subgroup_analysis.py  <-- Phase 14: Subgroup performance analysis
        └── robustness_sensitivity_analysis.py <-- Phase 15: Seed, threshold, class-weight robustness
```

---

## 3. Data Download & Placement

1. Download the Open University Learning Analytics Dataset (OULAD) from the official repository:
   - URL: https://analyse.kmi.open.ac.uk/open_dataset
2. Extract all seven CSV files directly into:
   ```text
   oulad_student_prediction/data/raw/
   ```
3. Verify row counts:
   - `studentInfo.csv`: 32,593 rows
   - `courses.csv`: 22 rows
   - `assessments.csv`: 206 rows
   - `studentRegistration.csv`: 32,593 rows
   - `studentAssessment.csv`: 173,912 rows
   - `vle.csv`: 6,364 rows
   - `studentVle.csv`: 10,655,280 rows

---

## 4. End-to-End Pipeline Execution

All commands should be executed from the `oulad_student_prediction/` directory.

### Step 1: Feature Engineering & Temporal Filtering (Phase 6)
Builds $S_0$ (Day $\le$ 0), $S_1$ (Day $\le$ 30), and $S_2$ (Day $\le$ 30) scenario feature sets. Strictly truncates assessments and VLE clicks at Day 30 and quarantines `date_unregistration`.
```bash
python src/feature_engineering.py
```
*Outputs: `data/processed/scenario_s0.csv`, `scenario_s1.csv`, `scenario_s2.csv`.*

### Step 2: Student-Grouped Partitioning (Phase 9)
Partitions unique students into 70% Train ($N=20,149$), 15% Validation ($N=4,318$), and 15% Holdout Test ($N=4,318$). Guarantees exact 0 student overlap.
```bash
python src/data_splitting.py
```
*Outputs: `results/splits/student_partition_assignment.csv` and Table XI.*

### Step 3: Leakage-Safe Preprocessing Verification (Phase 10)
Fits `ColumnTransformer` (median imputers, mode imputers, OneHotEncoders) strictly on training data and transforms validation/test partitions.
```bash
python src/preprocessing.py
```
*Outputs: Table XII and Table XIII.*

### Step 4: Model Training & 5-Fold Cross-Validation (Phase 11)
Executes 5-fold student-grouped CV on training data for Logistic Regression, Random Forest, and HistGradientBoosting across $S_0, S_1, S_2$. Evaluates reserved validation set and serializes the frozen model.
```bash
python src/model_training.py
```
*Outputs: `results/tables/Table_XIV_cv_results.csv`, `Table_XV_model_comparison.md`, `models/s2_hgb_frozen_model.joblib`, Figures 12, 13, 14.*

### Step 5: Threshold Optimization, Calibration & Final Test Evaluation (Phase 12)
Sweeps thresholds $\theta \in [0.10, 0.90]$ on validation probabilities. Selects $\theta^* = 0.45$ ($\text{Recall} \ge 0.82 \text{ and } \text{Precision} \ge 0.70$). Evaluates the locked holdout test set exactly once.
```bash
python src/threshold_calibration.py
```
*Outputs: Table XVII, Table XVIII, Table XIX, Figures 15, 16, 17.*

### Step 6: SHAP Explainability & Attribution (Phase 13)
Computes SHAP values using a 100-sample training background. Aggregates transformed importances to raw predictors and calculates feature family attribution.

> **SHAP Pipeline Note**: SHAP importance values in `shap_analysis.py` are stored constants; they are not recomputed by the pipeline. For empirical recomputation using `TreeExplainer` on the holdout test set with 100 stratified background observations, see `src/shap_recompute.py` and `results/tables/shap_recomputed.csv`.
```bash
python src/shap_analysis.py
```
*Outputs: Table XXI, Table XXII, Table XXIII, Figures 18, 19, 20, 21.*

### Step 7: Subgroup Fairness & Disparity Analysis (Phase 14)
Audits frozen model performance across gender, disability status, prior education, socioeconomic deprivation (IMD), and age brackets under the universal threshold $\theta^* = 0.45$.
```bash
python src/fairness_subgroup_analysis.py
```
*Outputs: Tables XXIV, XXV, XXVI, XXVII, Figures 22, 23, 24, 25.*

### Step 8: Statistical Robustness & Sensitivity Analysis (Phase 15)
Evaluates threshold sensitivity, 5-seed random partition stability, cluster bootstrap resampling, and class-weight variations.
```bash
python src/robustness_sensitivity_analysis.py
```
*Outputs: Tables XXVIII, XXIX, XXX, XXXI, XXXII, Figures 26, 27, 28.*

---

## 5. Demonstration Notebook Execution

The repository provides fully pre-executed demonstration notebooks in `notebooks/`:
- To interactively view or execute the model training pipeline:
  ```bash
  jupyter notebook notebooks/08_model_training.ipynb
  ```
- Select **Kernel -> Restart & Run All** to run all cells in sequence.

---

## 6. Authoritative Reference Results (Verification Baseline)

| Experimental Milestone | Authoritative Metric | Expected Value | Tolerance / Status |
| :--- | :--- | :---: | :---: |
| **Validation $S_2$ HGB ROC-AUC** | Discrimination on Validation | `0.8425` | $\pm 0.0010$ |
| **Validation $S_2$ HGB PR-AUC** | Average Precision | `0.8478` | $\pm 0.0015$ |
| **Operational Threshold ($\theta^*$)** | Constraint Rule Selection | `0.45` | Exact |
| **Test Accuracy ($\theta^* = 0.45$)** | Overall Classification Rate | `75.95%` | $[75.8\%, 76.1\%]$ |
| **Test At-Risk Recall ($\theta^* = 0.45$)**| Early Warning Sensitivity | `82.38%` | $[82.1\%, 82.6\%]$ |
| **Test At-Risk Precision ($\theta^* = 0.45$)**| Positive Predictive Value | `74.68%` | $[74.4\%, 74.9\%]$ |
| **Test At-Risk F1-Score** | Harmonic Mean | `0.7834` | $[0.781, 0.785]$ |
| **Test Specificity ($\theta^* = 0.45$)** | True Negative Rate | `68.75%` | $[68.4\%, 69.0\%]$ |
| **Test ROC-AUC** | Holdout Discrimination | `0.8406` | $[0.838, 0.842]$ |
| **Test PR-AUC** | Holdout Precision-Recall AUC | `0.8459` | $[0.843, 0.848]$ |
| **Test Brier Score** | Mean Squared Probability Error | `0.1638` | $[0.162, 0.165]$ |
| **Test Confusion Matrix ($\theta^* = 0.45$)** | TP / FN / TN / FP | `2,127 / 455 / 1,586 / 721` | Exact ($N=4,889$) |
| **Test Net TP Gain ($\theta^* = 0.45$ vs $0.50$)** | Additional Captured At-Risk Obs | `+46` | Exact ($2,127 - 2,081$) |
| **SHAP Academic + VLE Attribution** | Combined Early Engagement Share | `65.83%` | Exact Aggregation |
