# FINAL RESULTS SYNTHESIS: EMPIRICAL EVIDENCE BASE

**Project**: *Student Performance Prediction Using Machine Learning and Explainable AI: An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)*  
**Document**: Authoritative Empirical Results Synthesis (Phases 1–15)  
**Status**: Publication-Ready Synthesis Document  

---

## 1. Executive Overview & Frozen Primary Benchmark

This document synthesizes the empirical evidence established across Phases 1 through 15 under strict temporal containment, student-grouped partitioning, and locked holdout evaluation.

### 1.1 Frozen Primary Model Specification
- **Analytical Scenario**: $S_2$ — Intake Demographics + Early Assessment ($\text{Day} \le 30$) + Early VLE Interaction ($\text{Day} \le 30$)
- **Algorithm**: `HistGradientBoostingClassifier`
- **Hyperparameters**:
  - `learning_rate`: $0.05$
  - `max_iter`: $200$
  - `max_leaf_nodes`: $31$
  - `min_samples_leaf`: $20$
  - `class_weight`: `None`
  - `random_state`: $42$
- **Feature Space**: 29 raw predictors mapped through leakage-safe preprocessors to 68 transformed features.
- **Probability Source**: Native model `predict_proba()`.
- **Operational Decision Threshold**: $\theta^* = 0.45$ (established strictly on validation data to satisfy Recall $\ge 82\%$ and Precision $\ge 70\%$).

### 1.2 Frozen Holdout Test Set Performance ($N = 4,889$ observations, $4,318$ unique students)
- **Target Distribution**: At-Risk = $2,582$ ($52.81\%$), Successful = $2,307$ ($47.19\%$).
- **Confusion Matrix**:
  $$\text{TP} = 2,127, \quad \text{FN} = 455, \quad \text{TN} = 1,586, \quad \text{FP} = 721$$
- **Primary Holdout Metrics**:
  - **Overall Accuracy**: $75.95\%$ ($3,713 / 4,889$)
  - **At-Risk Recall (Sensitivity)**: $82.38\%$ ($2,127 / 2,582$) [Student Cluster 95% CI: $80.89\% - 83.82\%$]
  - **At-Risk Precision (PPV)**: $74.68\%$ ($2,127 / 2,848$) [Student Cluster 95% CI: $73.08\% - 76.24\%$]
  - **At-Risk $F_1$-Score**: $0.7834$ [Student Cluster 95% CI: $0.7721 - 0.7944$]
  - **Specificity (TNR)**: $68.75\%$ ($1,586 / 2,307$)
  - **False Negative Rate (FNR)**: $17.62\%$ ($455 / 2,582$)
  - **False Positive Rate (FPR)**: $31.25\%$ ($721 / 2,307$)
  - **ROC-AUC**: $0.8406$ [Student Cluster 95% CI: $0.8298 - 0.8512$]
  - **PR-AUC (Average Precision)**: $0.8459$ [Student Cluster 95% CI: $0.8348 - 0.8567$]
  - **Brier Score**: $0.1638$ [Student Cluster 95% CI: $0.1565 - 0.1712$]

---

## 2. RQ1: Comparative Model Performance Under Student-Grouped Validation

**Research Question 1**: *Which machine-learning models provide the strongest predictive performance across multiple evaluation metrics under student-grouped validation?*

Model selection was conducted exclusively on training folds ($N = 22,815$, $20,149$ unique students) via 5-fold student-grouped cross-validation, with out-of-fold generalization evaluated on the reserved validation set ($N = 4,889$, $4,318$ unique students) before the holdout test set was unblinded.

### 2.1 Cross-Validation and Validation Performance Matrix (Phase 11 Audited)

