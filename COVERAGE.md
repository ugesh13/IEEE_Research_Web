# Manuscript Coverage Audit: OULAD Research Website

**Target Document**: `paper/Student_performance_perdiction_IEEE_Final.pdf` (and `.md`)  
**Website Codebase**: `website/src/`  
**Date**: 2026-11-11  

---

## 1. Structural Parity Overview

This audit systematically enumerates every structural item from the frozen IEEE manuscript—including sections, subsections, figures, tables, equations, and references—and benchmarks them against the current website implementation.

---

## 2. Sections and Content Parity Table

| Paper Section | Paper Title / Content | Present on Site? | Current Site Location / Note | Status / Gap Details |
| :--- | :--- | :---: | :--- | :--- |
| **Title & Header** | IEEE Transactions header, Authors, Affiliation | **Partial** | `Hero.tsx` | Authors and title present; formatted as web hero rather than academic header. |
| **Abstract** | Structured abstract (32,593 obs, 28,785 students, Day-30, HGB 0.8406) | **Partial** | `Hero.tsx` | Abbreviated abstract card shown; full verbatim abstract text not displayed in paper flow. |
| **Index Terms** | 7 terms (Educational data mining, EWS, XAI, gradient boosting, LA, SHAP, SPP) | **No** | None | Not displayed on the site. |
| **Section I** | **Introduction** (Attrition context, OULAD, early horizon, target leakage, XAI, 5 contributions) | **No** | None | **Major Gap**: Full text, background citations [1]–[17], and enumerated contributions missing. |
| **Section II** | **Related Work** (A. Early Prediction & EDM; B. Temporal Leakage & Cutoff; C. XAI; D. Algorithmic Fairness) | **No** | None | **Major Gap**: Comprehensive literature review [1]–[22] entirely absent from current web view. |
| **Section III** | **Dataset and Problem Formulation** | **Partial** | `DatasetSection.tsx` | |
| ↳ III-A | Analytical Unit: course-presentation enrollment $u$ | **Partial** | `DatasetSection.tsx` | Concepts described in text; formal tuple definition Eq. (1) missing. |
| ↳ III-B | Primary Binary Target: At-Risk ($y_u=1$) vs Successful ($y_u=0$) | **Yes** | `DatasetSection.tsx` | Pie chart, percentages (47.20% vs 52.80%), table breakdown present. |
| ↳ III-C | Temporal Feature Engineering: S0, S1, S2 nested scenarios | **Yes** | `LeakageDesign.tsx` | Feature tables, counts (13 / 21 / 29 raw), and Day-30 timeline clearly rendered. |
| **Section IV** | **Methodology** | **Partial** | `LeakageDesign.tsx`, `ProblemApproach.tsx` | |
| ↳ IV-A | Leakage Quarantine Protocol (Day-30 boundary, unregistration timestamp rules) | **Yes** | `LeakageDesign.tsx` | Quarantine principles and temporal boundaries visualised. |
| ↳ IV-B | Model Architectures (Logistic Regression, Random Forest, HistGradientBoosting) | **Partial** | `SupplementarySection.tsx` | HGB highlighted in results; baseline LR/RF mathematical descriptions missing. |
| ↳ IV-C | Evaluation Metrics (Equations 4–10) | **Partial** | `ResultsSection.tsx` | Metrics reported as scalar values; formal equations (Recall, Precision, Spec, F1, FPR, FNR) absent. |
| ↳ IV-D | Probability Calibration and Brier Score (Equation 11) | **Partial** | `ResultsSection.tsx` | Brier score (0.1638) shown; quadratic penalty equation and calibration curve missing. |
| ↳ IV-E | Operational Threshold Selection (Equation 12) | **Partial** | `ResultsSection.tsx` | Rule text quoted in monospace; formal mathematical optimization problem missing. |
| **Section V** | **Experimental Design** | **Partial** | `ExperimentalDesign.tsx` | |
| ↳ V-A | Student-Grouped Partitioning (Train 70%, Val 15%, Holdout 15%) | **Yes** | `ExperimentalDesign.tsx` | Partition table (22,815 / 4,889 / 4,889 obs; 20,149 / 4,318 / 4,318 students) present. |
| ↳ V-B | Model Comparison and 5-Fold Student-Grouped Cross-Validation | **Partial** | `ExperimentalDesign.tsx`, `SupplementarySection.tsx` | Validation table shown in Supplement; 5-fold CV protocol text not fully articulated. |
| **Section VI** | **Results** | **Yes** | `ResultsSection.tsx` | |
| ↳ VI-A | Model Comparison & Scenario Progression (Fig. 9 validation gains) | **Yes** | `ResultsSection.tsx` | Incremental gains (+0.1384, +0.0833, cumulative +0.2217) and derived AUC table present. |
| ↳ VI-B | Operational Threshold Optimization ($\theta^*=0.45$) | **Yes** | `ResultsSection.tsx` | Threshold callout, recall constraint ($82.38\% \ge 82\%$), precision constraint ($74.68\% \ge 70\%$). |
| ↳ VI-C | Locked Holdout Evaluation (Table IV metrics, 95% CIs) | **Yes** | `ResultsSection.tsx` | Full metrics table with 95% CIs displayed. |
| **Section VII** | **Explainability and Subgroup Analysis** | **Yes** | `ExplainabilitySection.tsx`, `SubgroupsSection.tsx` | |
| ↳ VII-A | Global SHAP Feature Attributions (Static 34.17%, Academic 33.22%, VLE 32.61%) | **Yes** | `ExplainabilitySection.tsx` | Bar visualisations of 3 families, 65.83% dynamic share, top 4 raw predictors. |
| ↳ VII-B | Descriptive Subgroup Performance (Disparity audit across 5 attributes) | **Yes** | `SubgroupsSection.tsx` | Table VI rendered in full with disclaimer chips. |
| **Section VIII** | **Robustness and Sensitivity Analysis** | **Yes** | `RobustnessSection.tsx` | |
| ↳ VIII-A | Random Seed Stability (5 seeds: 7, 21, 42, 84, 123) | **Yes** | `RobustnessSection.tsx` | Range (0.8389–0.8421), mean 0.8404, std 0.0012 present. |
| ↳ VIII-B | Class-Weighting Sensitivity (Balanced vs Unweighted) | **Yes** | `RobustnessSection.tsx` | Metric delta table and methodological rationale present. |
| **Section IX** | **Discussion** (Educational implications, proactive advising) | **Partial** | `DiscussionSection.tsx` | High-level takeaway cards present; verbatim academic narrative missing. |
| **Section X** | **Limitations** (5 manuscript limitations) | **Yes** | `DiscussionSection.tsx` | 5 manuscript limitations present, plus website audit note #6. |
| **Section XI** | **Conclusion** (Summary of findings, future multi-institution work) | **No** | None | **Major Gap**: Section XI missing entirely. |
| **References** | 30 bibliographic references | **Yes** | `ResourcesSection.tsx` | All 30 references present with external DOI / arXiv links. |

