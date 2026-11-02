# FINAL SUBMISSION-READINESS REPORT

**Project**: *Student Performance Prediction Using Machine Learning and Explainable AI: An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)*  
**Document**: Authoritative Submission-Readiness Audit and Verification Package  
**Phase**: Phase 17 — Final IEEE Paper Assembly and Submission Readiness Audit  
**Date**: October 2, 2026  
**Auditor**: Antigravity Research Assistant & Quality Assurance Pipeline  

---

## A. MANUSCRIPT STRUCTURE AUDIT

The assembled manuscript (`paper/FINAL_MANUSCRIPT_TEXT.md` and `paper/Student_Performance_Prediction_OULAD_IEEE_Draft.docx`) was audited against the comprehensive IEEE paper specification. All required sections are fully populated, logically sequenced, and academically structured:

1. **Title**: *Student Performance Prediction Using Machine Learning and Explainable AI: An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)* $\rightarrow$ **CONFIRMED**
2. **Abstract**: Contains problem motivation, OULAD dataset dimensions, $S_0/S_1/S_2$ framework, primary HGB model, holdout test metrics ($0.8406$ ROC-AUC, $82.38\%$ Recall, $0.7834$ $F_1$), SHAP findings, descriptive subgroup evaluation, robustness results, and non-causal conclusion $\rightarrow$ **CONFIRMED**
3. **Index Terms**: Includes 8 relevant IEEE-style keywords $\rightarrow$ **CONFIRMED**
4. **Section I (Introduction)**: Establishes distance-learning attrition context, early identification dilemma, static demographic limitations, temporal leakage risks, explainability requirements, algorithmic fairness auditing, research gap, study contributions, and non-causal research questions $\rightarrow$ **CONFIRMED**
5. **Section II (Related Work)**: Synthesizes OULAD literature, machine learning and gradient boosting architectures, XAI-ED explainability, and algorithmic bias in education $\rightarrow$ **CONFIRMED**
6. **Section III (Dataset and Data Description)**: Describes all 7 relational tables, 22 presentations, 7 modules, analytical unit, and aggregation rationale $\rightarrow$ **CONFIRMED**
7. **Section IV (Target Definition)**: Formulates primary binary target ($52.80\%$ At-Risk vs. $47.20\%$ Successful), documents operational early-intervention rationale, and frames four-class mapping as exploratory $\rightarrow$ **CONFIRMED**
8. **Section V (Data Integration and Preprocessing)**: Details leakage quarantine of `date_unregistration`, exam exclusion, missing-value handling, and categorical encoding $\rightarrow$ **CONFIRMED**
9. **Section VI (Temporal Feature Engineering)**: Explains the *Filter $\rightarrow$ Aggregate $\rightarrow$ Model* protocol, nested $S_0, S_1, S_2$ horizons, and strict Day 30 cutoffs $\rightarrow$ **CONFIRMED**
10. **Section VII (Experimental Design and Partitioning)**: Details student-grouped splitting (70/15/15), repeat enrollment handling, and 5-fold grouped CV $\rightarrow$ **CONFIRMED**
11. **Section VIII (Model Architectures)**: Formulates Logistic Regression, Random Forest, and HistGradientBoosting specifications $\rightarrow$ **CONFIRMED**
12. **Section IX (Evaluation Metrics)**: Details discrimination, classification, calibration, and cluster bootstrap confidence interval estimation $\rightarrow$ **CONFIRMED**
13. **Section X (Threshold Selection and Calibration)**: Details pre-specified validation rule ($\theta^* = 0.45$), $0.50$ benchmark comparison, and auxiliary Platt scaling diagnostics $\rightarrow$ **CONFIRMED**
14. **Section XI (Experimental Results)**: Presents RQ1 model comparison, RQ2 scenario gains, primary locked holdout test evaluation, RQ3 SHAP attribution, RQ4 subgroup analysis, robustness analyses, and exploratory four-class analysis $\rightarrow$ **CONFIRMED**
15. **Section XII (Discussion)**: Discusses principal findings, behavioral pacing, threshold operationalization, and EDM methodological implications $\rightarrow$ **CONFIRMED**
16. **Section XIII (Limitations)**: Documents 10 explicit limitations without obfuscation $\rightarrow$ **CONFIRMED**
17. **Section XIV (Conclusion)**: Concise, evidence-grounded summary of findings and prospective directions $\rightarrow$ **CONFIRMED**
18. **References**: 14 fully verified, un-hallucinated citations in standard IEEE format $\rightarrow$ **CONFIRMED**

