# Table XII: Preprocessing Architecture & Feature Dimensionality Specification

| Scenario | Horizon Cutoff | Raw Predictors | Numerical Predictors | Categorical Predictors | Transformed Features | Missing Value Strategy | Scaling Strategy | Excluded Variables |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **S0 (Baseline)** | Day $\le 0$ | 13 | 5 | 8 | **52** | Median imputation (num) + Most frequent (cat) fitted strictly on $X_{\text{train}}$ | StandardScaler for Linear/Distance models; Omitted for Tree models | `id_student`, `final_result`, `is_at_risk`, `partition`, `cv_fold`, `date_unregistration` |
| **S1 (Early Academic)** | Day $\le 30$ | 21 | 13 | 8 | **60** | Median imputation (num) + Most frequent (cat) fitted strictly on $X_{\text{train}}$ | StandardScaler for Linear/Distance models; Omitted for Tree models | `id_student`, `final_result`, `is_at_risk`, `partition`, `cv_fold`, `date_unregistration` |
| **S2 (Early Behavioral)** | Day $\le 30$ | 29 | 21 | 8 | **68** | Median imputation (num) + Most frequent (cat) fitted strictly on $X_{\text{train}}$ | StandardScaler for Linear/Distance models; Omitted for Tree models | `id_student`, `final_result`, `is_at_risk`, `partition`, `cv_fold`, `date_unregistration` |

---

### Detailed Predictor Breakdown by Scenario

#### 1. Categorical Predictors (Common across S0, S1, S2 — 8 Raw Predictors $\rightarrow$ 47 Transformed One-Hot Columns)
All categorical features are imputed with the most frequent value learned exclusively on the training fold, followed by `OneHotEncoder(handle_unknown='ignore', sparse_output=False)`:
1. `code_module` (7 categories: AAA, BBB, CCC, DDD, EEE, FFF, GGG)
2. `code_presentation` (4 categories: 2013B, 2013J, 2014B, 2014J)
3. `gender` (2 categories: F, M)
4. `region` (13 categories: East Anglian Region, Scotland, North Western Region, South East Region, West Midlands Region, South Region, East Midlands Region, London Region, South West Region, Yorkshire Region, Wales, North Region, Ireland)
5. `highest_education` (5 categories: HE Qualification, A Level or Equivalent, Lower Than A Level, Post Graduate Qualification, No Formal quals)
6. `imd_band` (11 categories: 0-10%, 10-20, 20-30%, 30-40%, 40-50%, 50-60%, 60-70%, 70-80%, 80-90%, 90-100%, Missing/Not Applicable)
7. `age_band` (3 categories: 0-35, 35-55, 55<=)
8. `disability` (2 categories: N, Y)
$$\text{Total One-Hot Encoded Columns} = 7 + 4 + 2 + 13 + 5 + 11 + 3 + 2 = 47$$

#### 2. S0 Numerical Predictors (5 Raw $\rightarrow$ 5 Transformed)
- `num_of_prev_attempts` (Count)
- `studied_credits` (Continuous / Credit sum)
- `module_presentation_length` (Days)
- `date_registration` (Days relative to course start; missingness reverted to NaN prior to pipeline, training median = -57.0 days)
- `date_registration_imputed_flag` (Binary missingness indicator: 1 = missing, 0 = observed)

#### 3. S1 Numerical Predictors (13 Raw $\rightarrow$ 13 Transformed: 5 S0 + 8 Early Academic Features at Day $\le 30$)
- S0 Features (5 numerical features)
- `early_assessments_submitted_d30` (Count of assessments submitted $\le 30$ days)
- `has_early_assessment_submission_d30` (Binary indicator: 1 = submitted at least 1 assessment by Day 30, 0 = none)
- `early_avg_score_d30` (Continuous: NaN if unsubmitted, imputed with training median)
- `early_min_score_d30` (Continuous: NaN if unsubmitted, imputed with training median)
- `early_max_score_d30` (Continuous: NaN if unsubmitted, imputed with training median)
- `early_std_score_d30` (Continuous: 0.0 if $\le 1$ assessment, imputed with training median)
- `early_avg_submission_delay_d30` (Continuous: Days before/after due date)
- `early_banked_count_d30` (Count of transferred/banked assessment credits)

#### 4. S2 Numerical Predictors (21 Raw $\rightarrow$ 21 Transformed: 13 S1 + 8 Early Behavioral VLE Features at Day $\le 30$)
- S1 Features (13 numerical features)
- `has_early_vle_interaction_d30` (Binary indicator: 1 = engaged with VLE $\le 30$ days, 0 = zero clicks)
- `early_vle_total_clicks_d30` (Sum of clicks $\le 30$ days)
- `early_vle_active_days_d30` (Count of distinct active days $\le 30$ days)
- `early_vle_sites_visited_d30` (Count of distinct VLE materials/activities accessed $\le 30$ days)
- `early_vle_clicks_per_active_day_d30` (Rate: clicks per active day)
- `early_vle_precourse_clicks` (Clicks before Day 0)
- `early_vle_incourse_clicks_d30` (Clicks from Day 0 to Day 30)
- `early_vle_precourse_ratio` (Ratio: pre-course clicks / total early clicks)

---

### Model-Specific Preprocessing Pipelines

1. **Linear / Distance-Sensitive Models (Logistic Regression, SVM)**:
   $$\mathbf{X}_{\text{num}} \xrightarrow{\text{SimpleImputer(median)}} \xrightarrow{\text{StandardScaler()}} \mathbf{Z}_{\text{num}}$$
   $$\mathbf{X}_{\text{cat}} \xrightarrow{\text{SimpleImputer(most\_frequent)}} \xrightarrow{\text{OneHotEncoder(handle\_unknown='ignore')}} \mathbf{Z}_{\text{cat}}$$
   $$\mathbf{Z} = [\mathbf{Z}_{\text{num}} \,\|\, \mathbf{Z}_{\text{cat}}]$$

2. **Tree-Based Models (Random Forest, Gradient Boosting, XGBoost, LightGBM)**:
   $$\mathbf{X}_{\text{num}} \xrightarrow{\text{SimpleImputer(median)}} \mathbf{X}_{\text{num, imputed}} \quad (\text{Scaling strictly omitted})$$
   $$\mathbf{X}_{\text{cat}} \xrightarrow{\text{SimpleImputer(most\_frequent)}} \xrightarrow{\text{OneHotEncoder(handle\_unknown='ignore')}} \mathbf{Z}_{\text{cat}}$$
   $$\mathbf{Z} = [\mathbf{X}_{\text{num, imputed}} \,\|\, \mathbf{Z}_{\text{cat}}]$$
   *Methodological Justification for Omitting Scaling in Tree Models*: Decision trees evaluate orthogonal, axis-aligned partitioning thresholds $\mathbb{I}(X_j \le \theta)$ using impurity metrics (Gini or entropy). Because monotonic transformations (such as linear standardization $z = (x - \mu)/\sigma$) do not alter the ordering of sample values or optimal split points, standardizing features before tree induction is mathematically redundant and obfuscates the physical interpretability of decision rules (e.g., clicks or days).