---

## 3. Figures Audit (Fig. 1 – Fig. 12)

| Figure # | Manuscript Description | Present on Site? | Current Site Implementation | Missing Elements / Required Action |
| :---: | :--- | :---: | :--- | :--- |
| **Fig. 1** | Study workflow flowchart (leakage-safe prep &rarr; scenarios &rarr; grouped split &rarr; comparison &rarr; threshold &rarr; holdout &rarr; XAI/subgroups) | **Partial** | `ProblemApproach.tsx` (Interactive 9-step grid) | Rebuilt as modern responsive interactive flow; paper figure graphic / exact flowchart absent. |
| **Fig. 2** | Outcome distribution pie / donut of 32,593 enrollments | **Yes** | `DatasetSection.tsx` | Rebuilt as responsive SVG chart showing exact counts and percentages (47.20% vs 52.80%). |
| **Fig. 3** | Leakage-safe temporal design (Day 0 &rarr; Day 30 cutoff &rarr; course end; S0, S1, S2 vs quarantined data) | **Yes** | `LeakageDesign.tsx` | Rebuilt as detailed interactive SVG / Tailwind timeline component. |
| **Fig. 4** | **Sigmoid link of Eq. (3)** showing decision threshold $\sigma(z) \ge \theta$ | **No** | None | **Missing**: Logistic curve showing mapping from log-odds to risk probability and operating point $\theta^*=0.45$. |
| **Fig. 5** | **Holdout metrics bar chart** computed from confusion matrix (Recall in green; error rates in red) | **No** | None | **Missing**: Comparative bar chart of confusion matrix derived rates. |
| **Fig. 6** | **$F_1$-score metric surface / trade-off curves** as a function of recall for fixed precision values | **No** | None | **Missing**: Trade-off contours of Eq. (7) showing precision-recall iso-curves. |
| **Fig. 7** | **Per-observation quadratic Brier loss** curve $(p_i - y_i)^2$ | **No** | None | **Missing**: Parabolic loss curve illustrating penalty structure for probabilistic predictions. |
| **Fig. 8** | **Feasible region chart** of threshold rule in Eq. (12) (Recall $\ge 0.82$, Precision $\ge 0.70$) | **No** | None | **Missing**: Threshold trajectory plot displaying feasible vs infeasible threshold intervals on validation set. |
| **Fig. 9** | Incremental validation ROC-AUC gains (+0.1384 S0&rarr;S1, +0.0833 S1&rarr;S2, cumulative +0.2217) | **Yes** | `ResultsSection.tsx` | Rebuilt as interactive SVG bar chart with scenario cards and derived table. |
| **Fig. 10** | Holdout confusion matrix of primary model (TP=2127, FN=455, FP=721, TN=1586) | **Yes** | `ResultsSection.tsx` | Rebuilt as interactive $2\times 2$ grid with live metric recalculations and tooltips. |
| **Fig. 11** | SHAP attribution by feature family (Static 34.17%, Academic 33.22%, VLE 32.61%, Dynamic 65.83%) | **Yes** | `ExplainabilitySection.tsx` | Rebuilt as custom SVG family share breakdown chart. |
| **Fig. 12** | Descriptive subgroup At-Risk recall at $\theta^*=0.45$ on holdout across 5 attributes | **Yes** | `SubgroupsSection.tsx` | Rebuilt as interactive stratified bar chart. |

