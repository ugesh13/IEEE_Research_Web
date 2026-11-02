# Table XXVIII: Classification Decision Threshold Sensitivity Analysis

### Operating Characteristics of Frozen Primary Model ($S_2$ Gradient Boosting) Across Holdout Test Set ($N = 4,889$ observations, $4,318$ unique students)

*Methodological Statement: Decision threshold sensitivity is evaluated strictly to document the empirical operating trade-offs of the frozen probability outputs. The test partition was NOT used to select the operational threshold. The operational threshold $\theta^* = 0.45$ was selected strictly on validation data during Phase 12 ($N = 4,890$), while $\theta = 0.50$ serves as the conventional baseline benchmark. No threshold is declared a superior replacement for the locked operational standard.*

| Threshold ($\theta$) | Overall Accuracy | At-Risk Recall (Sensitivity) | At-Risk Precision (PPV) | At-Risk F1-Score | Specificity (TNR) | False Positive Rate (FPR) | False Negative Rate (FNR) | True Positives (TP) | False Negatives (FN) | True Negatives (TN) | False Positives (FP) | Operational Decision Characterization |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 0.20 | 68.58% | 95.86% | 63.40% | 0.7632 | 38.06% | 61.94% | 4.14% | 2,475 | 107 | 878 | 1,429 | Ultra-High Recall / Severe False-Alarm Burden |
| 0.25 | 71.10% | 93.92% | 65.88% | 0.7744 | 45.56% | 54.44% | 6.08% | 2,425 | 157 | 1,051 | 1,256 | High Sensitivity / Intensive Resource Demands |
| 0.30 | 72.98% | 91.60% | 68.19% | 0.7818 | 52.19% | 47.81% | 8.40% | 2,365 | 217 | 1,204 | 1,103 | Proactive Early-Intervention Regime |
| 0.35 | 74.58% | 88.50% | 70.72% | 0.7862 | 58.99% | 41.01% | 11.50% | 2,285 | 297 | 1,361 | 946 | Broad Advising Coverage Corridor |
| 0.40 | 75.58% | 85.48% | 72.93% | 0.7871 | 64.50% | 35.50% | 14.52% | 2,207 | 375 | 1,488 | 819 | High-Coverage Trade-Off Point |
| **0.45** | **75.95%** | **82.38%** | **74.68%** | **0.7834** | **68.75%** | **31.25%** | **17.62%** | **2,127** | **455** | **1,586** | **721** | **Primary Operational Threshold (Locked $\theta^*$)** |
| 0.50 | 76.19% | 80.60% | 75.84% | 0.7814 | 71.26% | 28.74% | 19.40% | 2,081 | 501 | 1,644 | 663 | Conventional Default Benchmark Threshold |
| 0.55 | 76.11% | 76.22% | 78.03% | 0.7712 | 75.99% | 24.01% | 23.78% | 1,968 | 614 | 1,753 | 554 | Conservative Outreach Threshold |
| 0.60 | 75.58% | 70.76% | 80.63% | 0.7537 | 80.97% | 19.03% | 29.24% | 1,827 | 755 | 1,868 | 439 | Precision-Weighted Advising Caseload |
| 0.65 | 74.64% | 65.41% | 82.96% | 0.7315 | 84.96% | 15.04% | 34.59% | 1,689 | 893 | 1,960 | 347 | Selective Targeted Caseload |
| 0.70 | 73.06% | 59.26% | 85.24% | 0.6996 | 88.51% | 11.49% | 40.74% | 1,530 | 1,052 | 2,042 | 265 | High-Confidence Failure Intervention |
| 0.75 | 70.87% | 52.25% | 87.60% | 0.6545 | 91.72% | 8.28% | 47.75% | 1,349 | 1,233 | 2,116 | 191 | Highly Constrained Institutional Resource Regime |
| 0.80 | 67.99% | 44.38% | 89.88% | 0.5942 | 94.41% | 5.59% | 55.62% | 1,146 | 1,436 | 2,178 | 129 | Minimal False Alarm / Extreme Precision Regime |

---

### Key Analytical Findings:

1. **Monotonic Operating Continuum**:
   As the classification threshold $\theta$ spans from $0.20$ to $0.80$, At-Risk Recall exhibits a smooth, monotonic decrease from $95.86\%$ ($2,475$ captured students) down to $44.38\%$ ($1,146$ captured students). Simultaneously, At-Risk Precision monotonically climbs from $63.40\%$ to $89.88\%$, and Specificity advances from $38.06\%$ to $94.41\%$.
2. **Comparison of Locked Operational ($\theta^* = 0.45$) vs Conventional Benchmark ($\theta = 0.50$)**:
   - At $\theta^* = 0.45$, the model achieves **$82.38\%$ Recall** and **$74.68\%$ Precision** ($F_1 = 0.7834$), capturing $2,127$ true at-risk students and missing $455$ ($FNR = 17.62\%$).
   - At $\theta = 0.50$, Recall drops to **$80.60\%$** while Precision rises slightly to **$75.84\%$** ($F_1 = 0.7814$), missing $501$ at-risk students ($FNR = 19.40\%$).
   - **Net Clinical/Institutional Gain**: Lowering the threshold to $\theta^* = 0.45$ captures **$46$ additional at-risk students** ($2,127$ vs $2,081$), reducing the missed failure rate by $1.78$ percentage points ($17.62\%$ vs $19.40\%$) at the modest cost of $58$ additional advisory alerts ($721$ vs $663$). This validates the operational utility of the pre-specified threshold constraint (Recall $\ge 82\%$, Precision $\ge 70\%$).
3. **Broad $F_1$ Corridor Stability**:
   The F1-score remains relatively stable across thresholds from 0.35 to 0.50, indicating that modest changes in the operating threshold produce limited changes in the balance between precision and recall.
