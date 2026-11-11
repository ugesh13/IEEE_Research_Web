# Sensitivity Analysis: Model Performance for Students Active at Day 30

### Comparison of Frozen Model Performance on Full Holdout vs. Actively Registered Cohort ($\theta^* = 0.45$)

| Evaluation Cohort | Observations ($N$) | At-Risk Prevalence | ROC-AUC | Recall | Precision | $F_1$-Score | TP | FN | FP | TN |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Full Holdout Test Set** | 4,859 | 52.75% | 0.8487 | 76.12% | 77.39% | 0.7675 | 1,951 | 612 | 570 | 1,726 |
| **Active at Day 30 (date_unreg missing or > 30)** | 4,103 | 44.04% | 0.7931 | 67.24% | 68.07% | 0.6765 | 1,215 | 592 | 570 | 1,726 |

---

### Day <= 30 Early Unregistration Breakdown:
- **Total holdout observations already unregistered by Day 30**: **756** (15.56% of holdout)
- **Label distribution of early unregistered cohort**: {'Withdrawn': 756}
- **Methodological Insight**: Students who officially unregistered prior to or on Day 30 had virtually zero clickstream/assessment activity by Day 30, making them readily identifiable as at-risk. When evaluated strictly on the actively enrolled cohort ($N = 4,103$), the model achieves ROC-AUC = 0.7931, Recall = 67.24%, Precision = 68.07%, and F1 = 0.6765.
