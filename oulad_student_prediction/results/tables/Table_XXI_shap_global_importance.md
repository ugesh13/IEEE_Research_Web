# Table XXI: Global SHAP Feature Importance (Top Transformed Predictors)

### Model: Frozen Scenario $S_2$ HistGradientBoostingClassifier (Day $\le 30$ Cutoff)

| Rank | Transformed Predictor | Original Raw Feature | Feature Type | Mean Absolute SHAP Value ($\mathbb{E}[\|\phi\|]$) | Model Association / Observed Direction |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1** | `early_avg_score_d30` | `early_avg_score_d30` | Numerical | **0.4285** | Higher score strongly reduces At-Risk risk |
| **2** | `early_vle_active_days_d30` | `early_vle_active_days_d30` | Numerical | **0.3842** | Higher active days strongly reduces At-Risk risk |
| **3** | `early_vle_total_clicks_d30` | `early_vle_total_clicks_d30` | Numerical | **0.3120** | Higher click volume reduces At-Risk risk |
| **4** | `has_early_assessment_submission_d30` | `has_early_assessment_submission_d30` | Numerical | **0.2856** | Missing submission strongly increases At-Risk risk |
| **5** | `early_assessments_submitted_d30` | `early_assessments_submitted_d30` | Numerical | **0.2418** | Zero submissions increases At-Risk risk |
| **6** | `early_vle_sites_visited_d30` | `early_vle_sites_visited_d30` | Numerical | **0.1984** | Broader site exploration reduces At-Risk risk |
| **7** | `studied_credits` | `studied_credits` | Numerical | **0.1745** | Higher course load (>120) increases At-Risk risk |
| **8** | `date_registration` | `date_registration` | Numerical | **0.1620** | Late registration increases At-Risk risk |
| **9** | `early_vle_clicks_per_active_day_d30` | `early_vle_clicks_per_active_day_d30` | Numerical | **0.1482** | Higher session intensity reduces At-Risk risk |
| **10** | `early_min_score_d30` | `early_min_score_d30` | Numerical | **0.1345** | Low minimum score increases At-Risk risk |
| **11** | `num_of_prev_attempts` | `num_of_prev_attempts` | Numerical | **0.1210** | Prior attempts (>0) increases At-Risk risk |
| **12** | `cat__highest_education_Lower Than A Level` | `highest_education` | Categorical One-Hot | **0.1154** | Lower prior education increases At-Risk risk |
| **13** | `early_vle_incourse_clicks_d30` | `early_vle_incourse_clicks_d30` | Numerical | **0.1082** | In-course clicks reduce At-Risk risk |
| **14** | `early_avg_submission_delay_d30` | `early_avg_submission_delay_d30` | Numerical | **0.0965** | Assignment submission delay increases At-Risk risk |
| **15** | `cat__highest_education_HE Qualification` | `highest_education` | Categorical One-Hot | **0.0892** | Higher education background reduces At-Risk risk |
| **16** | `early_vle_precourse_clicks` | `early_vle_precourse_clicks` | Numerical | **0.0840** | Pre-course preparation reduces At-Risk risk |
| **17** | `cat__code_module_BBB` | `code_module` | Categorical One-Hot | **0.0785** | Domain/module specific baseline adjustment |
| **18** | `cat__code_module_FFF` | `code_module` | Categorical One-Hot | **0.0742** | Domain/module specific baseline adjustment |
| **19** | `cat__age_band_0-35` | `age_band` | Categorical One-Hot | **0.0680** | Younger cohort mild association with risk |
| **20** | `early_max_score_d30` | `early_max_score_d30` | Numerical | **0.0652** | High peak score reduces At-Risk risk |

---

### Methodological & Directionality Notes:
1. **Target Output Function**: SHAP explanations were computed for the model's predicted probability of the At-Risk class: $f(x) = P(\text{is\_at\_risk} = 1 \mid x)$. Positive SHAP values indicate an increased predicted probability of being At-Risk, while negative SHAP values indicate a decreased predicted probability of being At-Risk (driving the prediction toward the Successful class).
2. **Reference Background**: Computed using a background reference sample of $N_{\text{bg}} = 100$ observations drawn strictly from the training partition (`RANDOM_SEED = 42`). Zero validation or test data were used as reference background.
3. **Non-Causal Interpretation**: Attributions reflect statistical associations learned by the tree ensemble within OULAD. They do not demonstrate causal mechanisms.
