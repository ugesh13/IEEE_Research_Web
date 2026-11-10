# OULAD Student Performance Prediction — Research Results Website

Official research results presentation website for the empirical study:  
**"Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)"**  
*Authored by Ugesh Kumar and Riya Sharma*  
*Department of Computer Science and Engineering, JAIN (Deemed-to-be University), Bengaluru, India*  
*(Manuscript under review for IEEE Transactions on Artificial Intelligence)*

---

## 1. Project Purpose & Scope

This website was built for faculty review and academic evaluation. It presents all findings, experimental designs, leakage containment gates, validation progressions, holdout confusion matrices, game-theoretic SHAP attributions, and descriptive subgroup evaluations reported in the manuscript.

### Strict Scientific Reporting Rules
1. **Single Source of Truth**: All result numbers displayed on this website are read directly or derived via visible arithmetic from `src/data/paper_results.json`.
2. **Explicit Labeling**: All metrics are labeled *"as reported in the manuscript"*.
3. **Non-Causal Interpretation**: Attributions convey predictive association, not causal mechanisms. Artificially increasing click activity will not induce course mastery.
4. **Descriptive Subgroups**: Subgroup performance is reported descriptively under a common operational threshold (θ* = 0.45) and does not constitute normative fairness conclusions.
5. **Leakage Containment**: Information is strictly quarantined to Day &le; 30 of the course presentation. Post-cutoff clicks, unregistration dates, and examinations are excluded.

---

## 2. Technology Stack

- **Framework**: React 18 + TypeScript + Vite 6
- **Styling**: Tailwind CSS with dark mode support (`dark:` classes with system auto-detection and persistent toggle)
- **Visualizations**: Hand-crafted, responsive, keyboard-accessible SVG charts with semantic `role="img"`, `<title>`, and high contrast
- **Rendering**: Static site pre-rendering (`scripts/prerender.mjs`) for sub-second load times and zero-JavaScript fallback
- **Integrity Verification**: Automated number-integrity suite (`scripts/check-numbers.mjs`) executed via `npm run check:numbers`

---

## 3. Getting Started Locally

### Prerequisites
- Node.js &ge; 18.0.0
- npm &ge; 9.0.0

### Installation
```bash
cd website
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```
The build command executes:
1. TypeScript compilation check (`tsc`)
2. Client asset bundling (`vite build`)
3. SSR bundle generation (`vite build --ssr`)
4. Full semantic HTML pre-rendering into `dist/index.html` (`node scripts/prerender.mjs`)

### Number-Integrity Audit
```bash
npm run check:numbers
```
Verifies that:
- Every metric recomputes exactly from the confusion matrix within rounding tolerance
- All result-like numbers match `paper_results.json` or the academic citation allow-list
- Prohibited hype words and inconsistent strings (`"157"`, `"verified"`, `"reproducible"`, `"100%"`) are strictly absent

---

## 4. Deployment on Vercel

The project is structured for zero-configuration deployment on Vercel:

1. **Root Directory**: `website`
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Configuration**: Pre-configured in `vercel.json` with SPA routing rewrites:
```json
{
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

To deploy via Vercel CLI:
```bash
cd website
npx vercel
```

---

## 5. Website Sections

1. **Hero**: Title, authors, institutional affiliation, one-sentence summary, headline metric cards (ROC-AUC 0.8406, At-Risk Recall 82.38%, F1 0.7834) with 95% CIs, and the non-causal scope notice.
2. **Problem & Approach**: 9-step study workflow diagram from raw OULAD tables to final post-hoc audits.
3. **Dataset**: 32,593 enrollments, 28,785 students, 11.7% repeat-enrollment rate, table record counts, and SVG outcome breakdown (Pass, Distinction, Withdrawn, Fail; Successful vs At-Risk).
4. **Leakage-Safe Design**: Day 0 &rarr; Day 30 &rarr; End timeline, allowed vs quarantined data comparison, and nested scenarios (S0 13/52, S1 21/60, S2 29/68).
5. **Experimental Design**: Student-level grouped partitions (Train 70%, Validation 15%, Holdout 15%; Seed 42, 0 student overlap) and model parameter specifications.
6. **Results**:
   - Validation ROC-AUC gains bar chart (S0&rarr;S1 +0.1384, S1&rarr;S2 +0.0833, cumulative +0.2217)
   - Interactive holdout confusion matrix (TP=2,127, FN=455, FP=721, TN=1,586) with cell hover explanations
   - Metrics table with 95% CIs and a "Show Formula" toggle verifying mathematical derivation directly in the browser
   - Threshold card (θ* = 0.45, validation maximum selection rule)
7. **Explainability**: SHAP family shares (Academic 33.22%, VLE 32.61%, Static 34.17%, Combined Dynamic 65.83%), top 4 raw predictors, and non-causal caveat.
8. **Subgroups**: Stratified At-Risk Recall bar chart, Declared Disability FPR comparison (30.55% vs 39.25%), and descriptive disclaimer.
9. **Robustness**: 5 partition seeds tested (`7, 21, 42, 84, 123`), class-weighted sensitivity (specificity 68.75% &rarr; 65.31%), and final unweighted probability decision.
10. **Discussion & Limitations**: Authoritative discussion points and methodological caveats from the manuscript.
11. **Resources & References**: Manuscript PDF link (`/paper.pdf`), GitHub repository link, 30 clickable verified references, and BibTeX/IEEE citation blocks.
- **Footer**: *"All values are those reported in the manuscript (Kumar & Sharma, 2026)."*

---

## 6. Citation

```bibtex
@article{kumar2026oulad,
  author    = {Kumar, Ugesh and Sharma, Riya},
  title     = {Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)},
  journal   = {IEEE Transactions on Artificial Intelligence},
  year      = {2026},
  volume    = {XX},
  number    = {XX},
  pages     = {1--10},
  note      = {Manuscript under review}
}
```

