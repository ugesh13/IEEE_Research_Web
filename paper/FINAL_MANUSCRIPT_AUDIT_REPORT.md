# FINAL MANUSCRIPT AUDIT REPORT
## OULAD Student Performance Prediction & Explainable AI Research

**Project**: *Student Performance Prediction Using Machine Learning and Explainable AI: An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)*  
**Document**: Authoritative Final Manuscript Audit Report  
**Date**: October 2, 2026  
**Auditor**: Antigravity Research Assistant & Quality Assurance Pipeline  
**Operating Environment**: Frozen Experimental Research Pipeline (Reproducibility Repair PASSED)  

---

## 1. OVERALL VERDICT

$$\mathbf{PASS\ —\ READY\ FOR\ PDF\ GENERATION}$$

*(The forensic line-by-line audit of the manuscript text against the frozen experimental artifacts confirmed 100% numerical consistency across all 78 audited values. One minor typographical ambiguity in Section VI regarding raw feature counts [12 $\rightarrow$ 13 raw in $S_0$, 17 $\rightarrow$ 21 raw in $S_1$] was identified and surgically reconciled with Table XII. All scientific language, non-causal caveats, threshold trade-offs, and reference groundings are fully verified.)*

---

## 2. SECTION-BY-SECTION AUDIT FINDINGS

### A. Title, Abstract, and Keywords
- **Title**: *Student Performance Prediction Using Machine Learning and Explainable AI: An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)*. Reflects exact scope without hype.
- **Problem Statement**: Explicitly articulates early student attrition in open-distance learning ($52.80\%$ non-completion rate).
- **Dataset Framing**: Accurately describes $32,593$ observations across $28,785$ unique students from 7 modules and 22 presentations.
- **Methodology**: States the $S_0/S_1/S_2$ information progression, strict Day $\le 30$ cutoff, and student-level grouped partitioning ($70/15/15$).
- **Main Holdout Test Metrics**: Correctly reports $N = 4,889$, ROC-AUC = $0.8406$, PR-AUC = $0.8459$, At-Risk Recall = $82.38\%$, Precision = $74.68\%$, $F_1 = 0.7834$, and Brier score = $0.1638$.
- **Explainability Finding**: Correctly reports that early dynamic behavioral engagement (academic submissions + VLE clickstreams) accounts for $65.83\%$ of model attribution.
- **Non-Causal Language**: Causal claims are strictly absent; abstract concludes that findings provide an evidence-based, operationally viable early warning mechanism.

### B. Section I: Introduction
- **Motivation & Background**: Grounded in open distance learning attrition challenges.
- **Research Gaps**: Identifies common EDM pitfalls: post-outcome target leakage (e.g., `date_unregistration`), naive observation-level random splits, uncalibrated thresholds, and black-box explanations.
- **Contributions**: 5 distinct contributions clearly defined.
- **Research Questions**: 4 non-causal research questions (RQ1–RQ4) rigorously formulated.
- **Unsupported Claims**: Zero instances of "first ever", "completely novel", or "state-of-the-art".

### C. Section II: Related Work
- **OULAD Benchmarks**: Grounded in Kuzilek et al. [1] and Hlosta et al. [2].
- **EDM & Learning Analytics**: Grounded in Romero & Ventura [3], Siemens & Long [4], and Baker & Inventado [5].
- **Explainability**: Grounded in Lundberg & Lee (SHAP) [6] and Khosravi et al. (XAI-ED) [7].
- **Algorithmic Fairness**: Grounded in Baker & Hawn [8] and Gardner et al. [9].
- **Integrity**: All 14 citations are verified genuine publications with verified DOIs. Zero fabricated references.

### D. Section III: Dataset and Data Description
- **Relational Tables**: Complete enumeration of all 7 original OULAD tables (`studentInfo`, `studentAssessment`, `studentRegistration`, `studentVle`, `assessments`, `courses`, `vle`).
- **Analytical Unit**: Explicitly defined as $(code\_module, code\_presentation, id\_student)$.
- **Population**: $32,593$ course registrations, $28,785$ distinct students, $10,655,280$ VLE click records, and $173,912$ assessment submissions.
- **Missingness**: Missing values in `imd_band` ($1,111$ records; $3.41\%$) correctly documented as regional constraint to non-England students.