---

## B. NUMERICAL CONSISTENCY AUDIT

Every numerical value across the manuscript was audited against the locked source tables (Tables XIV, XV, XVI, XVII, XVIII, XIX, XXI, XXII, XXIV, XXV, XXVI, XXVIII, XXIX, XXX, XXXI, XXXII):

| Quantity / Metric | Audited Source Artifact Value | Manuscript Reported Value | Status |
| :--- | :--- | :--- | :---: |
| **Total Course Registrations ($N$)** | $32,593$ | $32,593$ | **100% MATCH** |
| **Unique Students** | $28,785$ | $28,785$ | **100% MATCH** |
| **Course Modules / Presentations** | 7 modules (`AAA`-`GGG`), 22 presentations | 7 modules, 22 presentations | **100% MATCH** |
| **Total VLE Click Records** | $10,655,280$ | $10,655,280$ | **100% MATCH** |
| **Total Assessment Records** | $173,912$ | $173,912$ | **100% MATCH** |
| **Full Target: At-Risk** | $17,208$ ($52.80\%$) [Withdrawn: $10,156$; Fail: $7,052$] | $17,208$ ($52.80\%$) [Withdrawn: $10,156$; Fail: $7,052$] | **100% MATCH** |
| **Full Target: Successful** | $15,385$ ($47.20\%$) [Pass: $12,361$; Distinction: $3,024$] | $15,385$ ($47.20\%$) [Pass: $12,361$; Distinction: $3,024$] | **100% MATCH** |
| **Partition Splits (Obs / Students)** | Train: $22,815 / 20,149$; Val: $4,889 / 4,318$; Test: $4,889 / 4,318$ | Train: $22,815 / 20,149$; Val: $4,889 / 4,318$; Test: $4,889 / 4,318$ | **100% MATCH** |
| **Test Set Target Distribution** | At-Risk = $2,582$ ($52.81\%$), Successful = $2,307$ ($47.19\%$) | At-Risk = $2,582$ ($52.81\%$), Successful = $2,307$ ($47.19\%$) | **100% MATCH** |
| **Primary Confusion Matrix** | $\text{TP} = 2,127, \text{FN} = 455, \text{TN} = 1,586, \text{FP} = 721$ | $\text{TP} = 2,127, \text{FN} = 455, \text{TN} = 1,586, \text{FP} = 721$ | **100% MATCH** |
| **Test Accuracy** | $75.95\%$ [$74.74\% - 77.15\%$] | $75.95\%$ [$74.74\% - 77.15\%$] | **100% MATCH** |
| **Test At-Risk Recall** | $82.38\%$ [$80.89\% - 83.82\%$] | $82.38\%$ [$80.89\% - 83.82\%$] | **100% MATCH** |
| **Test At-Risk Precision** | $74.68\%$ [$73.08\% - 76.24\%$] | $74.68\%$ [$73.08\% - 76.24\%$] | **100% MATCH** |
| **Test At-Risk $F_1$-score** | $0.7834$ [$0.7721 - 0.7944$] | $0.7834$ [$0.7721 - 0.7944$] | **100% MATCH** |
| **Test Specificity (TNR)** | $68.75\%$ [$66.85\% - 70.61\%$] | $68.75\%$ [$66.85\% - 70.61\%$] | **100% MATCH** |
| **Test ROC-AUC** | $0.8406$ [$0.8298 - 0.8512$] | $0.8406$ [$0.8298 - 0.8512$] | **100% MATCH** |
| **Test PR-AUC** | $0.8459$ [$0.8348 - 0.8567$] | $0.8459$ [$0.8348 - 0.8567$] | **100% MATCH** |
| **Test Brier Score** | $0.1638$ [$0.1565 - 0.1712$] | $0.1638$ [$0.1565 - 0.1712$] | **100% MATCH** |
| **Threshold Contrast ($\theta=0.45$ vs $0.50$)**| $46$ additional At-Risk observations; FN $501 \rightarrow 455$ | $46$ additional At-Risk observations; FN $501 \rightarrow 455$ | **100% MATCH** |
| **Calibration Diagnostics** | Uncal Val: Brier $0.1624$, MCE $0.0520$; Platt Val: $0.1610, 0.0215$ | Uncal Val: Brier $0.1624$, MCE $0.0520$; Platt Val: $0.1610, 0.0215$ | **100% MATCH** |
| **Validation Scenarios (ROC-AUC)** | $S_0: 0.6208 \rightarrow S_1: 0.7592 (+0.1384) \rightarrow S_2: 0.8425 (+0.0833)$ | $S_0: 0.6208 \rightarrow S_1: 0.7592 (+0.1384) \rightarrow S_2: 0.8425 (+0.0833)$ | **100% MATCH** |
| **Total Mean Absolute SHAP** | $3.9196$ | $3.9196$ | **100% MATCH** |
| **Academic SHAP Family** | $1.3021$ ($33.22\%$) | $1.3021$ ($33.22\%$) | **100% MATCH** |
| **VLE SHAP Family** | $1.2780$ ($32.61\%$) | $1.2780$ ($32.61\%$) | **100% MATCH** |
| **Combined Academic + VLE** | $2.5801$ ($65.83\%$) | $2.5801$ ($65.83\%$) | **100% MATCH** |
| **Remaining Feature Families** | $1.3395$ ($34.17\%$) | $1.3395$ ($34.17\%$) | **100% MATCH** |
| **Top Predictor SHAP Values** | `early_avg_score`: $0.4285$, `active_days`: $0.3842$, `clicks`: $0.3120$ | `early_avg_score`: $0.4285$, `active_days`: $0.3842$, `clicks`: $0.3120$ | **100% MATCH** |
| **Subgroup Recall: Gender** | Female: $81.79\%$ vs Male: $82.85\%$ ($\Delta = 1.06\%$) | Female: $81.79\%$ vs Male: $82.85\%$ ($\Delta = 1.06\%$) | **100% MATCH** |
| **Subgroup Recall: Disability** | Declared: $83.33\%$ vs No Disability: $82.26\%$ ($\Delta = 1.07\%$) | Declared: $83.33\%$ vs No Disability: $82.26\%$ ($\Delta = 1.07\%$) | **100% MATCH** |
| **Subgroup Recall: Education** | Lower than A Level: $84.13\%$; Higher Ed: $78.87\%$ | Lower than A Level: $84.13\%$; Higher Ed: $78.87\%$ | **100% MATCH** |
| **Subgroup Recall: IMD Deciles** | Range: $80.28\%$ (Decile 10) to $84.23\%$ (Decile 1) | Range: $80.28\%$ (Decile 10) to $84.23\%$ (Decile 1) | **100% MATCH** |
| **Seed Robustness (5 Seeds)** | $S_2$ ROC-AUC: $0.8405 \pm 0.0013$; Recall: $82.37\% \pm 0.15\%$ | $S_2$ ROC-AUC: $0.8405 \pm 0.0013$; Recall: $82.37\% \pm 0.15\%$ | **100% MATCH** |
| **Exploratory Multi-Class Acc** | $66.42\%$ (Withdrawn $0.7140$, Pass $0.6956$, Fail $0.5507$) | $66.42\%$ (Withdrawn $0.7140$, Pass $0.6956$, Fail $0.5507$) | **100% MATCH** |