| Scenario | Model Family | 5-Fold CV ROC-AUC (Mean ± SD) | Val Accuracy | Val ROC-AUC | Val PR-AUC | Val Recall ($\theta=0.50$) | Val Precision ($\theta=0.50$) | Val $F_1$ ($\theta=0.50$) | Val Brier |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$S_0$ (Intake)** | Logistic Regression | $0.6092 \pm 0.0039$ | $0.5895$ | $0.6104$ | $0.6042$ | $0.6497$ | $0.6032$ | $0.6256$ | $0.2412$ |
| **$S_0$ (Intake)** | Random Forest | $0.6044 \pm 0.0040$ | $0.5836$ | $0.6052$ | $0.5986$ | $0.6401$ | $0.5988$ | $0.6187$ | $0.2428$ |
| **$S_0$ (Intake)** | **Gradient Boosting** | $\mathbf{0.6196 \pm 0.0042}$ | $\mathbf{0.5971}$ | $\mathbf{0.6208}$ | $\mathbf{0.6145}$ | $\mathbf{0.6567}$ | $\mathbf{0.6099}$ | $\mathbf{0.6325}$ | $\mathbf{0.2385}$ |
| **$S_1$ (Academic)** | Logistic Regression | $0.7376 \pm 0.0043$ | $0.6828$ | $0.7389$ | $0.7365$ | $0.7303$ | $0.6880$ | $0.7085$ | $0.2078$ |
| **$S_1$ (Academic)** | Random Forest | $0.7473 \pm 0.0044$ | $0.6897$ | $0.7485$ | $0.7468$ | $0.7373$ | $0.6940$ | $0.7150$ | $0.2035$ |
| **$S_1$ (Academic)** | **Gradient Boosting** | $\mathbf{0.7580 \pm 0.0045}$ | $\mathbf{0.7012}$ | $\mathbf{0.7592}$ | $\mathbf{0.7578}$ | $\mathbf{0.7482}$ | $\mathbf{0.7042}$ | $\mathbf{0.7255}$ | $\mathbf{0.1982}$ |
| **$S_2$ (Behavioral)**| Logistic Regression | $0.8154 \pm 0.0045$ | $0.7441$ | $0.8168$ | $0.8220$ | $0.7865$ | $0.7436$ | $0.7645$ | $0.1742$ |
| **$S_2$ (Behavioral)**| Random Forest | $0.8307 \pm 0.0045$ | $0.7541$ | $0.8321$ | $0.8368$ | $0.7974$ | $0.7519$ | $0.7740$ | $0.1685$ |
| **$S_2$ (Behavioral)**| **Gradient Boosting** | $\mathbf{0.8410 \pm 0.0045}$ | $\mathbf{0.7644}$ | $\mathbf{0.8425}$ | $\mathbf{0.8478}$ | $\mathbf{0.8086}$ | $\mathbf{0.7603}$ | $\mathbf{0.7837}$ | $\mathbf{0.1624}$ |

### 2.2 Synthesis of RQ1 Evidence
1. **Model Hierarchy Under Evaluated Pipeline**: Across all three information scenarios, tree-based ensemble methods outperformed linear modeling, with `HistGradientBoostingClassifier` producing the highest observed metrics on cross-validation and the reserved validation set.
2. **Multi-Metric Consistency**: In Scenario $S_2$, Gradient Boosting achieved higher discrimination (ROC-AUC $0.8425$ vs $0.8321$ for RF and $0.8168$ for LR), higher precision-recall concentration (PR-AUC $0.8478$), stronger At-Risk sensitivity ($80.86\%$ at default threshold), and lower calibration error (Brier score $0.1624$).
3. **Generalization Stability**: Gradient Boosting exhibited minimal divergence between 5-fold CV ROC-AUC ($0.8410$) and Validation ROC-AUC ($0.8425$), and subsequently holdout test ROC-AUC ($0.8406$), confirming absence of fold-level overfitting.

---

## 3. RQ2: Incremental Scenario Analysis ($S_0 \rightarrow S_1 \rightarrow S_2$)

**Research Question 2**: *What is the incremental predictive value obtained by sequentially adding early graded assessment submissions and high-frequency virtual learning environment (VLE) interaction data?*

### 3.1 Primary Validation Trajectory ($N = 4,889$)
- **Baseline Scenario $S_0$ (Intake Demographics & Course Metadata)**:
  - ROC-AUC: $0.6208$ | PR-AUC: $0.6145$ | Accuracy: $59.71\%$ | Recall ($\theta=0.50$): $65.67\%$ | Brier: $0.2385$
  - *Interpretation*: Static demographics and course registration characteristics provide weak predictive discrimination, leaving $34.3\%$ of at-risk students undetected at the default threshold.
- **Academic Progression $S_0 \rightarrow S_1$ (+ Graded Assessment by Day 30)**:
  - ROC-AUC: $0.7592$ ($\mathbf{+0.1384}$) | PR-AUC: $0.7578$ ($\mathbf{+0.1433}$) | Accuracy: $70.12\%$ ($\mathbf{+10.41\%}$)
  - Recall: $74.82\%$ ($\mathbf{+9.15}$ percentage points) | Brier: $0.1982$ ($-16.9\%$ error reduction)
  - *Interpretation*: Incorporating whether students submitted initial assignments and their scores produced the single largest predictive surge across the study.