---

## 4. Tables Audit (Tables I – VI)

| Table # | Manuscript Description | Present on Site? | Current Site Implementation | Parity Status |
| :---: | :--- | :---: | :--- | :---: |
| **Table I** | Outcome distribution of binary target (Pass 12,361, Distinction 3,024, Withdrawn 10,156, Fail 7,052) | **Yes** | `DatasetSection.tsx` | **100% Match** |
| **Table II** | Summary of temporal information scenarios (S0 13 features, S1 21 features, S2 29 raw / 68 encoded) | **Yes** | `LeakageDesign.tsx` | **100% Match** |
| **Table III** | Holdout test set confusion matrix ($2\times 2$ counts, totals) | **Yes** | `ResultsSection.tsx` | **100% Match** |
| **Table IV** | Holdout performance of primary model (ROC-AUC, PR-AUC, Accuracy, Recall, Precision, F1, Specificity, FPR, FNR, Brier with 95% CIs) | **Yes** | `ResultsSection.tsx` | **100% Match** |
| **Table V** | Feature family SHAP attribution summary (shares, percentages) | **Yes** | `ExplainabilitySection.tsx` | **100% Match** |
| **Table VI** | Descriptive subgroup evaluation across demographic and academic strata | **Yes** | `SubgroupsSection.tsx` | **100% Match** |

---

## 5. Mathematical Equations Audit (Eq. 1 – Eq. 12)

| Eq. # | Mathematical Formulation | Present on Site? | Missing / Required Action |
| :---: | :--- | :---: | :--- |
| **(1)** | $u = (\text{code\_module}, \text{code\_presentation}, \text{id\_student})$ | **No** | Add KaTeX rendering in Dataset / Methodology section. |
| **(2)** | Binary outcome mapping: $y_u \in \{0, 1\}$ | **No** | Add KaTeX rendering in Dataset / Problem Formulation section. |
| **(3)** | Sigmoid link function: $\sigma(z) = \frac{1}{1 + e^{-z}}$ | **No** | Add KaTeX rendering alongside Fig. 4. |
| **(4)** | $\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}$ | **No** | Add KaTeX rendering in metrics definition. |
| **(5)** | $\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}$ | **No** | Add KaTeX rendering in metrics definition. |
| **(6)** | $\text{Specificity} = \frac{\text{TN}}{\text{TN} + \text{FP}}$ | **No** | Add KaTeX rendering in metrics definition. |
| **(7)** | $F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$ | **No** | Add KaTeX rendering alongside Fig. 6. |
| **(8)** | $\text{Accuracy} = \frac{\text{TP} + \text{TN}}{\text{TP} + \text{TN} + \text{FP} + \text{FN}}$ | **No** | Add KaTeX rendering in metrics definition. |
| **(9)** | $\text{FPR} = \frac{\text{FP}}{\text{FP} + \text{TN}}$ | **No** | Add KaTeX rendering in metrics definition. |
| **(10)** | $\text{FNR} = \frac{\text{FN}}{\text{TP} + \text{FN}}$ | **No** | Add KaTeX rendering in metrics definition. |
| **(11)** | $\text{BS} = \frac{1}{N} \sum_{i=1}^N (p_i - y_i)^2$ | **No** | Add KaTeX rendering alongside Fig. 7. |
| **(12)** | $\theta^* = \arg\min_{\theta \in [0.10, 0.90]} \|\text{Recall}_{\text{val}}(\theta) - 0.82\|$ s.t. $\text{Precision}_{\text{val}}(\theta) \ge 0.70$ | **Partial** (monospace text) | Render formal KaTeX mathematical optimization notation. |

---

## 6. Synthesis of Implementation Actions

To achieve complete paper parity, the upcoming phases will address:
1. **Full Text Ingestion (`paper_text.ts`)**: Ingest complete sections (Abstract, Index Terms, I, II, III, IV, V, VI, VII, VIII, IX, X, XI) into structured typescript data without paraphrasing.
2. **Missing Figures**: Recreate or extract Figures 4, 5, 6, 7, and 8 with downloadable assets, captions, and text alternatives.
3. **Formal Mathematics**: Install KaTeX and render Equations (1) through (12).
4. **Dual-Mode Paper View**: Build an IEEE-styled reader tab alongside the interactive dashboard.
5. **Full Traceability**: Integrate provenance chips, downloadable CSVs for all 6 tables, and a claims ledger.

