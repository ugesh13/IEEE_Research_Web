# Table XV: Cross-Validation and Validation Set Performance Comparison

### Model Performance across Scenarios under Student-Grouped 5-Fold Cross-Validation and Reserved Validation Set ($N = 4,889$)

| Scenario | Model Family | 5-Fold CV ROC-AUC: Mean ± SD [Approx. 95% Fold Interval] | 5-Fold CV Macro-F1: Mean ± SD | Val Accuracy | Val ROC-AUC | Val PR-AUC | Val At-Risk Recall | Val At-Risk Precision | Val At-Risk F1 | Val Brier Score |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **S0 (Intake)** | Logistic Regression | 0.6092 ± 0.0039 [0.6058, 0.6126] | 0.5876 ± 0.0031 | 0.5895 | 0.6104 | 0.6042 | 0.6497 | 0.6032 | 0.6256 | 0.2412 |
| **S0 (Intake)** | Random Forest | 0.6044 ± 0.0040 [0.6009, 0.6079] | 0.5822 ± 0.0030 | 0.5836 | 0.6052 | 0.5986 | 0.6401 | 0.5988 | 0.6187 | 0.2428 |
| **S0 (Intake)** | Gradient Boosting | 0.6196 ± 0.0042 [0.6159, 0.6233] | 0.5935 ± 0.0033 | 0.5971 | 0.6208 | 0.6145 | 0.6567 | 0.6099 | 0.6325 | 0.2385 |
| **S1 (Academic)** | Logistic Regression | 0.7376 ± 0.0043 [0.7338, 0.7414] | 0.6793 ± 0.0037 | 0.6828 | 0.7389 | 0.7365 | 0.7303 | 0.6880 | 0.7085 | 0.2078 |
| **S1 (Academic)** | Random Forest | 0.7473 ± 0.0044 [0.7434, 0.7512] | 0.6849 ± 0.0037 | 0.6897 | 0.7485 | 0.7468 | 0.7373 | 0.6940 | 0.7150 | 0.2035 |
| **S1 (Academic)** | Gradient Boosting | 0.7580 ± 0.0045 [0.7541, 0.7619] | 0.6959 ± 0.0038 | 0.7012 | 0.7592 | 0.7578 | 0.7482 | 0.7042 | 0.7255 | 0.1982 |
| **S2 (Behavioral)**| Logistic Regression | 0.8154 ± 0.0045 [0.8115, 0.8193] | 0.7391 ± 0.0037 | 0.7441 | 0.8168 | 0.8220 | 0.7865 | 0.7436 | 0.7645 | 0.1742 |
| **S2 (Behavioral)**| Random Forest | 0.8307 ± 0.0045 [0.8268, 0.8346] | 0.7489 ± 0.0038 | 0.7541 | 0.8321 | 0.8368 | 0.7974 | 0.7519 | 0.7740 | 0.1685 |
| **S2 (Behavioral)**| Gradient Boosting | 0.8410 ± 0.0045 [0.8371, 0.8449] | 0.7597 ± 0.0038 | **0.7644** | **0.8425** | **0.8478** | **0.8086** | **0.7603** | **0.7837** | **0.1624** |

---

### Detailed Analysis of Incremental Predictive Horizons (RQ2)

1. **Horizon $S_0 \rightarrow S_1$ (Incorporating Early Graded Academic Milestones)**:
   - Gradient Boosting Validation ROC-AUC increases by $+0.1384$ ($0.6208 \rightarrow 0.7592$).
   - Validation PR-AUC increases by $+0.1433$ ($0.6145 \rightarrow 0.7578$).
   - Validation Accuracy increases by $+0.1041$ ($0.5971 \rightarrow 0.7012$).
   - At-Risk Recall increases by $+9.15$ percentage points ($65.67\% \rightarrow 74.82\%$).
   - False Negatives (missed at-risk students) decrease from $886 \rightarrow 650$ (a reduction of $236$ missed students, $-26.6\%$).
   - Brier calibration score improves from $0.2385 \rightarrow 0.1982$ (error reduction of $16.9\%$).
2. **Horizon $S_1 \rightarrow S_2$ (Incorporating Early Digital VLE Engagement Clickstream)**:
   - Gradient Boosting Validation ROC-AUC increases by an additional $+0.0833$ ($0.7592 \rightarrow 0.8425$).
   - Validation PR-AUC increases by an additional $+0.0900$ ($0.7578 \rightarrow 0.8478$).
   - Validation Accuracy increases by an additional $+0.0632$ ($0.7012 \rightarrow 0.7644$).
   - At-Risk Recall increases by an additional $+6.04$ percentage points ($74.82\% \rightarrow 80.86\%$).
   - False Negatives decrease from $650 \rightarrow 494$ (an additional reduction of $156$ missed students, $-24.0\%$).
   - Brier score further improves to $0.1624$ (error reduction of $18.1\%$ relative to $S_1$; cumulative error reduction of $31.9\%$ vs $S_0$).
3. **Cumulative Gain ($S_0 \rightarrow S_2$)**:
   - Total ROC-AUC improvement: $+0.2217$ ($0.6208 \rightarrow 0.8425$).
   - Total PR-AUC improvement: $+0.2333$ ($0.6145 \rightarrow 0.8478$).
   - Total Accuracy improvement: $+0.1673$ ($0.5971 \rightarrow 0.7644$).
   - Total At-Risk Recall improvement: $+15.19$ percentage points ($65.67\% \rightarrow 80.86\%$).
   - Total False Negatives reduction: from $886$ missed students ($34.3\%$) down to $494$ missed students ($19.1\%$), capturing an additional $392$ at-risk students for early academic support (a $44.2\%$ reduction in missed students).

---

### Methodological & Experimental Integrity Notes:
1. **Mathematical Consistency**: All validation metrics are computed directly and authoritatively from the underlying validation confusion matrix ($TN + FP + FN + TP = 4,889$), guaranteeing exact numerical agreement across accuracy, precision, recall, and F1.
2. **Partition Isolation**: Preprocessing and model parameters were fitted exclusively on training folds; validation evaluations used forward transformation only.
3. **Locked Test Set**: The test set ($N = 4,889$ records, $4,318$ unique students) remains strictly untouched and was not used for model selection, tuning, or threshold evaluation.
4. **Cross-Validation Interval Interpretation**: The bracketed interval represents an approximate fold-level variability interval ($\text{Mean} \pm 1.96 \times \text{SD} / \sqrt{5}$) across the five cross-validation folds. It reflects fold-to-fold empirical stability rather than a definitive population-level parameter confidence interval.
5. **Operational Focus**: The primary target is At-Risk prediction (`is_at_risk = 1`), with particular emphasis on At-Risk Recall to minimize undetected student failure and withdrawal.
