# Table VI: Data Quality Comparison (Before vs. After Cleaning)

| Variable | Raw / Initial Data Type | Initial Missing / Anomalous (%) | Cleaned Analytical Data Type | Cleaned Missing (%) | Transformation / Resolution Applied |
| :--- | :--- | :---: | :--- | :---: | :--- |
| `code_module` | Object / String | 0 (0.0%) | Categorical (`category`) | 0 (0.0%) | Preserved nominal categories (`AAA` - `GGG`). |
| `code_presentation` | Object / String | 0 (0.0%) | Categorical (`category`) | 0 (0.0%) | Preserved nominal intakes (`2013B` - `2014J`). |
| `id_student` | Integer (`int64`) | 0 (0.0%) | Identifier (`int64`) | 0 (0.0%) | Preserved as grouping key for cross-validation. |
| `gender` | Object / String | 0 (0.0%) | Binary Categorical (`M`/`F`) | 0 (0.0%) | Verified 2 binary levels (`M` 55.0%, `F` 45.0%). |
| `region` | Object / String | 0 (0.0%) | Categorical (`category`) | 0 (0.0%) | Verified 13 nominal UK geographic administrative regions. |
| `highest_education` | Object / String | 0 (0.0%) | Ordinal Categorical | 0 (0.0%) | 5 natural educational attainment levels preserved. |
| `imd_band` | Object / String (`?`, `10-20`) | **1,111 (3.41%)** | Categorical (11 levels) | **0 (0.0%)** | Mapped `?` to `Missing/Not Applicable`; formatted `10-20` to `10-20%`. |
| `age_band` | Object / String | 0 (0.0%) | Ordinal Categorical | 0 (0.0%) | 3 ordinal bands preserved (`0-35`, `35-55`, `55<=`). |
| `num_of_prev_attempts` | Integer (`int64`) | 0 (0.0%) | Numeric (`int64`) | 0 (0.0%) | Range 0 to 6; authentic repeat student records retained. |
| `studied_credits` | Integer (`int64`) | 0 (0.0%) | Numeric (`int64`) | 0 (0.0%) | Range 30 to 655; cognitive overload signal retained. |
| `disability` | Object / String | 0 (0.0%) | Binary Categorical (`Y`/`N`) | 0 (0.0%) | Declared disability status preserved. |
| `module_presentation_length` | Integer (`int64`) | 0 (0.0%) | Numeric (`int64`) | 0 (0.0%) | Preserved course duration (234 to 269 days). |
| `date_registration` | Object / String (`?`) | **45 (0.14%)** | Continuous (`float64`) | **0 (0.0%)** | Imputed with sample median (-57.0 days); added indicator flag. |
| `date_unregistration` | Object / String (`?`) | 22,521 (69.09%) | Quarantined Audit Object | Quarantined | **Strictly barred from predictive models (Target Leakage Hazard).** |
| `total_assessments_submitted` | Float (`float64`) | **6,750 (20.71%)** | Continuous (`float64`) | **0 (0.0%)** | Nulls replaced with 0; non-submission indicator flag created. |
| `avg_assessment_score` | Float (`float64`) | **6,750 (20.71%)** | Continuous (`float64`) | **0 (0.0%)** | Non-submitting students assigned structured flag (-1.0). |
| `total_vle_clicks` | Float (`float64`) | **3,365 (10.32%)** | Continuous (`float64`) | **0 (0.0%)** | Nulls replaced with 0 (unengaged students). |
| `total_vle_active_days` | Float (`float64`) | **3,365 (10.32%)** | Continuous (`float64`) | **0 (0.0%)** | Nulls replaced with 0 (unengaged students). |
| `total_vle_sites_visited` | Float (`float64`) | **3,365 (10.32%)** | Continuous (`float64`) | **0 (0.0%)** | Nulls replaced with 0 (unengaged students). |
| `is_at_risk` (Primary Target) | Integer (`int64`) | 0 (0.0%) | Binary Label (`int32`) | 0 (0.0%) | 1 = At-Risk (52.80%), 0 = Successful (47.20%). |
| `final_result` (Secondary Target)| Object / String | 0 (0.0%) | Multiclass Label (`category`) | 0 (0.0%) | Distinction (9.28%), Pass (37.93%), Fail (21.64%), Withdrawn (31.16%). |
