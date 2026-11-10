# Table IV: Extreme Value & Distributional Audit

| Feature | Min | Median | Max | Extreme Criterion | Extreme Count (%) | Methodological Decision | Rationale |
| :--- | :---: | :---: | :---: | :--- | :---: | :--- | :--- |
| `studied_credits` | 30 | 60.0 | 655 | studied_credits > 240 (>2 full-time equivalent years) | 116 (0.356%) | Retained untouched without truncation | Represents real concurrent course registrations; severe cognitive overload is a direct risk predictor |
| `num_of_prev_attempts` | 0 | 0.0 | 6 | num_of_prev_attempts > 2 | 198 (0.607%) | Retained untouched | Authentic record of chronic course repetition |
| `total_vle_clicks` | 0 | 602.0 | 24139 | total_vle_clicks > 99th percentile (7,785 clicks) | 326 (1.0%) | Retained; log1p transformation prepared for linear models in Phase 10 | Power-user browsing behavior is common in learning analytics; tree models handle skewness natively |
