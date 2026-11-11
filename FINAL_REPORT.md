# FINAL REPORT: 10-PHASE WEBSITE UPGRADE & PAPER PARITY AUDIT

**Target Project**: OULAD Student Performance Prediction Website (`website/`)  
**Associated Manuscript**: *"Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)"* (Ugesh Kumar & Riya Sharma, 2026)  
**Status**: UPGRADE COMPLETE & PASSING ALL QA CHECKS (Ready for Deployment)  
**Deployment Boundary**: Changes kept in working tree; no branch changes, no git push, no deployment executed without user direction.

---

## 1. Executive Summary & Phase-by-Phase Review

### Phase 0: Complete Manuscript Audit (No Code Changes)
- **Objective**: Perform a comprehensive structural audit comparing the manuscript PDF (`public/paper.pdf` / `paper/Student_performance_perdiction_IEEE_Final.md`) against the interactive website.
- **Findings**:
  - All 11 main sections, subsections, 6 tables, 12 figures, 12 mathematical equations, and 30 academic citations were mapped.
  - Gaps identified: Full prose for Sections I, II, X, XI was absent from the site; Figures 4–8 were missing; equations lacked KaTeX formatting; CSV table exports were missing; Claims Ledger and Reproduction Status sections were needed.
- **Artifact**: Produced [`COVERAGE.md`](file:///c:/Users/ugesh/Desktop/College/College%20Files/CSBS_3rd_%20semester/Design%20thinking/Research/Anitgravity-Research-Paper/COVERAGE.md) detailing the item-by-item status.

### Phase 1: Paper-Parity Content & Verbatim Corpus
- **Objective**: Add verbatim paper text to the codebase and add IEEE Roman numeral designations to interactive section badges.
- **Changes**:
  - Created `website/src/data/paper_text.ts` housing the complete, unabridged manuscript prose (4,338 words: Abstract, Index Terms, Sections I–XI, and all 30 references).
  - Updated all 10 component badges across the interactive view (`Section III · Section 3`, `Section IV · Section 4`, `Section V · Section 5`, `Section VI · Section 6`, `Section VII · Section 7`, `Section VII-A · Section 8`, `Section VIII · Section 9`, `Section IX & X · Section 10`, `Section XI & References · Section 11`, `Workflow (Fig. 1) · Section 2`).

### Phase 2: Figures, Tables & Mathematical Equations
- **Objective**: Implement KaTeX rendering, standalone SVG figures with download actions, and CSV download capabilities for manuscript tables.
- **Changes**:
  - Installed `katex` and `@types/katex`, imported `katex/dist/katex.min.css` in `index.css`.
  - Built `website/src/components/MathView.tsx` supporting block and inline KaTeX rendering for Equations (1) through (12).
  - Built `website/src/components/PaperFigures.tsx` providing crisp, accessible SVG graphics for:
    - **Figure 4**: Sigmoid Link Function ($p = \sigma(z)$ with $\theta^* = 0.45$ operating cut).
    - **Figure 5**: Primary Holdout Performance Metrics bar chart.
    - **Figure 6**: $F_1$ vs. Recall Trade-off across classification thresholds.
    - **Figure 7**: Probabilistic Calibration and Brier Loss Parabola ($Brier = 0.1638$).
    - **Figure 8**: Feasible Threshold Region ($\theta \in [0.38, 0.46]$).
    - Added SVG download buttons and accessibility ARIA descriptions for each figure.
  - Built `website/src/utils/csvExport.ts` adding one-click CSV export buttons for Tables I through VI directly from `paper_results.json`.

### Phase 3: Single-Column IEEE Paper View & Citation Graph
- **Objective**: Provide a faithful, clean, single-column IEEE article view alongside the interactive dashboard.
- **Changes**:
  - Built `website/src/components/PaperView.tsx` rendering the manuscript in classic academic article format with two-column style abstract, keyword chips, full section hierarchy, inline KaTeX equations, embedded figures, tables with CSV export, and clickable `[n]` citation superscripts linking directly to the reference list with bidirectional return links.
  - Added "Copy IEEE Citation", "Copy BibTeX", and "Download PDF" actions.
  - Added view toggle (`Interactive View` vs. `Paper View`) in `Navbar.tsx` and `App.tsx`.

### Phase 4: Traceability & Claims Ledger
- **Objective**: Provide an audit ledger tying every numerical claim to its exact manuscript provenance.
- **Changes**:
  - Built `website/src/components/ClaimsLedger.tsx` auditing:
    - Headline Holdout Metrics (ROC-AUC 0.8406, Recall 82.38%, Precision 74.68%, F1 0.7834, Brier 0.1638).
    - Asymmetric Threshold Selection Rule ($\theta^* = 0.45$).
    - SHAP Attribution Shares (Academic 33.22%, VLE 32.61%, Static 34.17%, Dynamic 65.83%).
    - Derived Feature Increment AUCs ($S_0 \rightarrow S_1 \rightarrow S_2$).
    - Day-30 Early Withdrawal Sensitivity Audit (holdout $N=4,859$ local run).
  - Integrated provenance badges (`Manuscript Table`, `Derived`, `Repo Supplement`, `Website Note`).
  - Added pre-build script `"check": "tsc --noEmit && node scripts/check-numbers.mjs"` in `package.json`.

### Phase 5: Threats to Validity & Judge's FAQ
- **Objective**: Fully document methodological limitations, sensitivity boundaries, and answers to rigorous academic queries.
- **Changes**:
  - Updated `website/src/components/DiscussionSection.tsx`:
    - Inserted **Threats to Validity** card detailing:
      1. Early-unregistration dependence (756 enrollments withdrawn by Day 30; AUC drops $0.8487 \rightarrow 0.7931$ when excluded).
      2. Holdout used for robustness checks (seed sensitivity and class-weighting evaluated on holdout as sensitivity analyses, not tuning).
      3. Selection rule written after validation inspection.
      4. Absence of per-fold CV metrics in manuscript.
      5. SHAP recomputation divergence on local split.
    - Inserted **Judge's FAQ** answering:
      - *Why $\theta^* = 0.45$?* (Balancing early intervention capacity against institutional fatigue).
      - *Why include students who withdrew early?* (Reflects administrative reality while acknowledging that 756 early withdrawals are deterministic).
      - *Why do supplementary SHAP shares differ?* (Split discrepancy and log-odds vs probability explainer scaling).
      - *Why are baseline CV results missing from the manuscript?* (Manuscript reported validation set single-splits).
    - Appended Limitation #6 regarding the 756 early unregistrations.

### Phase 6: Reproducibility Root-Cause Diagnosis
- **Objective**: Mathematically diagnose the split discrepancy between the manuscript ($22,815 / 4,889 / 4,889$) and the local repository run ($22,859 / 4,875 / 4,859$).
- **Findings**:
  - Both splits contain **identical unique student counts**: exactly 20,149 train / 4,318 validation / 4,318 holdout students.
  - The observation differences ($+44$ train, $-14$ validation, $-30$ holdout) are strictly explained by multi-course repeat student clustering (11.7% repeat rate) under different `StratifiedShuffleSplit` student-grouping implementations.
- **Artifact**: Produced [`REPRO_REPORT.md`](file:///c:/Users/ugesh/Desktop/College/College%20Files/CSBS_3rd_%20semester/Design%20thinking/Research/Anitgravity-Research-Paper/REPRO_REPORT.md).

### Phase 7: Reproduction Status Section
- **Objective**: Expose the replication findings and audit command directly on the website for peer review transparency.
- **Changes**:
  - Built `website/src/components/ReproductionSection.tsx`:
    - Displays non-regeneration disclosure prominently.
    - Documents the execution command: `python oulad_student_prediction/src/verify_all_claims.py`.
    - Features a 5-dimension reproduction parity table comparing the manuscript against local re-runs.

### Phase 8: Polish, Accessibility & Judge's 60-Second Brief
- **Objective**: Create an executive summary for reviewers, ensure WCAG 2.1 AA accessibility, and configure print media.
- **Changes**:
  - Built `website/src/components/JudgesSummary.tsx` with a high-impact 60-second reviewer card covering:
    - The Question (Day-30 early warning).
    - The Data (OULAD 32,593 enrollments / 28,785 students across 7 STEM modules).
    - The Operating Rule ($\theta^* = 0.45$).
    - Headline Numbers ($AUC = 0.8406$, Recall $= 82.38\%$, $F_1 = 0.7834$).
    - The Core Limitation (Sensitivity to 756 early unregistrations).
  - Added print styles (`@media print`) and WCAG-compliant high-contrast `:focus-visible` styling with skip links in `website/src/index.css`.

### Phase 9: Performance, Security & Numerical Integrity QA
- **Objective**: Comprehensive test pass across the entire build, script audit suite, and prohibited vocabulary scanner.
- **Results**:
  - `npm run check:numbers`: **PASSED 100%** (598 number tokens audited, 0 mismatches, exact confusion matrix parity).
  - `npm run build`: **PASSED 100%** (Vite + SSR prerender generated 254,364 characters of semantic HTML).
  - Grep audit for prohibited marketing terms: **0 hits** across the built distribution.

---

## 2. Quantitative Metrics & Build Statistics

| Metric | Measurement |
| :--- | :--- |
| **Total Files Modified / Created** | 24 files (14 modified, 10 created) |
| **Prerendered HTML Word Count** | 5,650 words (comprehensive academic text) |
| **Verbatim Paper Corpus** | 4,338 words (`paper_text.ts`) |
| **Audited Number Tokens** | 598 numerical tokens checked against `paper_results.json` (0 errors) |
| **Production Bundle Size** | JS: 673.95 KB, CSS: 77.58 KB |
| **Total Asset Chunks** | 62 assets (includes KaTeX mathematical font woff2/woff subsets) |
| **Forbidden Term Occurrences** | 0 occurrences across all built production artifacts |

---

## 3. Grounded Numerical Parity Ledger

All numbers displayed in the application match the manuscript and `paper_results.json` without exception:

| Concept / Metric | Manuscript Value | Source of Truth | Web Status |
| :--- | :---: | :---: | :---: |
| **Holdout Enrollments ($N$)** | $4,889$ | `results.holdout.metrics.n_eval_records.value` | Grounded |
| **Holdout Unique Students** | $4,318$ | `results.holdout.metrics.n_unique_students.value` | Grounded |
| **Operational Threshold ($\theta^*$)** | $0.45$ | `results.holdout.operating_threshold.value` | Grounded |
| **Holdout ROC-AUC** | $0.8406$ $[0.8298, 0.8512]$ | `results.holdout.metrics.roc_auc.value` | Grounded |
| **Holdout Recall ($At\text{-}Risk$)** | $82.38\%$ $[80.89\%, 83.82\%]$ | `results.holdout.metrics.at_risk_recall_pct.value` | Grounded |
| **Holdout Precision ($At\text{-}Risk$)** | $74.68\%$ $[73.07\%, 76.24\%]$ | `results.holdout.metrics.at_risk_precision_pct.value` | Grounded |
| **Holdout $F_1$-Score** | $0.7834$ $[0.7721, 0.7944]$ | `results.holdout.metrics.f1.value` | Grounded |
| **Holdout Brier Calibration Score** | $0.1638$ $[0.1582, 0.1695]$ | `results.holdout.metrics.brier.value` | Grounded |
| **Confusion Matrix: TP / FN** | $2,127$ / $455$ | `results.holdout.confusion_matrix.TP / FN` | Grounded |
| **Confusion Matrix: FP / TN** | $721$ / $1,586$ | `results.holdout.confusion_matrix.FP / TN` | Grounded |
| **Academic Feature Share** | $33.22\%$ | `results.shap_feature_importance.summary_family_shares_pct.academic_assessments` | Grounded |
| **VLE Engagement Share** | $32.61\%$ | `results.shap_feature_importance.summary_family_shares_pct.vle_engagement` | Grounded |
| **Intake / Static Share** | $34.17\%$ | `results.shap_feature_importance.summary_family_shares_pct.student_intake_demographics` | Grounded |
| **Dynamic Feature Share** | $65.83\%$ | Derived: $33.22\% + 32.61\%$ | Grounded |

---

## 4. Remaining Disclosures & Open Notes

1. **Split Variation Disclosure**:
   The local repository run partition is $22,859$ train / $4,875$ validation / $4,859$ holdout, whereas the final manuscript tables reflect $22,815$ train / $4,889$ validation / $4,889$ holdout. The student count is identical ($4,318$ holdout students). This is explicitly declared at the top of the Supplementary section, in the Claims Ledger, in the Reproduction Section, and in `REPRO_REPORT.md`.
2. **Day-30 Early-Unregistration Dependence**:
   Excluding the 756 students who withdrew on or before Day 30 lowers ROC-AUC from $0.8487 \rightarrow 0.7931$ and Recall from $76.12\% \rightarrow 67.24\%$ in the local audit run. This boundary is highlighted prominently in the Executive Summary, the Threats to Validity card, Limitation #6, and the Judge's FAQ.
3. **SHAP Recomputation Scaling**:
   On the local re-run, SHAP family shares are $32.72\%$ Academic, $26.48\%$ VLE, and $40.80\%$ Static ($59.20\%$ dynamic). This is shown side-by-side with the manuscript shares ($33.22\% / 32.61\% / 34.17\%$) in the Supplementary section with explicit provenance labeling.

---

## 5. Deployment Recommendation

### **RECOMMENDATION: GO FOR DEPLOYMENT**
- **Clean Compilation**: 0 build errors, 0 lint/type issues (`tsc --noEmit` clean).
- **Number Integrity**: 598 checked tokens with 0 mismatches.
- **Strict Compliance**: No forbidden promotional terms; 100% adherence to academic review guidelines.
- **User Instruction Boundary**: All edits are staged in the local working tree. No branches were modified, no remote `git push` was performed, and no deployment was triggered.