*Audit Finding*: **ZERO NUMERICAL DISCREPANCIES DETECTED Across All 32 Audited Values**.

---

## C. METHODOLOGY CONSISTENCY AUDIT

1. **Model Specification**: Uses strictly `HistGradientBoostingClassifier(learning_rate=0.05, max_iter=200, max_leaf_nodes=31, min_samples_leaf=20, class_weight=None, random_state=42)`. No retuning, re-fitting, or architecture modification occurred.
2. **Feature Count**: Exactly 29 raw predictors mapping to 68 transformed features.
3. **Information Cutoff**: Strictly Day $\le 30$. No future information permitted.
4. **Decision Threshold**: Frozen at $\theta^* = 0.45$. No post-hoc threshold adjustment.

---

## D. LEAKAGE AUDIT

1. **`date_unregistration`**: Quarantined and 100% excluded from all feature pipelines.
2. **Examination Data**: All final examinations removed prior to aggregation.
3. **Temporal Bounding**: All VLE interactions and assessment submissions occurring after Day 30 strictly filtered out.
4. **Preprocessing Leakage**: Medians, scalers, and one-hot encoders fit strictly on training data; validation and test sets were transformed without refitting.

---

## E. TEST-SET INTEGRITY AUDIT

1. **Blinding Integrity**: Holdout test set was unblinded exactly once in Phase 12 for final evaluation.
2. **Zero Post-Hoc Selection**: Model selection and threshold selection were finalized on training CV and validation data prior to test evaluation.
3. **Subsequent Analyses**: Phases 13 (SHAP), 14 (Subgroup), 15 (Robustness), 16 (Synthesis), and 17 (Assembly) evaluated the frozen predictions without any feedback loops to model training.

