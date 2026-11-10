# Table VIII: Granular Feature Temporal Horizon & Leakage Risk Audit

| Feature Name | Source Table | Earliest Possible Date | Latest Included Date | Scenario(s) | Leakage Risk Assessment |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `code_module` | courses.csv / studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Static institutional metadata) |
| `code_presentation` | courses.csv / studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Static semester metadata) |
| `gender` | studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Self-declared student background) |
| `region` | studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Geographic residence at intake) |
| `highest_education` | studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Prior educational attainment) |
| `imd_band` | studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Area deprivation index at intake) |
| `age_band` | studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Demographic age category) |
| `disability` | studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Declared disability status) |
| `num_of_prev_attempts` | studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Historical repetitions on module) |
| `studied_credits` | studentInfo.csv | Pre-course | Day 0 | S0, S1, S2 | None (Credit load at registration) |
| `module_presentation_length` | courses.csv | Pre-course | Day 0 | S0, S1, S2 | None (Syllabus planned duration) |
| `date_registration` | studentRegistration.csv | Day -322 | Day 0 | S0, S1, S2 | None (Registration timing before start) |
| `date_registration_imputed_flag` | Derived | Pre-course | Day 0 | S0, S1, S2 | None (Missingness indicator flag) |
| `early_assessments_submitted_d30` | studentAssessment.csv | Day -11 | Day 30 | S1, S2 | None (Strictly filtered <= Day 30) |
| `has_early_assessment_submission_d30` | Derived | Day -11 | Day 30 | S1, S2 | None (Binary submission flag <= Day 30) |
| `early_avg_score_d30` | studentAssessment.csv | Day -11 | Day 30 | S1, S2 | None (Scores earned on assignments <= Day 30) |
| `early_min_score_d30` | studentAssessment.csv | Day -11 | Day 30 | S1, S2 | None (Minimum score <= Day 30) |
| `early_max_score_d30` | studentAssessment.csv | Day -11 | Day 30 | S1, S2 | None (Maximum score <= Day 30) |
| `early_std_score_d30` | studentAssessment.csv | Day -11 | Day 30 | S1, S2 | None (Score standard deviation <= Day 30) |
| `early_avg_submission_delay_d30` | studentAssessment.csv + assessments.csv | Day -11 | Day 30 | S1, S2 | None (Submission delay <= Day 30) |
| `early_banked_count_d30` | studentAssessment.csv | Day -11 | Day 30 | S1, S2 | None (Credit transfers <= Day 30) |
| `has_early_vle_interaction_d30` | Derived | Day -25 | Day 30 | S2 | None (Binary engagement flag <= Day 30) |
| `early_vle_total_clicks_d30` | studentVle.csv | Day -25 | Day 30 | S2 | None (Clicks strictly filtered <= Day 30) |
| `early_vle_active_days_d30` | studentVle.csv | Day -25 | Day 30 | S2 | None (Active calendar dates <= Day 30) |
| `early_vle_sites_visited_d30` | studentVle.csv | Day -25 | Day 30 | S2 | None (Distinct resources accessed <= Day 30) |
| `early_vle_clicks_per_active_day_d30` | Derived | Day -25 | Day 30 | S2 | None (Click intensity ratio <= Day 30) |
| `early_vle_precourse_clicks` | studentVle.csv | Day -25 | Day -1 | S2 | None (Pre-course browsing before Day 0) |
| `early_vle_incourse_clicks_d30` | studentVle.csv | Day 0 | Day 30 | S2 | None (In-course clicks between Day 0 and 30) |
| `early_vle_precourse_ratio` | Derived | Day -25 | Day 30 | S2 | None (Ratio of pre-course to Month 1 clicks) |