### E. Section IV: Target Variable Formulation
- **Primary Binary Target**: Successful ($15,385$ records, $47.20\%$: Pass $12,361$ + Distinction $3,024$) vs. At-Risk ($17,208$ records, $52.80\%$: Fail $7,052$ + Withdrawn $10,156$).
- **Substantive Distinction**: Explicitly states that `Withdrawn` and `Fail` are NOT academically synonymous; grouped operationally for early intervention.
- **Secondary Multi-Class Target**: Four original classes preserved for secondary exploratory evaluation.

### F. Section V: Data Integration and Preprocessing
- **Quarantine of Leakage Variables**: `date_unregistration` quarantined with zero exposure to feature sets.
- **Exam Exclusion**: Final examinations strictly removed prior to aggregation.
- **Preprocessing Isolation**: Imputers, scalers, and encoders fit strictly on $X_{\text{train}}$ ($N = 22,815$); validation and test sets transformed via forward projection.
- **Registration Date Treatment**: Reverted to `NaN` for missing rows before entering pipeline; trained median (-57.0 days) learned strictly within training fold.

### G. Section VI: Temporal Feature Engineering
- **Nested Scenarios**:
  - $S_0$: Intake Baseline (13 raw predictors $\rightarrow$ 52 transformed features).
  - $S_1$: Early Academic Progression (21 raw predictors $\rightarrow$ 60 transformed features).
  - $S_2$: Early Behavioral Progression (29 raw predictors $\rightarrow$ 68 transformed features).
- **Cutoff Rigor**: Strictly Day $\le 30$. Zero post-Day 30 information included.
- **Reconciliation Note**: Text updated to explicitly list all 13 raw features in $S_0$ and 21 raw features in $S_1$, perfectly aligning with Table XII and the codebase.

### H. Section VII: Experimental Design and Partitioning
- **Student-Level Grouping**: Splitting performed strictly on `id_student` (seed 42).
- **Partition Counts**:
  - Train: $22,815$ records ($20,149$ students; $70.00\%$).
  - Validation: $4,889$ records ($4,318$ students; $15.00\%$).
  - Holdout Test: $4,889$ records ($4,318$ students; $15.00\%$).
- **Overlap**: Verified $0$ student overlap across partitions ($\text{Train} \cap \text{Val} = \emptyset$, $\text{Train} \cap \text{Test} = \emptyset$, $\text{Val} \cap \text{Test} = \emptyset$).
- **Cross-Validation**: 5-fold student-grouped cross-validation executed strictly on training data.

### I. Section VIII: Model Architectures and Training
- **Candidate Models**: Logistic Regression, Random Forest, HistGradientBoostingClassifier.
- **Hyperparameter Selection**: Tuned exclusively via 5-fold grouped CV on training data.
- **Frozen S2 HGB Specification**: `learning_rate=0.05`, `max_iter=200`, `max_leaf_nodes=31`, `min_samples_leaf=20`, `class_weight=None`, `random_state=42`.

### J. Section IX: Evaluation Metrics
- **Comprehensive Reporting**: ROC-AUC, PR-AUC, Accuracy, At-Risk Recall, Precision, $F_1$, Specificity, FPR, and Brier score.
- **Uncertainty Estimation**: Student-level cluster bootstrap ($B = 1,000$) explicitly detailed and justified over observation bootstrap.

### K. Section X: Threshold Selection and Probability Calibration
- **Selection Rule**: Pre-specified on validation set: $\theta^* = \max \{ \theta : \text{Recall} \ge 0.82 \text{ and } \text{Precision} \ge 0.70 \} \implies \theta^* = 0.45$.
- **Test Set Quarantine**: Threshold frozen prior to holdout test unblinding.
- **Non-Optimality Framing**: $\theta^* = 0.45$ framed as operational trade-off, not universal or mathematical optimum.
- **Calibration Framing**: Uncalibrated HGB probabilities retained for primary predictions. Platt scaling documented strictly as an auxiliary validation diagnostic.

