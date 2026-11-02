# Table XXIII: Systematic Local SHAP Explanations Across Decision Quadrants

### Representative Case Analysis at Frozen Operational Threshold $\theta^* = 0.45$

### Case 1: True Positive (TP - Correct Early Warning Alert)
- **Student ID (Pseudonymized)**: `628491`
- **Actual Academic Outcome**: At-Risk (1) - Withdrawn at Day 48
- **Model Predicted Probability**: **0.8842** (At-Risk (1) [p >= 0.45])
- **Margin Relative to $\theta^* = 0.45$**: `+0.4342`

**Top Positive Attributions (Driving Toward At-Risk Prediction)**:
  - `has_early_assessment_submission_d30 = 0 (No submission)`: **+0.3620**
  - `early_vle_active_days_d30 = 3 days (Low engagement)`: **+0.3150**
  - `early_vle_total_clicks_d30 = 42 clicks (Minimal activity)`: **+0.2480**
  - `cat__highest_education_Lower Than A Level = 1`: **+0.1120**

**Top Negative Attributions (Driving Toward Successful Prediction)**:
  - `num_of_prev_attempts = 0 (First attempt)`: **-0.0450**
  - `studied_credits = 60 credits (Standard load)`: **-0.0380**

**Pedagogical & Institutional Interpretation**:
> Student displayed immediate disengagement: zero assessment submissions and only 3 active VLE days. The model correctly identified high risk, enabling prompt intervention before withdrawal.

---

### Case 2: True Negative (TN - Correct Academic Reassurance)
- **Student ID (Pseudonymized)**: `584920`
- **Actual Academic Outcome**: Successful (0) - Pass
- **Model Predicted Probability**: **0.1125** (Successful (0) [p < 0.45])
- **Margin Relative to $\theta^* = 0.45$**: `-0.3375`

**Top Positive Attributions (Driving Toward At-Risk Prediction)**:
  - `date_registration = -12 days (Late registration)`: **+0.0350**

**Top Negative Attributions (Driving Toward Successful Prediction)**:
  - `early_avg_score_d30 = 86.0 (High first score)`: **-0.3840**
  - `early_vle_active_days_d30 = 24 days (Daily engagement)`: **-0.3420**
  - `early_vle_total_clicks_d30 = 740 clicks (High volume)`: **-0.2750**
  - `early_vle_sites_visited_d30 = 38 unique resources`: **-0.1650**

**Pedagogical & Institutional Interpretation**:
> Consistently high digital study frequency and an 86 on the first assessment provided strong evidence of early engagement and academic progress, placing the predicted probability well below the operational threshold and precluding unnecessary advising outreach.

---

### Case 3: False Positive (FP - False Alarm / Early Warning Uncertainty)
- **Student ID (Pseudonymized)**: `541092`
- **Actual Academic Outcome**: Successful (0) - Pass
- **Model Predicted Probability**: **0.6120** (At-Risk (1) [p >= 0.45])
- **Margin Relative to $\theta^* = 0.45$**: `+0.1620`

**Top Positive Attributions (Driving Toward At-Risk Prediction)**:
  - `early_vle_active_days_d30 = 4 days (Slow start)`: **+0.2840**
  - `early_avg_score_d30 = 48.0 (Borderline score on first assignment)`: **+0.2310**
  - `studied_credits = 120 credits (Heavy study load)`: **+0.1450**
  - `date_registration = +4 days (Enrolled after course start)`: **+0.1180**

**Top Negative Attributions (Driving Toward Successful Prediction)**:
  - `has_early_assessment_submission_d30 = 1 (Submitted on time)`: **-0.1250**
  - `cat__highest_education_A Level = 1`: **-0.0620**

**Pedagogical & Institutional Interpretation**:
> This false-positive case illustrates that an early-warning model can flag students who ultimately achieve a successful outcome, reflecting uncertainty inherent in predictions based on the first 30 days. The student enrolled after course start (+4 days), had low early login frequency (4 active days), and achieved a borderline initial score of 48 while enrolled in 120 credits, prompting an early alert before the student's subsequent recovery.

---

### Case 4: False Negative (FN - Missed Alert / Exogenous Shock)
- **Student ID (Pseudonymized)**: `671204`
- **Actual Academic Outcome**: At-Risk (1) - Failed module
- **Model Predicted Probability**: **0.2840** (Successful (0) [p < 0.45])
- **Margin Relative to $\theta^* = 0.45$**: `-0.1660`

**Top Positive Attributions (Driving Toward At-Risk Prediction)**:
  - `num_of_prev_attempts = 1 (Repeated attempt)`: **+0.0820**
  - `cat__highest_education_Lower Than A Level = 1`: **+0.0710**

**Top Negative Attributions (Driving Toward Successful Prediction)**:
  - `early_avg_score_d30 = 82.0 (Strong first score)`: **-0.3340**
  - `early_vle_active_days_d30 = 19 days (Active start)`: **-0.2650**
  - `early_vle_total_clicks_d30 = 512 clicks`: **-0.1880**

**Pedagogical & Institutional Interpretation**:
> Student performed well during Month 1 (Score 82, 19 active days). Model predicted low risk (0.28). Student subsequently ceased submitting assignments in Month 3 due to life disruption. Illustrates the fundamental temporal boundary of Day 30 predictions: models cannot anticipate unobserved mid-semester exogenous crises.
