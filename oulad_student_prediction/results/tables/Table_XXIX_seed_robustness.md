# Table XXIX: Random Partition Robustness Across Random Seeds

### Out-of-Sample Performance of Primary Model ($S_2$ Gradient Boosting) Across 5 Pre-Specified Student-Grouped Random Partitions

*Methodological Statement: Seed 42 represents the original primary frozen experiment. All additional seeds (7, 21, 84, 123) enforce the identical student-level grouping protocol (approximately 70% train / 15% validation / 15% test; 0 student overlap across partitions). Results across seeds document sampling stability across splits; they are reported as empirical dispersion ('Across the evaluated random partitions...') rather than population confidence intervals.*

| Random Seed | Test Observations (Unique Students) | ROC-AUC | PR-AUC | Accuracy ($\theta^* = 0.45$) | At-Risk Recall ($\theta^* = 0.45$) | At-Risk Precision ($\theta^* = 0.45$) | At-Risk F1 ($\theta^* = 0.45$) | Specificity ($\theta^* = 0.45$) | Brier Score | Benchmark F1 ($\theta = 0.50$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 7 | 4,888 (4,318) | 0.8388 | 0.8435 | 75.68% | 82.15% | 74.45% | 0.7811 | 68.42% | 0.1649 | 0.7792 |
| 21 | 4,891 (4,318) | 0.8421 | 0.8472 | 76.16% | 82.55% | 74.88% | 0.7853 | 68.99% | 0.1627 | 0.7832 |
| **42** | **4,889 (4,318)** | **0.8406** | **0.8459** | **75.95%** | **82.38%** | **74.68%** | **0.7834** | **68.75%** | **0.1638** | **0.7814 (Primary Frozen)** |
| 84 | 4,890 (4,318) | 0.8395 | 0.8448 | 75.85% | 82.30% | 74.59% | 0.7825 | 68.63% | 0.1642 | 0.7803 |
| 123 | 4,891 (4,318) | 0.8415 | 0.8465 | 76.06% | 82.46% | 74.79% | 0.7844 | 68.89% | 0.1632 | 0.7823 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Mean** | 4,889.8 (4,318.0) | **0.8405** | **0.8456** | **75.94%** | **82.37%** | **74.68%** | **0.7833** | **68.74%** | **0.1638** | **0.7813** |
| **Std. Dev. ($s$)** | 1.3 (0.0) | 0.0013 | 0.0014 | 0.18% | 0.15% | 0.16% | 0.0016 | 0.22% | 0.0008 | 0.0016 |
| **Minimum** | 4,888 (4,318) | 0.8388 | 0.8435 | 75.68% | 82.15% | 74.45% | 0.7811 | 68.42% | 0.1627 | 0.7792 |
| **Maximum** | 4,891 (4,318) | 0.8421 | 0.8472 | 76.16% | 82.55% | 74.88% | 0.7853 | 68.99% | 0.1649 | 0.7832 |

---

### Student-Level Partitioning Integrity & Leakage Verification:

| Seed | Unique Train Students | Unique Val Students | Unique Test Students | Train Obs | Val Obs | Test Obs | Train/Val Overlap | Train/Test Overlap | Val/Test Overlap | Clustering Leakage Status |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 7 | 20,154 | 4,318 | 4,318 | 22,810 | 4,895 | 4,888 | 0 | 0 | 0 | **PASSED (Zero Overlap)** |
| 21 | 20,154 | 4,318 | 4,318 | 22,818 | 4,884 | 4,891 | 0 | 0 | 0 | **PASSED (Zero Overlap)** |
| **42** | **20,154** | **4,318** | **4,318** | **22,814** | **4,890** | **4,889** | **0** | **0** | **0** | **PASSED (Zero Overlap)** |
| 84 | 20,154 | 4,318 | 4,318 | 22,812 | 4,891 | 4,890 | 0 | 0 | 0 | **PASSED (Zero Overlap)** |
| 123 | 20,154 | 4,318 | 4,318 | 22,815 | 4,887 | 4,891 | 0 | 0 | 0 | **PASSED (Zero Overlap)** |

---

### Key Robustness Insights:

1. **Extreme Discrimination Invariance**:
   Across the 5 evaluated random partitions, test ROC-AUC exhibits remarkably tight clustering around the mean of **0.8405** with a standard deviation of only **$s = 0.0013$** (span: $[0.8388, 0.8421]$). PR-AUC is equally stable at **0.8456 $\pm$ 0.0014** (span: $[0.8435, 0.8472]$).
2. **Operational Constraint Stability**:
   At the operational decision threshold $\theta^* = 0.45$, At-Risk Recall consistently satisfies the institutional target ($\ge 82\%$) across every partition (mean: **82.37% $\pm$ 0.15%**, range: $82.15\% - 82.55\%$). At-Risk Precision similarly hovers stably at **74.68% $\pm$ 0.16%**, and $F_1$ averages **0.7833 $\pm$ 0.0016**.
3. **Partition Independence**:
   Because exact student grouping was verified with zero student overlap across all three splits for all five seeds, these results demonstrate that the predictive power of Scenario $S_2$ is not an idiosyncratic feature of the seed 42 split, but reflects robust out-of-sample generalization across different cohorts of students.
