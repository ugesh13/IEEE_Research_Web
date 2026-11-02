# Table XIII: Preprocessing Pipeline Leakage & Training-Fold Isolation Audit

| Audit Check ID | Verification Description | S0 Result | S1 Result | S2 Result | Compliance Status |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **A1** | Test partition ($N = 4,889$) strictly excluded from fitting preprocessing | 0 test rows used | 0 test rows used | 0 test rows used | **PASSED** |
| **A2** | Validation partition ($N = 4,889$) strictly excluded from fitting preprocessing | 0 val rows used | 0 val rows used | 0 val rows used | **PASSED** |
| **A3** | Numerical imputation statistics (medians) learned exclusively on training partition ($N = 22,815$) | Learned on $X_{\text{train}}$ only | Learned on $X_{\text{train}}$ only | Learned on $X_{\text{train}}$ only | **PASSED** |
| **A4** | Categorical encoder categories (47 binary columns) learned exclusively on training partition ($N = 22,815$) | Learned on $X_{\text{train}}$ only | Learned on $X_{\text{train}}$ only | Learned on $X_{\text{train}}$ only | **PASSED** |
| **A5** | OneHotEncoder parameter `handle_unknown='ignore'` enabled to prevent runtime errors on unseen categories | Enabled | Enabled | Enabled | **PASSED** |
| **A6** | Scaling parameters ($\mu, \sigma$) learned exclusively on training partition ($N = 22,815$) | Learned on $X_{\text{train}}$ only | Learned on $X_{\text{train}}$ only | Learned on $X_{\text{train}}$ only | **PASSED** |
| **A7** | Primary binary prediction target (`is_at_risk`) excluded from predictor matrices | Excluded ($0$ presence) | Excluded ($0$ presence) | Excluded ($0$ presence) | **PASSED** |
| **A8** | Secondary outcome target (`final_result`) excluded from predictor matrices | Excluded ($0$ presence) | Excluded ($0$ presence) | Excluded ($0$ presence) | **PASSED** |
| **A9** | Administrative grouping key (`id_student`) excluded from predictor matrices | Excluded ($0$ presence) | Excluded ($0$ presence) | Excluded ($0$ presence) | **PASSED** |
| **A10** | Post-enrollment unregistration date (`date_unregistration`) quarantined and excluded | Excluded ($0$ presence) | Excluded ($0$ presence) | Excluded ($0$ presence) | **PASSED** |
| **A11** | Partition markers (`partition`, `cv_fold`) excluded from predictor matrices | Excluded ($0$ presence) | Excluded ($0$ presence) | Excluded ($0$ presence) | **PASSED** |
| **A12** | Global median imputation for `date_registration` reverted to NaN prior to fold-isolated imputer | Verified | Verified | Verified | **PASSED** |
| **A13** | Explicit missingness indicator `date_registration_imputed_flag` preserved as an independent predictor | Preserved | Preserved | Preserved | **PASSED** |
| **A14** | Early assessment scores represent unsubmitted as NaN + explicit indicator flag `has_early_assessment_submission_d30` | Verified | Verified | Verified | **PASSED** |
| **A15** | Feature alignment: Transformed feature dimensions match identically across Train, Val, and Test | 52 columns | 60 columns | 68 columns | **PASSED** |
| **A16** | Absence of missing values in transformed output matrices across Train, Val, and Test | 0 NaNs remaining | 0 NaNs remaining | 0 NaNs remaining | **PASSED** |

---

### Audit Verification Summary
All 16 programmatic checks verified zero data leakage. All feature transformers, statistical estimators, imputers, scalers, and encoders are strictly isolated within the training fold ($N = 22,815$), while validation ($N = 4,889$) and test holdout ($N = 4,889$) sets are evaluated strictly via forward transformation.