---

## F. SCIENTIFIC-LANGUAGE AUDIT

The manuscript text was audited against non-negotiable scientific framing rules:
1. **Threshold Interpretation**: Uses exclusively:
   > *"At the frozen threshold of 0.45, the model identifies 46 additional At-Risk observations compared with the 0.50 benchmark, reducing the false-negative count from 501 to 455."*  
   Zero occurrences of "46 additional at-risk students" or "reducing missed failures".
2. **Calibration Claim**: Uses exclusively:
   > *"The uncalibrated HGB probabilities yielded a validation Brier score of 0.1624 and MCE of 0.0520, with a holdout-test Brier score of 0.1638. Platt scaling was evaluated as an auxiliary calibration diagnostic and was not applied to the final test predictions, threshold selection, or SHAP analysis."*  
   Zero categorical claims that probabilities are "well-calibrated".
3. **SHAP Family Comparison**: Uses exclusively:
   > *"Academic and VLE-related feature families together accounted for 65.83% of the aggregated mean absolute SHAP attribution, compared with 34.17% for the remaining feature families."*  
   Zero occurrences of subjective phrasing such as "heavily outweighing".
4. **Non-Causal Grounding**: RQ2 and SHAP are framed strictly as observational predictive associations, with explicit disclaimers regarding the absence of causal levers.
5. **Subgroup Neutrality**: Subgroup performance metrics are reported descriptively alongside target prevalence. Terms like "fair", "unfair", "biased", or "unbiased" are used strictly in literature citations and ethical disclaimers.

---

## G. CITATION / REFERENCE AUDIT

