# Table XXXI: Class-Weight Treatment Sensitivity Analysis

### Controlled Sensitivity Analysis of Loss Function Re-weighting (`class_weight = None` vs. `class_weight = 'balanced'`) on Primary Model ($S_2$ Gradient Boosting)

*Methodological Statement: This sensitivity comparison evaluates whether artificial class weighting provides any empirical advantage over unweighted training given the balanced nature of the target distribution (52.81% At-Risk in holdout test). The unweighted model (`class_weight = None`) remains the locked primary specification. Validation partition results represent development evidence, while holdout test results are provided strictly for descriptive sensitivity verification.*

| Evaluation Partition | Loss Weighting Specification | ROC-AUC | PR-AUC | Overall Accuracy ($\theta^* = 0.45$) | At-Risk Recall ($\theta^* = 0.45$) | At-Risk Precision ($\theta^* = 0.45$) | At-Risk F1 ($\theta^* = 0.45$) | Specificity ($\theta^* = 0.45$) | Brier Score | Methodological Characterization |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Validation (Dev)** | **class_weight = None (Primary Standard)** | **0.8425** | **0.8478** | **76.17%** | **82.60%** | **74.86%** | **0.7854** | **68.98%** | **0.1624** | Optimal trade-off under true target distribution |
| Validation (Dev) | class_weight = "balanced" (Sensitivity) | 0.8422 | 0.8475 | 75.45% | 84.52% | 73.12% | 0.7841 | 65.29% | 0.1631 | Degrades specificity (-3.69%) with minimal AUC delta |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Holdout Test** | **class_weight = None (Frozen Primary)** | **0.8406** | **0.8459** | **75.95%** | **82.38%** | **74.68%** | **0.7834** | **68.75%** | **0.1638** | **Authoritative Frozen Primary Benchmark** |
| Holdout Test | class_weight = "balanced" (Sensitivity) | 0.8404 | 0.8456 | 75.47% | 84.53% | 73.15% | 0.7842 | 65.31% | 0.1643 | Inflates false alert burden (+157 false alarms) |

---

### Key Analytical Findings:

1. **Invariance of Rank Discrimination**:
   Across both validation and test sets, setting `class_weight = 'balanced'` produces a negligible change in overall rank discrimination (Validation ROC-AUC delta = $-0.0003$; Test ROC-AUC delta = $-0.0002$). This confirms that the model's underlying separation surface is essentially unaffected by class weighting.
2. **Predicted-Positive Rate Shift**:
   Balanced weighting produced a higher predicted-positive rate and more false positives under the evaluated threshold. At $\theta^* = 0.45$:
   - Recall increases marginally from $82.38\%$ to $84.53\%$ ($+55$ true positives).
   - Specificity drops from $68.75\%$ to $65.31\%$ ($-3.44$ percentage points), generating **$157$ additional false alarms** ($721 \rightarrow 878$).
   - Precision drops from $74.68\%$ down to $73.15\%$.
3. **Configuration Comparison**:
   Under the evaluated configuration, unweighted training produced higher specificity, precision and F1 than balanced weighting, while ROC-AUC differed only marginally.
