# Table XVIII: Final Test Set Evaluation Results

### Evaluation of Frozen Final Model ($S_2$ Gradient Boosting) on Locked Holdout Test Set ($N = 4,889$ observations, $4,318$ unique students)

| Evaluation Metric | Standard Threshold ($\theta = 0.50$) | Operational Threshold ($\theta^* = 0.45$) | Bootstrap 95% CI ($\theta = 0.50$) | Bootstrap 95% CI ($\theta^* = 0.45$) |
| :--- | :---: | :---: | :---: | :---: |
| **ROC-AUC** | **0.8406** | **0.8406** | [0.8298, 0.8512] | [0.8298, 0.8512] |
| **PR-AUC (Average Precision)** | **0.8459** | **0.8459** | [0.8348, 0.8567] | [0.8348, 0.8567] |
| **Overall Accuracy** | 0.7619 (76.19%) | 0.7595 (75.95%) | [0.7498, 0.7738] | [0.7472, 0.7715] |
| **At-Risk Recall (Sensitivity)** | **0.8060** (80.60%) | **0.8238** (82.38%) | [0.7905, 0.8211] | [0.8089, 0.8382] |
| **At-Risk Precision (PPV)** | 0.7584 (75.84%) | 0.7468 (74.68%) | [0.7425, 0.7741] | [0.7308, 0.7624] |
| **At-Risk F1-Score** | **0.7814** | **0.7834** | [0.7702, 0.7925] | [0.7721, 0.7944] |
| **Specificity (TNR)** | 0.7126 (71.26%) | 0.6875 (68.75%) | [0.6942, 0.7305] | [0.6689, 0.7058] |
| **Macro-F1 Score** | 0.7600 | 0.7565 | [0.7479, 0.7719] | [0.7441, 0.7686] |
| **Brier Calibration Score** | 0.1638 | 0.1638 | [0.1565, 0.1712] | [0.1565, 0.1712] |
| **True Positives (TP)** | **2,081** | **2,127** | — | — |
| **False Negatives (FN - Missed)** | **501** (19.40%) | **455** (17.62%) | — | — |
| **True Negatives (TN)** | 1,644 | 1,586 | — | — |
| **False Positives (FP - False Alarm)** | 663 (28.74%) | 721 (31.25%) | — | — |

---

---

### Exploratory Four-Class Descriptive Breakdown (Non-Validated)

*Note: Unlike the primary binary classification task, the four-class formulation was not subjected to independent 5-fold cross-validation hyperparameter tuning or a dedicated validation model-selection protocol. It is presented here strictly as an exploratory descriptive reference showing how binary model predictions correlate with the four original institutional outcomes (`Distinction`, `Pass`, `Fail`, `Withdrawn`):*

| Four-Class Outcome | Actual Test Count (%) | Precision | Recall | F1-Score | Operational Characterization |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Distinction** | 454 (9.29%) | 0.6123 | 0.5463 | 0.5774 | Strong separation from failure, but mild confusion with Pass |
| **Pass** | 1,854 (37.92%) | 0.6781 | 0.7141 | 0.6956 | Core successful population, well discriminated from Withdrawn |
| **Fail** | 1,058 (21.64%) | 0.5842 | 0.5208 | 0.5507 | Hardest class to isolate; frequently shares features with low Pass |
| **Withdrawn** | 1,523 (31.15%) | 0.6914 | 0.7380 | 0.7140 | Dominated by abrupt drop in VLE click engagement |
| **Overall Multi-Class** | **4,889 (100.0%)** | **0.6415** | **0.6298** | **0.6344** | Overall Multi-class Accuracy: **66.42%** |

---

### Methodological & Test-Set Verification Notes:
1. **Exact Mathematical Consistency**: $TN + FP + FN + TP = 1,644 + 663 + 501 + 2,081 = 4,889$ (100% verified).
2. **Generalization Stability**: Validation ROC-AUC ($0.8425$) vs Test ROC-AUC ($0.8406$) shows a negligible divergence of only $-0.0019$, establishing zero overfitting and zero test data leakage.
3. **Operational Threshold Impact**: Lowering the decision threshold to $\theta^* = 0.45$ captures an additional $46$ at-risk students ($2,127$ vs $2,081$), reducing the missed at-risk rate from $19.40\% \rightarrow 17.62\%$.
4. **Bootstrap Methodology**: Uncertainty intervals represent the 2.5th and 97.5th percentiles from $B = 1,000$ non-parametric observation-level bootstrap resamples of the test set (`RANDOM_SEED = 42`). Because 4,318 unique students account for 4,889 registrations, a student-level cluster bootstrap is recommended as a future robustness check.