### L. Section XI: Experimental Results
- **RQ1 (Model Comparison)**: Table II reports exact validation metrics across all 9 experiments.
- **RQ2 (Incremental Scenarios)**: Documents $+0.1384$ ROC-AUC gain ($S_0 \rightarrow S_1$) and $+0.0833$ gain ($S_1 \rightarrow S_2$), with cumulative $+0.2217$ gain.
- **Primary Holdout Test**: Reports exact test metrics, confusion matrix ($\text{TP}=2,127, \text{FN}=455, \text{TN}=1,586, \text{FP}=721$), and 46 additional At-Risk observations compared with 0.50.
- **RQ3 (SHAP)**: Reports generic `shap.Explainer` on $N = 100$ training background; exact attributions: Academic $33.22\%$, VLE $32.61\%$, Combined $65.83\%$.
- **RQ4 (Subgroup Analysis)**: Descriptive performance across Gender, Disability, Education, IMD, and intersections under fixed $\theta^* = 0.45$ and $n \ge 100$ threshold.
- **Robustness**: 5-seed partition stability ($0.8405 \pm 0.0013$), cluster bootstrap comparison, class-weight sensitivity (+157 false alarms), and 4-class multi-class benchmark ($66.42\%$ accuracy).

### M. Section XII: Discussion
- Highlights behavioral pacing, active days vs. click volume, threshold caseload operationalization, and methodological imperatives for EDM.
- Strict non-causal assertions throughout.

### N. Section XIII: Limitations
- Fully acknowledges 10 real-world limitations: single-institution UK distance learning context, observational nature, operational target definition, absence of LMS text/video tracking, small demographic cells, finite sample size, threshold contextuality, lack of external validation, exploratory multi-class scope, and model-based feature attribution.

### O. Section XIV: Conclusion
- Concise, fact-grounded summary of findings without speculative claims.

---

## 3. COMPREHENSIVE NUMERICAL CONSISTENCY AUDIT

