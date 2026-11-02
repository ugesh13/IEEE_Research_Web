# Table XXII: Aggregated SHAP Attribution by Original Raw Predictor

### Mapping from 68 Transformed Features to 29 Original Predictors in Scenario $S_2$

| Rank | Original Raw Predictor | Predictive Information Domain | Levels / Columns | Aggregated SHAP Attribution | % Total Importance | Domain Description |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1** | `early_avg_score_d30` | Academic Milestones (Day <= 30) | 1 | **0.4285** | 10.93% | Mean score across Day <= 30 graded assessment submissions |
| **2** | `early_vle_active_days_d30` | VLE Engagement (Day <= 30) | 1 | **0.3842** | 9.80% | Number of distinct days student logged into VLE by Day 30 |
| **3** | `early_vle_total_clicks_d30` | VLE Engagement (Day <= 30) | 1 | **0.3120** | 7.96% | Total raw digital click interactions recorded by Day 30 |
| **4** | `has_early_assessment_submission_d30` | Academic Milestones (Day <= 30) | 1 | **0.2856** | 7.29% | Indicator whether any assessment was submitted by Day 30 |
| **5** | `highest_education` | Demographic / Intake | 5 | **0.2584** | 6.59% | Prior educational qualification level (5 categorical levels) |
| **6** | `early_assessments_submitted_d30` | Academic Milestones (Day <= 30) | 1 | **0.2418** | 6.17% | Count of submitted assignments prior to cutoff |
| **7** | `code_module` | Institutional Context | 7 | **0.2150** | 5.49% | Course module code (7 distinct academic subject modules) |
| **8** | `early_vle_sites_visited_d30` | VLE Engagement (Day <= 30) | 1 | **0.1984** | 5.06% | Number of unique VLE activity URLs/sites accessed |
| **9** | `studied_credits` | Intake / Course Load | 1 | **0.1745** | 4.45% | Total academic credit points concurrently enrolled |
| **10** | `date_registration` | Intake / Enrollment Timing | 1 | **0.1620** | 4.13% | Days before/after presentation start date student registered |
| **11** | `early_vle_clicks_per_active_day_d30` | VLE Engagement (Day <= 30) | 1 | **0.1482** | 3.78% | Average click volume per active study day |
| **12** | `early_min_score_d30` | Academic Milestones (Day <= 30) | 1 | **0.1345** | 3.43% | Lowest score obtained on early assessment submissions |
| **13** | `num_of_prev_attempts` | Academic History | 1 | **0.1210** | 3.09% | Number of previous attempts at the same module |
| **14** | `early_vle_incourse_clicks_d30` | VLE Engagement (Day <= 30) | 1 | **0.1082** | 2.76% | Clicks occurring between Day 1 and Day 30 |
| **15** | `early_avg_submission_delay_d30` | Academic Milestones (Day <= 30) | 1 | **0.0965** | 2.46% | Average days elapsed between deadline and actual submission |
| **16** | `imd_band` | Demographic / Socioeconomic | 10 | **0.0945** | 2.41% | Index of Multiple Deprivation decile (10 levels) |
| **17** | `early_vle_precourse_clicks` | VLE Engagement (Day <= 30) | 1 | **0.0840** | 2.14% | VLE activity recorded before official course launch |
| **18** | `age_band` | Demographic | 3 | **0.0782** | 2.00% | Student age bracket (0-35, 35-55, 55<=) |
| **19** | `region` | Demographic / Geographic | 13 | **0.0754** | 1.92% | UK administrative geographic region (13 regions) |
| **20** | `early_max_score_d30` | Academic Milestones (Day <= 30) | 1 | **0.0652** | 1.66% | Highest assessment score obtained before Day 30 |
| **21** | `code_presentation` | Institutional Context | 4 | **0.0520** | 1.33% | Academic presentation cohort (2013B, 2013J, 2014B, 2014J) |
| **22** | `gender` | Demographic | 2 | **0.0410** | 1.05% | Self-reported student gender (M, F) |
| **23** | `disability` | Demographic | 2 | **0.0385** | 0.98% | Declared disability status (Y, N) |
| **24** | `early_std_score_d30` | Academic Milestones (Day <= 30) | 1 | **0.0320** | 0.82% | Score variance across early submissions |
| **25** | `early_vle_precourse_ratio` | VLE Engagement (Day <= 30) | 1 | **0.0280** | 0.71% | Ratio of pre-course clicks to total Day 30 clicks |
| **26** | `module_presentation_length` | Institutional Context | 1 | **0.0240** | 0.61% | Length of academic term in days |
| **27** | `early_banked_count_d30` | Academic Milestones (Day <= 30) | 1 | **0.0180** | 0.46% | Count of banked/credit-transferred assessments |
| **28** | `has_early_vle_interaction_d30` | VLE Engagement (Day <= 30) | 1 | **0.0150** | 0.38% | Binary flag of any digital platform activity |
| **29** | `date_registration_imputed_flag` | Data Quality Flag | 1 | **0.0050** | 0.13% | Indicator whether registration date was missing/imputed |
| **Total** | — | — | **68** | **3.9196** | **100.00%** | **Total model attribution across all 68 transformed features** |

---

### Feature-Family Aggregated Attribution Breakdown:

| Feature Family Domain | Raw Features | Transformed Features | Sum Mean Absolute SHAP | % Total Model Attribution |
| :--- | :---: | :---: | :---: | :---: |
| **Academic Milestones (Day <= 30)** | 8 | 8 | **1.3021** | **33.22%** |
| **VLE Digital Engagement (Day <= 30)** | 8 | 8 | **1.2780** | **32.61%** |
| **Demographics & Socioeconomics** | 5 | 30 | **0.5860** | **14.95%** |
| **Intake / History / Course Load / Registration** | 5 | 5 | **0.4625** | **11.80%** |
| **Institutional Context** | 3 | 12 | **0.2910** | **7.42%** |
| **Total** | **29** | **68** | **3.9196** | **100.00%** |

**Combined Attribution Claim Reconciliation**:
$$\text{Combined Attribution (Academic + VLE)} = \frac{1.3021 + 1.2780}{3.9196} = \frac{2.5801}{3.9196} = \mathbf{65.83\%}$$
The preliminary narrative estimate of 66.8% is hereby formally reconciled to the exact verified figure of **65.83%**.

---

### Mathematical Aggregation Rule:
For each raw predictor $X_j$, aggregated attribution is computed as the sum of mean absolute SHAP values across its constituent transformed columns:  
$$\text{Aggregated SHAP}(X_j) = \sum_{k \in \text{Transformed}(X_j)} \mathbb{E}\big[|\phi_k|\big]$$  
This allows continuous numerical variables and multi-level categorical variables (e.g. `highest_education`, `code_module`) to be compared on a consistent, equitable scale. Total denominator across all 68 transformed features is $\sum_{k=1}^{68} \mathbb{E}[|\phi_k|] = 3.9196$.
