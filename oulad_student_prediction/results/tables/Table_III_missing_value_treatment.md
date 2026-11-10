# Table III: Missing Value & Special Value Treatment Summary

| Variable | Issue Detected | Affected Rows | % of Data | Treatment Strategy | Academic Justification |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `imd_band` | 1,111 '?' entries (3.41%) from non-England regions (Scotland, Ireland) | 1,111 | 3.409% | Mapped '?' to dedicated category 'Missing/Not Applicable'; standardized '10-20' to '10-20%' | Avoids synthetic demographic distortion from mode imputation; prevents row deletion bias |
| `date_registration` | 45 '?' entries (0.14%) with missing registration timing | 45 | 0.138% | Imputed with sample median (-57.0 days); added missing indicator flag | Negligible missingness (<0.14%); preserves student records |
| `date_unregistration` | 22,521 '?' (69.09%) non-withdrawn students; 10,072 with unregistration date | 22,521 | 69.091% | Quarantined in raw dataset; barred from all predictive feature matrices | Direct target leakage: perfectly reveals student withdrawal status |
| `assessment_aggregates` | 6,750 students (20.71%) submitted zero assessments | 6,750 | 20.71% | Counts set to 0; missing scores encoded with -1.0; submission indicator flag added | Absence of assessment submission is an authentic behavioral signal, not random missingness |
| `vle_aggregates` | 3,365 students (10.32%) logged zero clicks in the VLE | 3,365 | 10.324% | Set clicks, active days, and sites visited to 0; added engagement indicator flag | Zero interactions represent complete digital disengagement, an authentic predictive signal |
