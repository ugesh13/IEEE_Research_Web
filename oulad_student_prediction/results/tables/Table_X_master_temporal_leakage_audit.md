# Table X: Master Programmatic Temporal Leakage Audit Across S0, S1, and S2

| Feature | Source Table | Temporal Filter | Scenario | Latest Allowed Date | Leakage Check Status |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `code_module` | `courses.csv` / `studentInfo.csv` | Intake metadata (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Static institutional metadata** |
| `code_presentation` | `courses.csv` / `studentInfo.csv` | Intake metadata (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Static semester metadata** |
| `gender` | `studentInfo.csv` | Intake declaration (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Demographics fixed at intake** |
| `region` | `studentInfo.csv` | Intake declaration (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Geography fixed at intake** |
| `highest_education` | `studentInfo.csv` | Intake declaration (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Prior attainment fixed at intake** |
| `imd_band` | `studentInfo.csv` | Intake declaration (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Area deprivation fixed at intake** |
| `age_band` | `studentInfo.csv` | Intake declaration (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Demographics fixed at intake** |
| `disability` | `studentInfo.csv` | Intake declaration (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Declared status at intake** |
| `num_of_prev_attempts` | `studentInfo.csv` | Historical enrollment (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Historical repetitions only** |
| `studied_credits` | `studentInfo.csv` | Registration load (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Registered load at intake** |
| `module_presentation_length` | `courses.csv` | Syllabus design (Pre-course) | S0, S1, S2 | Day 0 | **PASSED: Planned duration fixed before start** |
| `date_registration` | `studentRegistration.csv` | `date_registration <= 0` | S0, S1, S2 | Day 0 | **PASSED: Registration timing before course start** |
| `date_registration_imputed_flag` | Derived | Pre-course missingness indicator | S0, S1, S2 | Day 0 | **PASSED: Methodological indicator flag** |
| `early_assessments_submitted_d30` | `studentAssessment.csv` | `date_submitted <= 30 & type != Exam` | S1, S2 | Day 30 | **PASSED: Strictly <= Day 30 submissions only** |
| `has_early_assessment_submission_d30` | Derived | `date_submitted <= 30 & type != Exam` | S1, S2 | Day 30 | **PASSED: Binary early submission flag** |
| `early_avg_score_d30` | `studentAssessment.csv` | `date_submitted <= 30 & type != Exam` | S1, S2 | Day 30 | **PASSED: Score on submissions <= Day 30** |
| `early_min_score_d30` | `studentAssessment.csv` | `date_submitted <= 30 & type != Exam` | S1, S2 | Day 30 | **PASSED: Minimum score <= Day 30** |
| `early_max_score_d30` | `studentAssessment.csv` | `date_submitted <= 30 & type != Exam` | S1, S2 | Day 30 | **PASSED: Maximum score <= Day 30** |
| `early_std_score_d30` | `studentAssessment.csv` | `date_submitted <= 30 & type != Exam` | S1, S2 | Day 30 | **PASSED: Score std <= Day 30** |
| `early_avg_submission_delay_d30` | `studentAssessment.csv` + `assessments.csv` | `date_submitted <= 30 & type != Exam` | S1, S2 | Day 30 | **PASSED: Submission delay <= Day 30** |
| `early_banked_count_d30` | `studentAssessment.csv` | `date_submitted <= 30 & type != Exam` | S1, S2 | Day 30 | **PASSED: Banked credits <= Day 30** |
| `has_early_vle_interaction_d30` | Derived | `date <= 30` | S2 | Day 30 | **PASSED: Binary VLE engagement flag <= Day 30** |
| `early_vle_total_clicks_d30` | `studentVle.csv` | `date <= 30` | S2 | Day 30 | **PASSED: Clicks strictly logged <= Day 30** |
| `early_vle_active_days_d30` | `studentVle.csv` | `date <= 30` | S2 | Day 30 | **PASSED: Active dates strictly logged <= Day 30** |
| `early_vle_sites_visited_d30` | `studentVle.csv` | `date <= 30` | S2 | Day 30 | **PASSED: Resources accessed strictly <= Day 30** |
| `early_vle_clicks_per_active_day_d30` | Derived | `date <= 30` | S2 | Day 30 | **PASSED: Click intensity ratio strictly <= Day 30** |
| `early_vle_precourse_clicks` | `studentVle.csv` | `date < 0` | S2 | Day 0 | **PASSED: Pre-course browsing before Day 0** |
| `early_vle_incourse_clicks_d30` | `studentVle.csv` | `0 <= date <= 30` | S2 | Day 30 | **PASSED: In-course clicks between Day 0 and 30** |
| `early_vle_precourse_ratio` | Derived | `date <= 30` | S2 | Day 30 | **PASSED: Pre-course engagement proportion** |