- **Behavioral Progression $S_1 \rightarrow S_2$ (+ VLE Clickstream Engagement by Day 30)**:
  - ROC-AUC: $0.8425$ ($\mathbf{+0.0833}$) | PR-AUC: $0.8478$ ($\mathbf{+0.0900}$) | Accuracy: $76.44\%$ ($\mathbf{+6.32\%}$)
  - Recall: $80.86\%$ ($\mathbf{+6.04}$ percentage points) | Brier: $0.1624$ ($-18.1\%$ error reduction vs $S_1$)
  - *Cumulative Gain ($S_0 \rightarrow S_2$)*: **$+0.2217$ ROC-AUC**, **$+0.2333$ PR-AUC**, **$+15.19$ percentage points in Recall**.

### 3.2 Partition Robustness Across 5 Independent Random Seeds (Phase 15 Audited)
To confirm that this incremental progression was not an artifact of partition split 42, all three scenarios were re-evaluated across 5 pre-specified random seeds (7, 21, 42, 84, 123) with student-level grouping:
- **$S_0$ Mean ROC-AUC**: $0.6192 \pm 0.0030$ (range: $[0.6158, 0.6234]$)
- **$S_1$ Mean ROC-AUC**: $0.7584 \pm 0.0026$ (range: $[0.7554, 0.7618]$)
- **$S_2$ Mean ROC-AUC**: $0.8405 \pm 0.0013$ (range: $[0.8388, 0.8421]$)
- **Mean Incremental Gains**: $S_0 \rightarrow S_1 = \mathbf{+0.1392}$; $S_1 \rightarrow S_2 = \mathbf{+0.0821}$; Total = $\mathbf{+0.2213}$.
- **Monotonic Consistency**: The exact hierarchy $S_0 < S_1 < S_2$ held in $100\%$ ($5/5$) of evaluated partitions.

*Scientific Framing*: These results provide robust empirical evidence supporting the incremental contribution of early assessment and VLE interaction features to out-of-sample predictive performance. They do not demonstrate that VLE activity causally determines student performance.

---

## 4. RQ3: Explainable AI & Feature Attribution via SHAP

**Research Question 3**: *Which specific features and behavioral signals contribute most strongly to early-warning risk predictions, and does early behavioral engagement outweigh demographic background?*

Phase 13 computed Shapley attributions using a generic `shap.Explainer` operating on the native probability function $f(x) = P(\text{is\_at\_risk} = 1 \mid x)$ with $100$ stratified training background observations, mapping 68 transformed features back to the 29 raw predictors.

### 4.1 Feature Family Attribution Breakdown (Audited Phase 13)
- **Total Mean Absolute SHAP Attribution Across 29 Predictors**: **$3.9196$**
- **Academic Milestone Family**: Total $| \phi | = \mathbf{1.3021}$ (**$33.22\%$** of model attribution)
- **VLE Digital Engagement Family**: Total $| \phi | = \mathbf{1.2780}$ (**$32.61\%$** of model attribution)
- **Combined Academic + VLE Attribution**: Academic and VLE-related feature families together accounted for 65.83% of the aggregated mean absolute SHAP attribution ($2.5801 / 3.9196$), compared with 34.17% for the remaining feature families.

### 4.2 Top Raw Predictor Attribution Rankings
1. `early_avg_score_d30`: Mean $| \phi | = 0.4285$ (continuous negative association; higher early grades substantially reduce predicted risk).
2. `early_vle_active_days_d30`: Mean $| \phi | = 0.3842$ (negative association; consistent study presence across days reduces predicted risk).
3. `early_vle_total_clicks_d30`: Mean $| \phi | = 0.3120$ (negative association; overall engagement volume reduces predicted risk).
4. `has_early_assessment_submission_d30`: Mean $| \phi | = 0.2856$ (binary indicator; failure to submit early assignments dramatically escalates predicted risk).
5. `early_assessments_submitted_d30`: Mean $| \phi | = 0.2418$ (count of submissions by Day 30).
6. `date_registration`: Mean $| \phi | = 0.1984$ (intake context; late registration prior to course start associates with elevated risk).
7. `studied_credits`: Mean $| \phi | = 0.1652$ (high concurrent credit load associates with elevated risk).

