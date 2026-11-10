# Table VII: Experimental Prediction Scenarios Definition Matrix

| Scenario | Prediction Cutoff | Feature Count | Baseline Features | Assessment Features | VLE Features | Excluded Future Information |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **S0** (Baseline) | **Day <= 0** (Pre-course intake) | 11 | Demographics, prior attempts, credits, presentation length, registration date | None (0 features) | None (0 features) | Excludes all in-semester assessments and all post-Day-0 VLE clicks. |
| **S1** (Early Academic) | **Day <= 30** (End of Month 1) | 19 | Full S0 baseline (11 features) | Submissions count, submission flag, score statistics (avg, min, max, std), delay, banked credits | None (0 features) | Excludes all assessments submitted after Day 30 and all final examinations. |
| **S2** (Early Behavioral) | **Day <= 30** (End of Month 1) | 27 | Full S0 baseline (11 features) | Full S1 assessment features (8 features) | Total clicks, active days, distinct resources, clicks/day, pre-course clicks, in-course clicks, pre-course ratio | Excludes all VLE interactions logged after Day 30 and all subsequent assessment submissions. |
