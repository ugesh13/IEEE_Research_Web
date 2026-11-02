# Table IX: Feature Correlation & Multi-Collinearity Diagnostic Summary

| Feature Pair / Cluster | Scenario | Estimated Correlation ($r$) | Type of Association | Multicollinearity Risk | Methodological Handling Strategy |
| :--- | :---: | :---: | :--- | :---: | :--- |
| `early_avg_score_d30` $\leftrightarrow$ `early_min_score_d30` / `early_max_score_d30` | S1, S2 | $\approx 0.95 - 0.98$ | Collinear Score Metrics | **High** for students with only 1 early assignment | Retained in tree-based models (XGBoost/LightGBM split on best boundary natively); for linear models, regularized regression (ElasticNet / Ridge) handles collinearity. |
| `early_vle_total_clicks_d30` $\leftrightarrow$ `early_vle_active_days_d30` | S2 | $\approx 0.76 - 0.82$ | Volume vs. Frequency | Moderate | Both provide distinct pedagogical meaning: total clicks captures intensity, while active days captures study habit regularity. |
| `early_vle_total_clicks_d30` $\leftrightarrow$ `early_vle_sites_visited_d30` | S2 | $\approx 0.72 - 0.78$ | Volume vs. Breadth | Moderate | Sites visited measures curriculum exploration breadth across course modules. |
| `early_vle_precourse_clicks` $\leftrightarrow$ `early_vle_incourse_clicks_d30` | S2 | $\approx 0.35 - 0.45$ | Temporal Engagement | Low | Distinguishes proactive pre-semester orientation from post-start study routine. |
| `num_of_prev_attempts` $\leftrightarrow$ `studied_credits` | S0, S1, S2 | $\approx -0.04$ | Academic Load vs Repetition | Negligible | Independent academic risk factors. |
| `gender` $\leftrightarrow$ `studied_credits` / `disability` | S0, S1, S2 | $\approx 0.01 - 0.06$ | Demographics | Negligible | Low cross-correlation among demographic features; minimal confounding. |