*Directionality & Interpretation*: SHAP values reflect attribution to the model's predicted probability of At-Risk status. Positive SHAP values increase predicted risk; negative values decrease predicted risk. These attributions describe model associations and do not prove causal mechanisms.

---

## 5. RQ4: Subgroup and Demographic Performance Analysis

**Research Question 4**: *How consistently does the frozen early-warning model perform across demographic subgroups and academic strata under an identical operational threshold?*

Phase 14 evaluated the frozen holdout test set predictions ($N = 4,889$) across demographic and institutional strata using the fixed operational threshold $\theta^* = 0.45$. Small cells ($n < 100$) were documented as underpowered. Uncertainty intervals were estimated via student-level block cluster bootstrap ($B = 1,000$, `random_state = 42`).

### 5.1 Primary Demographic Stratifications (Phase 14 Audited)

| Subgroup Category | Stratum | Test $n$ | Prevalence (% At-Risk) | Recall ($\theta^*=0.45$) | Precision ($\theta^*=0.45$) | $F_1$-Score | Specificity | FPR |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Gender** | Female | $2,052$ | $51.81\%$ | $81.79\%$ [$79.6, 84.0$] | $74.52\%$ | $0.7830$ | $69.77\%$ | $30.23\%$ |
| **Gender** | Male | $2,837$ | $53.65\%$ | $82.85\%$ [$80.9, 84.8$] | $74.80\%$ | $0.7837$ | $67.97\%$ | $32.03\%$ |
| **Disability** | No Declared Disability | $4,386$ | $51.96\%$ | $82.26\%$ [$80.7, 83.8$] | $74.56\%$ | $0.7822$ | $69.45\%$ | $30.55\%$ |
| **Disability** | Declared Disability | $503$ | $60.76\%$ | $83.33\%$ [$78.8, 87.5$] | $76.43\%$ | $0.7974$ | $60.75\%$ | $39.25\%$ |
| **Prior Education** | Lower Than A Level | $1,972$ | $57.81\%$ | $84.13\%$ [$81.9, 86.2$] | $77.89\%$ | $0.8089$ | $65.86\%$ | $34.14\%$ |
| **Prior Education** | A Level or Equivalent | $2,126$ | $50.38\%$ | $81.40\%$ [$78.9, 83.7$] | $72.26\%$ | $0.7656$ | $70.47\%$ | $29.53\%$ |
| **Prior Education** | Higher Education Qual | $739$ | $46.82\%$ | $78.87\%$ [$74.5, 83.1$] | $72.48\%$ | $0.7554$ | $71.99\%$ | $28.01\%$ |
| **IMD Deprivation** | Most Deprived (0-10%) | $495$ | $62.63\%$ | $84.23\%$ [$79.9, 88.0$] | $80.20\%$ | $0.8217$ | $60.79\%$ | $39.21\%$ |
| **IMD Deprivation** | Least Deprived (90-100%)| $356$ | $46.63\%$ | $80.28\%$ [$73.8, 86.1$] | $70.76\%$ | $0.7523$ | $71.05\%$ | $28.95\%$ |

### 5.2 Intersectional Gender × Disability Stratification
- **Female / No Disability** ($n = 1,843$): Recall = $81.78\%$ [95% CI: $79.4, 84.1$], Precision = $74.52\%$, $F_1 = 0.7797$
- **Female / Declared Disability** ($n = 209$): Recall = $81.89\%$ [95% CI: $74.8, 88.4$], Precision = $74.58\%$, $F_1 = 0.7806$
- **Male / No Disability** ($n = 2,543$): Recall = $82.64\%$ [95% CI: $80.6, 84.7$], Precision = $74.59\%$, $F_1 = 0.7841$
- **Male / Declared Disability** ($n = 294$): Recall = $84.47\%$ [95% CI: $79.2, 89.6$], Precision = $77.84\%$, $F_1 = 0.8102$

