# Recomputed SHAP Feature Importance and Family Shares

### Comparison of Manuscript (Stored Constants) vs. Pipeline Recomputation

| Predictive Family | Features | Manuscript Stored Share (%) | Recomputed Holdout Share (%) | Recomputed Mean |SHAP| |
| :--- | :---: | :---: | :---: | :---: |
| **Academic Milestones (Day $\le 30$)** | 8 | 33.22% | **32.72%** | 1.1551 |
| **VLE Digital Engagement (Day $\le 30$)** | 8 | 32.61% | **26.48%** | 0.9347 |
| **Static Intake and Context** | 13 | 34.17% | **40.80%** | 1.4405 |
| **Combined Dynamic Engagement** | 16 | 65.83% | **59.20%** | 2.0898 |
| **Total Denominator** | 29 | 100.00% | **100.00%** | 3.5303 |

---

### Top 10 Recomputed Raw Features by Mean Absolute SHAP:

| Rank | Raw Feature | Predictive Family | Mean |SHAP| | Share (%) |
| :---: | :--- | :--- | :---: | :---: |
| 1 | `code_module` | Static Intake and Context | 0.6607 | 18.72% |
| 2 | `early_assessments_submitted_d30` | Academic Milestones (Day <= 30) | 0.5999 | 16.99% |
| 3 | `early_vle_incourse_clicks_d30` | VLE Digital Engagement (Day <= 30) | 0.3802 | 10.77% |
| 4 | `early_vle_active_days_d30` | VLE Digital Engagement (Day <= 30) | 0.2787 | 7.89% |
| 5 | `highest_education` | Static Intake and Context | 0.2313 | 6.55% |
| 6 | `early_avg_score_d30` | Academic Milestones (Day <= 30) | 0.1782 | 5.05% |
| 7 | `imd_band` | Static Intake and Context | 0.1585 | 4.49% |
| 8 | `early_avg_submission_delay_d30` | Academic Milestones (Day <= 30) | 0.1431 | 4.05% |
| 9 | `early_max_score_d30` | Academic Milestones (Day <= 30) | 0.1256 | 3.56% |
| 10 | `studied_credits` | Static Intake and Context | 0.1000 | 2.83% |