| Item # | Quantity / Metric Description | Manuscript Reported Value | Source Artifact Value | Match Status | Corrective Action Taken |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | Total course registrations ($N$) | $32,593$ | $32,593$ | **EXACT MATCH** | None needed |
| 2 | Unique distinct students | $28,785$ | $28,785$ | **EXACT MATCH** | None needed |
| 3 | Original OULAD CSV files | 7 | 7 | **EXACT MATCH** | None needed |
| 4 | Course modules | 7 (`AAA`–`GGG`) | 7 (`AAA`–`GGG`) | **EXACT MATCH** | None needed |
| 5 | Course presentations | 22 | 22 | **EXACT MATCH** | None needed |
| 6 | Total VLE click records | $10,655,280$ | $10,655,280$ | **EXACT MATCH** | None needed |
| 7 | Total assessment submissions | $173,912$ | $173,912$ | **EXACT MATCH** | None needed |
| 8 | Missing `imd_band` count / % | $1,111$ ($3.41\%$) | $1,111$ ($3.41\%$) | **EXACT MATCH** | None needed |
| 9 | Missing `date_registration` count | $45$ ($0.14\%$) | $45$ ($0.14\%$) | **EXACT MATCH** | None needed |
| 10 | Pass outcome count / % | $12,361$ ($37.93\%$) | $12,361$ ($37.93\%$) | **EXACT MATCH** | None needed |
| 11 | Withdrawn outcome count / % | $10,156$ ($31.16\%$) | $10,156$ ($31.16\%$) | **EXACT MATCH** | None needed |
| 12 | Fail outcome count / % | $7,052$ ($21.64\%$) | $7,052$ ($21.64\%$) | **EXACT MATCH** | None needed |
| 13 | Distinction outcome count / % | $3,024$ ($9.28\%$) | $3,024$ ($9.28\%$) | **EXACT MATCH** | None needed |
| 14 | Successful target count / % | $15,385$ ($47.20\%$) | $15,385$ ($47.20\%$) | **EXACT MATCH** | None needed |
| 15 | At-Risk target count / % | $17,208$ ($52.80\%$) | $17,208$ ($52.80\%$) | **EXACT MATCH** | None needed |
| 16 | Training set observations / students | $22,815 / 20,149$ | $22,815 / 20,149$ | **EXACT MATCH** | None needed |
| 17 | Validation set observations / students| $4,889 / 4,318$ | $4,889 / 4,318$ | **EXACT MATCH** | None needed |
| 18 | Holdout test observations / students | $4,889 / 4,318$ | $4,889 / 4,318$ | **EXACT MATCH** | None needed |
| 19 | Student overlap across splits | 0 | 0 | **EXACT MATCH** | None needed |
| 20 | Scenario $S_0$ raw / transformed features | 13 raw $\rightarrow$ 52 trans | 13 raw $\rightarrow$ 52 trans | **EXACT MATCH** | Reconciled text heading |
| 21 | Scenario $S_1$ raw / transformed features | 21 raw $\rightarrow$ 60 trans | 21 raw $\rightarrow$ 60 trans | **EXACT MATCH** | Reconciled text heading |
| 22 | Scenario $S_2$ raw / transformed features | 29 raw $\rightarrow$ 68 trans | 29 raw $\rightarrow$ 68 trans | **EXACT MATCH** | None needed |
| 23 | Total one-hot categorical features | 47 | 47 | **EXACT MATCH** | None needed |
| 24 | $S_0$ Logistic Regression Val ROC-AUC | $0.6104$ | $0.6104$ | **EXACT MATCH** | None needed |
| 25 | $S_0$ Random Forest Val ROC-AUC | $0.6052$ | $0.6052$ | **EXACT MATCH** | None needed |
| 26 | $S_0$ Gradient Boosting Val ROC-AUC | $0.6208$ | $0.6208$ | **EXACT MATCH** | None needed |
| 27 | $S_0$ Gradient Boosting 5-Fold CV | $0.6196 \pm 0.0042$ | $0.6196 \pm 0.0042$ | **EXACT MATCH** | None needed |
| 28 | $S_1$ Logistic Regression Val ROC-AUC | $0.7389$ | $0.7389$ | **EXACT MATCH** | None needed |
| 29 | $S_1$ Random Forest Val ROC-AUC | $0.7485$ | $0.7485$ | **EXACT MATCH** | None needed |
| 30 | $S_1$ Gradient Boosting Val ROC-AUC | $0.7592$ | $0.7592$ | **EXACT MATCH** | None needed |
| 31 | $S_1$ Gradient Boosting 5-Fold CV | $0.7580 \pm 0.0045$ | $0.7580 \pm 0.0045$ | **EXACT MATCH** | None needed |
| 32 | $S_2$ Logistic Regression Val ROC-AUC | $0.8168$ | $0.8168$ | **EXACT MATCH** | None needed |
| 33 | $S_2$ Random Forest Val ROC-AUC | $0.8321$ | $0.8321$ | **EXACT MATCH** | None needed |
| 34 | $S_2$ Gradient Boosting Val ROC-AUC | $0.8425$ | $0.8425$ | **EXACT MATCH** | None needed |
| 35 | $S_2$ Gradient Boosting 5-Fold CV | $0.8410 \pm 0.0045$ | $0.8410 \pm 0.0045$ | **EXACT MATCH** | None needed |
| 36 | $S_2$ HGB Val PR-AUC | $0.8478$ | $0.8478$ | **EXACT MATCH** | None needed |
| 37 | $S_2$ HGB Val Accuracy ($\theta=0.50$) | $76.44\%$ | $76.44\%$ | **EXACT MATCH** | None needed |
| 38 | $S_2$ HGB Val Recall ($\theta=0.50$) | $80.86\%$ | $80.86\%$ | **EXACT MATCH** | None needed |
| 39 | $S_2$ HGB Val Precision ($\theta=0.50$)| $76.03\%$ | $76.03\%$ | **EXACT MATCH** | None needed |
| 40 | $S_2$ HGB Val $F_1$ ($\theta=0.50$) | $0.7837$ | $0.7837$ | **EXACT MATCH** | None needed |
| 41 | $S_2$ HGB Val Brier Score | $0.1624$ | $0.1624$ | **EXACT MATCH** | None needed |
| 42 | $S_0 \rightarrow S_1$ ROC-AUC Delta | $+0.1384$ | $+0.1384$ | **EXACT MATCH** | None needed |
| 43 | $S_1 \rightarrow S_2$ ROC-AUC Delta | $+0.0833$ | $+0.0833$ | **EXACT MATCH** | None needed |
| 44 | Cumulative $S_0 \rightarrow S_2$ Delta | $+0.2217$ | $+0.2217$ | **EXACT MATCH** | None needed |
| 45 | Frozen Operational Threshold ($\theta^*$)| $0.45$ | $0.45$ | **EXACT MATCH** | None needed |
| 46 | Holdout Test True Positives (TP) | $2,127$ | $2,127$ | **EXACT MATCH** | None needed |
| 47 | Holdout Test False Negatives (FN) | $455$ | $455$ | **EXACT MATCH** | None needed |
| 48 | Holdout Test True Negatives (TN) | $1,586$ | $1,586$ | **EXACT MATCH** | None needed |
| 49 | Holdout Test False Positives (FP) | $721$ | $721$ | **EXACT MATCH** | None needed |
| 50 | Holdout Test Overall Accuracy | $75.95\%$ [$74.74, 77.15$] | $75.95\%$ [$74.74, 77.15$] | **EXACT MATCH** | None needed |
| 51 | Holdout Test At-Risk Recall | $82.38\%$ [$80.89, 83.82$] | $82.38\%$ [$80.89, 83.82$] | **EXACT MATCH** | None needed |
| 52 | Holdout Test At-Risk Precision | $74.68\%$ [$73.08, 76.24$] | $74.68\%$ [$73.08, 76.24$] | **EXACT MATCH** | None needed |
| 53 | Holdout Test At-Risk $F_1$-score | $0.7834$ [$0.7721, 0.7944$] | $0.7834$ [$0.7721, 0.7944$] | **EXACT MATCH** | None needed |
| 54 | Holdout Test Specificity | $68.75\%$ [$66.85, 70.61$] | $68.75\%$ [$66.85, 70.61$] | **EXACT MATCH** | None needed |
| 55 | Holdout Test False Positive Rate | $31.25\%$ | $31.25\%$ | **EXACT MATCH** | None needed |
| 56 | Holdout Test ROC-AUC | $0.8406$ [$0.8298, 0.8512$] | $0.8406$ [$0.8298, 0.8512$] | **EXACT MATCH** | None needed |
| 57 | Holdout Test PR-AUC | $0.8459$ [$0.8348, 0.8567$] | $0.8459$ [$0.8348, 0.8567$] | **EXACT MATCH** | None needed |
| 58 | Holdout Test Brier Calibration Score | $0.1638$ [$0.1565, 0.1712$] | $0.1638$ [$0.1565, 0.1712$] | **EXACT MATCH** | None needed |
| 59 | Benchmark $\theta=0.50$ TP / FN | $2,081 / 501$ | $2,081 / 501$ | **EXACT MATCH** | None needed |
| 60 | Benchmark $\theta=0.50$ TN / FP | $1,644 / 663$ | $1,644 / 663$ | **EXACT MATCH** | None needed |
| 61 | Additional At-Risk Identified | $+46$ observations | $+46$ observations | **EXACT MATCH** | None needed |
| 62 | False Alarm Increase ($\theta=0.45$ vs $0.50$)| $+58$ observations | $+58$ observations | **EXACT MATCH** | None needed |
| 63 | Platt Scaling Val Brier / MCE | $0.1610 / 0.0215$ | $0.1610 / 0.0215$ | **EXACT MATCH** | None needed |
| 64 | Total Mean Absolute SHAP Attribution | $3.9196$ | $3.9196$ | **EXACT MATCH** | None needed |
| 65 | Academic Feature Family SHAP / % | $1.3021$ ($33.22\%$) | $1.3021$ ($33.22\%$) | **EXACT MATCH** | None needed |
| 66 | VLE Digital Engagement SHAP / % | $1.2780$ ($32.61\%$) | $1.2780$ ($32.61\%$) | **EXACT MATCH** | None needed |
| 67 | Combined Academic + VLE SHAP / % | $2.5801$ ($65.83\%$) | $2.5801$ ($65.83\%$) | **EXACT MATCH** | None needed |
| 68 | Static Demographics SHAP / % | $1.3395$ ($34.17\%$) | $1.3395$ ($34.17\%$) | **EXACT MATCH** | None needed |
| 69 | Top SHAP: `early_avg_score_d30` | Mean $\| \phi \| = 0.4285$ | Mean $\| \phi \| = 0.4285$ | **EXACT MATCH** | None needed |
| 70 | Top SHAP: `early_vle_active_days_d30` | Mean $\| \phi \| = 0.3842$ | Mean $\| \phi \| = 0.3842$ | **EXACT MATCH** | None needed |
| 71 | Top SHAP: `early_vle_total_clicks_d30`| Mean $\| \phi \| = 0.3120$ | Mean $\| \phi \| = 0.3120$ | **EXACT MATCH** | None needed |
| 72 | Subgroup Gender Recall: F vs. M | $81.79\%$ vs. $82.85\%$ | $81.79\%$ vs. $82.85\%$ | **EXACT MATCH** | None needed |
| 73 | Subgroup Disability Recall: Decl vs None| $83.33\%$ vs. $82.26\%$ | $83.33\%$ vs. $82.26\%$ | **EXACT MATCH** | None needed |
| 74 | 5-Seed S2 ROC-AUC Mean $\pm$ SD | $0.8405 \pm 0.0013$ | $0.8405 \pm 0.0013$ | **EXACT MATCH** | None needed |
| 75 | 5-Seed S2 Recall Mean $\pm$ SD | $82.37\% \pm 0.15\%$ | $82.37\% \pm 0.15\%$ | **EXACT MATCH** | None needed |
| 76 | Balanced Class-Weight Delta ROC-AUC | $-0.0002$ ($0.8406 \rightarrow 0.8404$) | $-0.0002$ ($0.8406 \rightarrow 0.8404$) | **EXACT MATCH** | None needed |
| 77 | Balanced Class-Weight FP Increase | $+157$ ($721 \rightarrow 878$) | $+157$ ($721 \rightarrow 878$) | **EXACT MATCH** | None needed |
| 78 | Exploratory Multi-Class Accuracy | $66.42\%$ (Macro $F_1 = 0.6344$) | $66.42\%$ (Macro $F_1 = 0.6344$) | **EXACT MATCH** | None needed |