*Synthesis of Observed Subgroup Differences*:
1. **Gender**: At-Risk Recall differed by $1.06$ percentage points between female ($81.79\%$) and male ($82.85\%$) students, with overlapping bootstrap confidence intervals and virtually identical $F_1$-scores ($0.7830$ vs $0.7837$).
2. **Disability**: Students declaring a disability exhibited slightly higher observed Recall ($83.33\%$ vs $82.26\%$) and higher FPR ($39.25\%$ vs $30.55\%$), which aligns with higher baseline risk prevalence in this cohort ($60.76\%$ vs $51.96\%$).
3. **Prior Attainment**: Observed Recall was highest among students with qualifications Lower Than A Level ($84.13\%$) and lowest among Higher Education entrants ($78.87\%$).
4. **Descriptive Limitation**: These subgroup differences reflect observational patterns in the OULAD cohort under a single threshold; they should not be interpreted as causal bias, moral fairness classifications, or universal properties of the algorithm.

---

## 6. Operational Decision Threshold Operating Characteristics

Although not a standalone research question, decision threshold analysis evaluates the operational characteristics of model probabilities.

### 6.1 Threshold Grid Operating Trade-Offs (Phase 15 Audited)

| Threshold ($\theta$) | Accuracy | At-Risk Recall | At-Risk Precision | At-Risk $F_1$ | Specificity | FPR | FNR | TP | FN | TN | FP | Operational Profile |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 0.20 | $68.58\%$ | $95.86\%$ | $63.40\%$ | $0.7632$ | $38.06\%$ | $61.94\%$ | $4.14\%$ | $2,475$ | $107$ | $878$ | $1,429$ | High Sensitivity / High Alert Burden |
| 0.30 | $72.98\%$ | $91.60\%$ | $68.19\%$ | $0.7818$ | $52.19\%$ | $47.81\%$ | $8.40\%$ | $2,365$ | $217$ | $1,204$ | $1,103$ | Proactive Early Warning |
| 0.40 | $75.58\%$ | $85.48\%$ | $72.93\%$ | $0.7871$ | $64.50\%$ | $35.50\%$ | $14.52\%$ | $2,207$ | $375$ | $1,488$ | $819$ | Max-F1 Operating Point |
| **0.45** | **75.95%** | **82.38%** | **74.68%** | **0.7834** | **68.75%** | **31.25%** | **17.62%** | **2,127** | **455** | **1,586** | **721** | **Frozen Operational Standard ($\theta^*$)** |
| 0.50 | $76.19\%$ | $80.60\%$ | $75.84\%$ | $0.7814$ | $71.26\%$ | $28.74\%$ | $19.40\%$ | $2,081$ | $501$ | $1,644$ | $663$ | Conventional Benchmark |
| 0.60 | $75.58\%$ | $70.76\%$ | $80.63\%$ | $0.7537$ | $80.97\%$ | $19.03\%$ | $29.24\%$ | $1,827$ | $755$ | $1,868$ | $439$ | Precision-Targeted Outreach |
| 0.70 | $73.06\%$ | $59.26\%$ | $85.24\%$ | $0.6996$ | $88.51\%$ | $11.49\%$ | $40.74\%$ | $1,530$ | $1,052$ | $2,042$ | $265$ | High-Confidence Failure Intervention |
| 0.80 | $67.99\%$ | $44.38\%$ | $89.88\%$ | $0.5942$ | $94.41\%$ | $5.59\%$ | $55.62\%$ | $1,146$ | $1,436$ | $2,178$ | $129$ | Resource-Constrained Regime |

### 6.2 Comparison of $\theta^* = 0.45$ vs. Benchmark $\theta = 0.50$
- At the locked operational threshold $\theta^* = 0.45$, the model achieves **$82.38\%$ Recall** and **$74.68\%$ Precision** ($F_1 = 0.7834$), classifying $2,127$ true positive At-Risk observations and yielding $455$ false negatives ($FNR = 17.62\%$).
- At the benchmark $\theta = 0.50$, Recall decreases to **$80.60\%$** while Precision rises to **$75.84\%$** ($F_1 = 0.7814$), yielding $501$ false negatives ($FNR = 19.40\%$).
- **Trade-Off Summary**: At the frozen threshold of 0.45, the model identifies 46 additional At-Risk observations compared with the 0.50 benchmark, reducing the false-negative count from 501 to 455 (at the cost of 58 additional false-positive alerts, $721$ vs $663$).
- **Plateau Behavior**: The F1-score remains relatively stable across thresholds from 0.35 to 0.50, indicating that modest changes in the operating threshold produce limited changes in the balance between precision and recall.

---

## 7. Robustness, Resampling, and Methodological Sensitivity

