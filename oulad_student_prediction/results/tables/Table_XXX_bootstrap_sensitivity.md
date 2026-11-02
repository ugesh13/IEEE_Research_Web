# Table XXX: Resampling Methodology Sensitivity Analysis

### Methodological Comparison: Student-Level Block Cluster Bootstrap vs. Observation-Level Bootstrap ($B = 1,000$ Resamples, Random Seed = 42)

*Methodological Statement: This sensitivity analysis evaluates whether treating course presentations as independent units of observation (observation-level bootstrap) introduces artificial precision relative to resampling clustered at the student level (student-level cluster bootstrap). In the test set, $4,318$ unique students generate $4,889$ course presentations. The student-level block cluster bootstrap remains the preferred, methodologically authoritative uncertainty standard for all primary study conclusions.*

| Evaluation Metric | Point Estimate (Frozen) | Student Cluster Bootstrap 95% CI (Preferred Standard) | Cluster CI Width | Observation-Level Bootstrap 95% CI | Observation CI Width | Width Ratio (Obs / Cluster) | Methodological Impact of Clustering |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **ROC-AUC** | **0.8406** | **[0.8298, 0.8512]** | 0.0214 | [0.8304, 0.8506] | 0.0202 | 94.4% | Observation bootstrap underestimates width by 5.6% |
| **PR-AUC (Average Precision)** | **0.8459** | **[0.8348, 0.8567]** | 0.0219 | [0.8354, 0.8561] | 0.0207 | 94.5% | Observation bootstrap underestimates width by 5.5% |
| **Overall Accuracy** | 0.7595 | [0.7472, 0.7715] | 0.0243 | [0.7478, 0.7709] | 0.0231 | 95.1% | Observation bootstrap underestimates width by 4.9% |
| **At-Risk Recall (Sensitivity)** | **0.8238** | **[0.8089, 0.8382]** | 0.0293 | [0.8095, 0.8378] | 0.0283 | 96.6% | Observation bootstrap underestimates width by 3.4% |
| **At-Risk Precision (PPV)** | 0.7468 | [0.7308, 0.7624] | 0.0316 | [0.7314, 0.7618] | 0.0304 | 96.2% | Observation bootstrap underestimates width by 3.8% |
| **At-Risk F1-Score** | **0.7834** | **[0.7721, 0.7944]** | 0.0223 | [0.7728, 0.7938] | 0.0210 | 94.2% | Observation bootstrap underestimates width by 5.8% |
| **Brier Calibration Score** | 0.1638 | [0.1565, 0.1712] | 0.0147 | [0.1569, 0.1707] | 0.0138 | 93.9% | Observation bootstrap underestimates width by 6.1% |

---

### Methodological Insights & Statistical Interpretation:

1. **Empirical Confirmation of Uncertainty Underestimation**:
   Across all seven evaluated metrics, the naive observation-level bootstrap produces narrower confidence intervals than the student cluster bootstrap, spanning only **$93.9\%$ to $96.6\%$** of the cluster interval width. Treating repeated module attempts by the same student as independent observations falsely inflates the effective sample size, leading to an artificially deflated standard error of $3.4\%$ to $6.1\%$.
2. **Preferred Uncertainty Estimation**:
   The student-level cluster bootstrap was retained as the preferred uncertainty estimation method because it accounts for the dependence induced by multiple course presentations from the same student. Resampling entire student blocks (`id_student`) accommodates intra-student clustering across the 4,889 presentations from 4,318 students.
3. **Substantive Robustness of Primary Findings**:
   Importantly, the substantive empirical conclusions of the study are identical under both resampling schemes:
   - At-Risk Recall lower bound remains firmly above $80.8\%$ ($80.89\%$ cluster vs $80.95\%$ observation).
   - ROC-AUC lower bound remains strictly above $0.829$ ($0.8298$ cluster vs $0.8304$ observation).
   - At-Risk Precision lower bound remains above $73.0\%$ ($73.08\%$ cluster vs $73.14\%$ observation).
   This confirms that the study's primary claims do not depend on narrow statistical technicalities.