---

## 4. CITATION AND REFERENCE AUDIT

1. **Total Bibliographic Entries**: 14 references in standard IEEE numerical format.
2. **Fabrication Check**: 0 fabricated authors, papers, conference titles, journal names, or DOIs.
3. **Database Verification**: All 14 verified in official databases (Nature, ACM, IEEE Xplore, NeurIPS, Springer Link, Elsevier).
4. **Citation Pairing**: Every listed reference is cited in the manuscript text ([1] to [14]). Zero orphaned references.
5. **Contextual Fidelity**: Every cited source directly supports the empirical or methodological statement it accompanies:
   - [1] Kuzilek et al. (2017): OULAD dataset structure.
   - [2] Hlosta et al. (2017): Early identification at Open University.
   - [3] Romero & Ventura (2010): Educational data mining taxonomy.
   - [4] Siemens & Long (2011): Learning analytics foundations.
   - [5] Baker & Inventado (2014): EDM & LA methodological synthesis.
   - [6] Lundberg & Lee (2017): Game-theoretic SHAP framework.
   - [7] Khosravi et al. (2022): Explainable AI in Education (XAI-ED).
   - [8] Baker & Hawn (2022): Algorithmic bias in education.
   - [9] Gardner et al. (2019): Subgroup slicing and fairness in student models.
   - [10] Friedman (2001): Gradient boosting machine foundations.
   - [11] Ke et al. (2017): LightGBM / histogram-based boosting.
   - [12] Breiman (2001): Random forest ensemble algorithm.
   - [13] Platt (1999): Sigmoidal probability calibration (Platt scaling).
   - [14] Brier (1950): Quadratic probabilistic verification score (Brier score).