All 14 citations in the manuscript are real, verified, and trace directly to published academic records:
- OULAD primary paper: Kuzilek et al. (2017), *Scientific Data*, doi: 10.1038/sdata.2017.171.
- Early warning at OU: Hlosta et al. (2017), *LAK '17*, doi: 10.1145/3027385.3027449.
- EDM foundations: Romero & Ventura (2010), *IEEE T-SMCC*, doi: 10.1109/TSMCC.2010.2053532.
- Learning Analytics: Siemens & Long (2011), *EDUCAUSE Review*.
- EDM & LA synthesis: Baker & Inventado (2014), Springer.
- SHAP: Lundberg & Lee (2017), *NeurIPS 2017*.
- XAI-ED: Khosravi et al. (2022), *Comput. Educ. Artif. Intell.*, doi: 10.1016/j.caeai.2022.100074.
- Algorithmic bias in education: Baker & Hawn (2022), *IJAIED*, doi: 10.1007/s40593-021-00285-9.
- Subgroup slicing: Gardner et al. (2019), *LAK '19*, doi: 10.1145/3303772.3303791.
- Gradient boosting: Friedman (2001), *Ann. Statist.*, doi: 10.1214/aos/1013203451.
- LightGBM / Histogram boosting: Ke et al. (2017), *NeurIPS 2017*.
- Random forests: Breiman (2001), *Mach. Learn.*, doi: 10.1023/A:1010933404324.
- Platt scaling: Platt (1999), *MIT Press*.
- Brier score: Brier (1950), *Mon. Weather Rev.*, doi: 10.1175/1520-0493(1950)078<0001:VOFEIT>2.0.CO;2.

Zero fabricated citations exist. Zero uncited references remain.

---

## H. FIGURE / TABLE AUDIT

1. **Table I**: Holdout test performance across threshold grid ($\theta \in [0.20, 0.80]$) $\rightarrow$ Fully consistent with `Table_XXVIII_threshold_sensitivity.md`.
2. **Table II**: Multi-model comparison across $S_0, S_1, S_2$ on validation data $\rightarrow$ Fully consistent with `Table_XV_model_comparison.md`.
3. **Table III**: Feature family SHAP attribution summary $\rightarrow$ Fully consistent with `Table_XXII_shap_raw_feature_group_importance.md`.
4. **Table IV**: Subgroup performance on holdout test set $\rightarrow$ Fully consistent with `Table_XXV_subgroup_performance_metrics.md`.
5. **Figure References**: SVG publication-quality figures generated in earlier phases (Figures 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28) remain available in `results/figures/` for camera-ready typesetting.

---

## I. IEEE-FORMATTING AUDIT

1. **Section Numbering**: Standard Roman numerals for primary sections (I to XIV), capital letters for subsections (A to G).
2. **References**: Numbered bracketed citations (`[1]`, `[2]`, etc.) sorted in citation appearance order.
3. **Typography & Styling**: Formatted according to IEEE Transactions standards in both Markdown and WordprocessingML (.docx) formats.
4. **Compliance Disclaimer**: As mandated, the generated manuscript is formatted in IEEE-compatible layout; formal journal acceptance or compliance is subject to specific editorial venue guidelines upon submission.

---

## J. REMAINING ISSUES

1. **PDF Compilation Environment**: Direct CLI generation of `.pdf` via headless Word or LaTeX requires external system permissions that are restricted in this terminal shell environment. The complete, publication-ready text is provided in `paper/FINAL_MANUSCRIPT_TEXT.md` and `paper/Student_Performance_Prediction_OULAD_IEEE_Draft.docx`. Users may convert the `.docx` to `.pdf` via Microsoft Word or LibreOffice.
2. **Double-Blind Review**: Author names and affiliations are blinded in accordance with IEEE double-blind review standards.

---

## K. FINAL STATUS

$$\mathbf{PASS\ —\ READY\ FOR\ USER\ REVIEW}$$

*(Note: "READY FOR USER REVIEW" indicates that Phase 17 paper assembly and submission readiness audits have been successfully completed with 100% numerical and scientific consistency. It does not represent formal journal acceptance.)*

---
*End of Final Submission-Readiness Report.*
