# Table II: OULAD Data Integration Protocol & Merging Summary

| Pipeline Stage | Left Table | Right Table / Source | Join Keys | Join Type | Pre-Merge Rows | Post-Merge Rows | Duplicate Key Check | Features Added |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Stage 1: Base Table** | `studentInfo.csv` | *Base population* | `(code_module, code_presentation, id_student)` | N/A | 32,593 | 32,593 | **0 duplicates** (32,593 unique) | Demographic indicators, prior attempts, studied credits, ground-truth `final_result`. |
| **Stage 2: Module Context** | `studentInfo` | `courses.csv` | `(code_module, code_presentation)` | Left Join | 32,593 | 32,593 | **0 duplicates** | `module_presentation_length` |
| **Stage 3: Registration** | Merged (Stage 2) | `studentRegistration.csv` | `(code_module, code_presentation, id_student)` | Left Join | 32,593 | 32,593 | **0 duplicates** | `date_registration` *(Note: `date_unregistration` quarantined to prevent target leakage)*. |
| **Stage 4: Assessment Aggregation** | Merged (Stage 3) | Aggregated `studentAssessment` & `assessments` | `(code_module, code_presentation, id_student)` | Left Join | 32,593 | 32,593 | **0 duplicates** | `total_assessments_submitted`, `avg_assessment_score`, `min_assessment_score`, `max_assessment_score`, `std_assessment_score`, `avg_submission_delay`, `total_banked_assessments`. |
| **Stage 5: VLE Interaction Aggregation** | Merged (Stage 4) | Aggregated `studentVle.csv` (10.65M clicks) | `(code_module, code_presentation, id_student)` | Left Join | 32,593 | 32,593 | **0 duplicates** | `total_vle_clicks`, `total_vle_active_days`, `total_vle_sites_visited`, `avg_clicks_per_active_day`. |
| **Stage 6: Target Encoding** | Integrated analytical dataset | Operational mapping | N/A | In-place | 32,593 | 32,593 | **0 duplicates** | `is_at_risk` (Primary: 1=Fail/Withdrawn, 0=Pass/Distinction); `final_result` (Secondary: 4-class). |

---

### Referential Integrity & Participation Metrics
* **Total Analytical Population**: Exactly **32,593** student-course-presentations across **28,785** distinct students.
* **Assessment Participation**: 25,843 (79.29%) student presentations submitted at least 1 assessment; 6,750 (20.71%) submitted zero assessments (primarily early withdrawals).
* **VLE Digital Participation**: 29,228 (89.68%) student presentations logged at least 1 interaction on the VLE; 3,365 (10.32%) never engaged with digital materials.
* **Leakage Protocol Status**: Passed. `date_unregistration` isolated; final exam scores excluded.