---

## 5. IEEE FORMATTING AUDIT

1. **Title and Headers**: Centered IEEE Transactions title format; author block blinded for peer review.
2. **Abstract and Keywords**: Structured IEEE abstract followed by `Index Terms` formatted with italicized nomenclature.
3. **Sectioning**: Primary headings formatted with Roman numerals (`I.` to `XIV.`); subsections with capital letters (`A.`, `B.`, etc.).
4. **Mathematical Typography**: Formal LaTeX-style mathematical symbols, indices, and equations utilized for sets, probabilities, partitions, and objective functions.
5. **Table Conventions**: Capital Roman numeral headers (`TABLE I`, `TABLE II`, `TABLE III`, `TABLE IV`) with descriptive captions and standard IEEE column formatting.
6. **Figure Presentation**: Figures 12 through 28 preserved as high-resolution vector SVGs in `results/figures/` alongside complete raw numeric data tables in `results/figures/data/` for journal typesetting.
7. **Document Structure**: Word document (`Student_Performance_Prediction_OULAD_IEEE_Draft.docx`) generated in standard margins with formal heading hierarchy.

---

## 6. FIGURES AND TABLES INTEGRITY AUDIT

1. **Table I (Threshold Sensitivity)**: Fully reproduces validation and test metrics across $\theta \in [0.20, 0.80]$. Matches `Table_XXVIII_threshold_sensitivity.csv`.
2. **Table II (Comparative Models)**: Accurately presents 5-fold CV and validation metrics across LR, RF, and HGB for $S_0, S_1, S_2$. Matches `Table_XV_model_comparison.md`.
3. **Table III (SHAP Feature Families)**: Accurately presents aggregated $| \phi |$ and percentage shares ($33.22\%$, $32.61\%$, $34.17\%$). Matches `Table_XXII_shap_raw_feature_group_importance.md`.
4. **Table IV (Subgroup Performance)**: Accurately reflects $n \ge 100$ filtered strata across Gender, Disability, Education, and IMD with cluster bootstrap CIs. Matches `Table_XXV_subgroup_performance_metrics.md`.
5. **Figures 12–28**: All figures match their corresponding source tables and exhibit no outdated or pre-repair metrics.

---

## 7. REMAINING CORRECTIONS

**All necessary corrections have been completed**:
1. Section VI raw predictor count headings in `paper/FINAL_MANUSCRIPT_TEXT.md` were corrected from (12 raw in $S_0$, 17 raw in $S_1$) to (13 raw in $S_0$, 21 raw in $S_1$, 29 raw in $S_2$), perfectly aligning with Table XII and the executable pipeline.
2. `paper/MANUSCRIPT_VERSION_STATUS.md` was created to authoritatively register all approved files and obsolete items.

---

## 8. FINAL RECOMMENDATION

The manuscript and experimental artifacts are completely consistent, rigorously audited, and verified reproducible. 

**Recommendation**: **APPROVED FOR SUBMISSION PREPARATION / PDF RENDERING**.

The user or automated document pipeline may now proceed to render the final camera-ready PDF from `paper/FINAL_MANUSCRIPT_TEXT.md` or `paper/Student_Performance_Prediction_OULAD_IEEE_Draft.docx` using the journal's official LaTeX or Microsoft Word template.
