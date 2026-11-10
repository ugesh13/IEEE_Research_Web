# Paper Corrections: Audit Findings and Required Revisions

This document lists all necessary corrections to the IEEE manuscript (`FINAL_MANUSCRIPT_TEXT.md` and the generated PDF/DOCX) based on the comprehensive audit of the code, real dataset outputs, and reproducibility testing.

---

## 1. Corrections Required Based on Detected Mismatches

| Location in Paper | Old Paper Text / Value | Corrected Value (from Real Run) | Rationale & Evidence |
| :--- | :--- | :--- | :--- |
| **Section XI-D (SHAP Attribution)** | "...operating on the native probability function $f(x) = P(\text{is\_at\_risk} = 1 \mid x)$..." | "...operating on the **log-odds (raw margin)** scale ($\log \frac{p}{1-p}$)..." | A sum of mean absolute SHAP attributions equal to $3.9196$ is mathematically impossible on a probability scale bounded in $[0, 1]$. TreeExplainer raw output computes additive contributions to the log-odds margin. |
| **Section XI-E, Table IV (Subgroup Sizes: Gender)** | Female: $n = 2,052$<br>Male: $n = 2,837$ | Female: **$n = 2,216$**<br>Male: **$n = 2,673$** | In `Table_XXV_subgroup_performance_metrics.md` and `Table_XXIV_subgroup_sample_sizes.md`, the actual test partition counts are $2,216$ (F) and $2,673$ (M), summing exactly to $4,889$. |
| **Section XI-E, Table IV (Subgroup Sizes: Disability)** | Declared Disability: $n = 503$<br>No Declared: $n = 4,386$ | Declared Disability: **$n = 474$**<br>No Declared: **$n = 4,415$** | Real test partition counts in `Table_XXIV` are $474$ (Y) and $4,415$ (N), summing exactly to $4,889$. |
| **Section XI-E, Table IV (Subgroup FPR: Gender)** | Female FPR: $30.23\%$<br>Male FPR: $32.03\%$ | Female FPR: **$29.78\%$** [$0.270, 0.325$]<br>Male FPR: **$32.53\%$** [$0.299, 0.352$] | Direct computation from the confusion matrices in `Table_XXV` ($318 / 1,068 = 29.78\%$ for Female; $403 / 1,239 = 32.53\%$ for Male). |
| **Section XI-E (Subgroup Sensitivity Discussion)** | "Subgroup sensitivity remains stable across protected cohorts ($\sim 81-83\%$)..." | "Subgroup sensitivity spans an empirical range of **$78.87\%$** (HE Qual) to **$85.88\%$** (2+ previous attempts)..." | Avoid smoothing or compressing the range; report the true min-max range across sufficiently powered strata ($n \ge 100$). |
| **Section XI-F (Robustness: Seed 42 Split)** | Train: $22,814$<br>Val: $4,890$<br>Test: $4,889$ | Train: **$22,815$**<br>Val: **$4,889$**<br>Test: **$4,889$** | The off-by-one difference was caused by a `.reset_index()` bug in `robustness_sensitivity_analysis.py`. Using the unified `partition_students()` resolves this. |
| **Section VI & Table XXXII (Feature Counts)** | $S_0 = 12$ raw, $S_1 = 20$ raw, $S_2 = 29$ raw | $S_0 = \mathbf{13}$ raw (52 transf.), $S_1 = \mathbf{21}$ raw (60 transf.), $S_2 = \mathbf{29}$ raw (68 transf.) | The actual raw feature vector in `feature_engineering.py` has 13 baseline intake features (including `module_presentation_length` and `date_registration_imputed_flag`) and 8 early assessment features. |

---

## 2. Methodological Corrections Required Independent of Results

1. **Random Forest Hyperparameters (Section VIII & Code)**:
   - *Issue*: Paper Section VIII specified `min_samples_leaf = 10`, while original code executed `min_samples_split = 5`.
   - *Correction*: The Random Forest parameter grid in `model_training.py` has been explicitly aligned to search `min_samples_leaf: [5, 10, 20]` and `max_depth: [10, 15, 20]`. Report whatever the search selects from this grid.

2. **Class-Weight Sensitivity False Alarm Count (Section XI-F & Table XXXI)**:
   - *Issue*: The manuscript text reported "157 additional false alarms" ($721 \rightarrow 878$), while earlier draft tables implied ~79.
   - *Correction*: Verified from the dynamic confusion matrices in `Table_XXXI_class_weight_sensitivity.md`:
     $$\text{FP}_{\text{balanced}} - \text{FP}_{\text{unweighted}} = 878 - 721 = \mathbf{157}$$
     The 157 figure is correct and mathematically verified. The table and text now agree.

3. **Hyperparameter Optimization Description (Section VIII & Abstract)**:
   - *Issue*: Code previously contained a static `BEST_HYPERPARAMS` dictionary rather than executing an actual grid search.
   - *Correction*: State in the manuscript that hyperparameters were optimized using a 5-fold student-grouped grid search (`GroupKFold` on `id_student`) exclusively on the training partition ($N = 22,815$). The search results are saved in `results/metrics/hyperparameter_search_results.csv`.

4. **Operational Threshold Rule Context (Section X & Table XVI)**:
   - *Issue*: Equation 12 presented the rule ($\text{Recall} \ge 0.82, \text{Precision} \ge 0.70$) without explaining how it was selected.
   - *Correction*: Explicitly state in Section X and Table XVI:
     > *"The operational rule $\theta^* = \max\{\theta : \text{Recall}(\theta) \ge 0.82 \text{ and } \text{Precision}(\theta) \ge 0.70\}$ was formulated after inspecting the validation performance sweep across $\theta \in [0.10, 0.90]$. For direct comparison, the statistical Max-$F_1$ threshold is reported alongside it ($\theta_{\text{Max-}F_1} = 0.40$). The operational threshold was frozen prior to test set evaluation."*

5. **SHAP Background and Feature Count Precision (Section XI-D & Table III)**:
   - *Correction*: Explicitly state:
     - Background: 100-sample **stratified** background drawn from the training partition (not random).
     - Scale: **Log-odds (raw margin)**.
     - Constituent levels: 29 raw features mapping to 68 transformed columns, where `imd_band` accounts for 11 one-hot columns (10 deprivation deciles + 1 missing/not applicable level).

6. **Confidence Interval Estimation Methodology (Section IX, Table I, Table IV, Table XVIII)**:
   - *Issue*: Table notes previously stated "observation-level bootstrap".
   - *Correction*: Unify all documentation on **student-level cluster bootstrap** ($B = 1,000$ resamples) to properly reflect the cluster dependence induced by repeat student enrollments ($4,318$ unique students across $4,889$ observations).

7. **Tone and Overfitting Rhetoric (Abstract, Section XI-C, Table XVIII)**:
   - *Correction*: Remove all "zero overfitting" rhetoric. Replace with honest, rigorous scientific characterization: "negligible out-of-sample divergence between validation ROC-AUC ($0.8425$) and holdout test ROC-AUC ($0.8406$)".
   - *Attrition claim*: Softened intro claim regarding student non-completion in distance education models.