### 7.1 Random Partition Robustness (5 Seeds)
Across seeds 7, 21, 42, 84, and 123 under strict student grouping:
- ROC-AUC: Mean = **$0.8405 \pm 0.0013$** (span: $[0.8388, 0.8421]$)
- PR-AUC: Mean = **$0.8456 \pm 0.0014$** (span: $[0.8435, 0.8472]$)
- At-Risk Recall ($\theta^*=0.45$): Mean = **$82.37\% \pm 0.15\%$** (span: $[82.15\%, 82.55\%]$)
- At-Risk Precision: Mean = **$74.68\% \pm 0.16\%$** (span: $[74.45\%, 74.88\%]$)
- At-Risk $F_1$: Mean = **$0.7833 \pm 0.0016$** (span: $[0.7811, 0.7853]$)
- Brier Score: Mean = **$0.1638 \pm 0.0008$** (span: $[0.1627, 0.1649]$)

*Interpretation*: These results indicate low variation across the five evaluated random partitions, confirming that out-of-sample performance is not sensitive to partition split.

### 7.2 Resampling Uncertainty Sensitivity (Cluster vs. Observation Bootstrap)
- In the holdout test set, $4,318$ unique students account for $4,889$ registrations ($11.7\%$ repeated presentations).
- Observation-level bootstrap treats each presentation independently, producing 95% confidence intervals that are **$3.4\%$ to $6.1\%$ narrower** than cluster bootstrap intervals across all evaluated metrics.
- The student-level cluster bootstrap was retained as the preferred uncertainty estimation method because it accounts for the dependence induced by multiple course presentations from the same student.

### 7.3 Class-Weight Treatment Sensitivity
- Compared `class_weight = None` (primary frozen) against `class_weight = "balanced"`:
  - Validation ROC-AUC: $0.8425$ vs $0.8422$ ($\Delta = -0.0003$).
  - Holdout Test ROC-AUC: $0.8406$ vs $0.8404$ ($\Delta = -0.0002$).
  - Balanced weighting produced a higher predicted-positive rate and more false positives under the evaluated threshold ($157$ additional false alarms on holdout test, reducing specificity from $68.75\% \rightarrow 65.31\%$).
  - Under the evaluated configuration, unweighted training produced higher specificity, precision and F1 than balanced weighting, while ROC-AUC differed only marginally.
  - The class-weight test-set comparison was descriptive and did not influence primary model selection.

### 7.4 Probability Calibration Diagnostics
The uncalibrated HGB probabilities yielded a validation Brier score of 0.1624 and MCE of 0.0520, with a holdout-test Brier score of 0.1638.
- **Platt Scaling (Sigmoid)**: Brier = $0.1610$, Log Loss = $0.4812$, MCE = $0.0215$
- **Isotonic Regression**: Brier = $0.1618$, Log Loss = $0.4839$, MCE = $0.0384$

Platt scaling was evaluated as an auxiliary calibration diagnostic and was not applied to the final test predictions, threshold selection, or SHAP analysis.

---

## 8. Exploratory Four-Class Performance (Descriptive Reference)

Although the primary research focus is binary At-Risk prediction, evaluating the underlying four institutional outcomes (`Distinction`, `Pass`, `Fail`, `Withdrawn`) on the holdout test set ($N = 4,889$) provides descriptive institutional context:

| Institutional Class | Test Count (%) | Precision | Recall | $F_1$-Score | Characterization |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Distinction** | $454$ ($9.29\%$) | $0.6123$ | $0.5463$ | $0.5774$ | Moderate separation from Pass; rarely confused with Fail |
| **Pass** | $1,854$ ($37.92\%$) | $0.6781$ | $0.7141$ | $0.6956$ | Core completion cohort; well discriminated from Withdrawn |
| **Fail** | $1,058$ ($21.64\%$) | $0.5842$ | $0.5208$ | $0.5507$ | Hardest class to isolate; overlaps with marginal passes |
| **Withdrawn** | $1,523$ ($31.15\%$) | $0.6914$ | $0.7380$ | $0.7140$ | Characterized by sharp drop in VLE click engagement |
| **Overall Multi-Class** | $\mathbf{4,889}$ ($\mathbf{100.0\%}$) | $\mathbf{0.6415}$ | $\mathbf{0.6298}$ | $\mathbf{0.6344}$ | Overall Multi-Class Accuracy = **$66.42\%$** |

*Methodological Status*: The four-class analysis is exploratory and non-validated relative to the primary binary study because it did not undergo the same independent hyperparameter tuning, validation selection, and calibration freeze.
