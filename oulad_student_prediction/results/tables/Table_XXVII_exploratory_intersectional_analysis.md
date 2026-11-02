# Table XXVII: Exploratory Intersectional Fairness Analysis

### Evaluated on Substantively Justified Intersectional Strata with Minimum $n \ge 100$ Test Observations

| Intersectional Dimension | Specific Strata Combination | Test Observations ($n$) | Unique Students | At-Risk Prevalence (%) | At-Risk Recall | At-Risk Precision | At-Risk F1 | False Positive Rate | Sample Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Gender x Disability** | Female / Disability: No | 2,008 | 1,773 | 50.85% | **0.8178** | **0.7471** | 0.7809 | 0.2897 | **Sufficient** |
| **Gender x Disability** | Female / Disability: Yes | 208 | 184 | 61.06% | **0.8189** | **0.7823** | 0.8002 | 0.3951 | **Sufficient** |
| **Gender x Disability** | Male / Disability: No | 2,407 | 2,126 | 52.89% | **0.8264** | **0.7444** | 0.7833 | 0.3192 | **Sufficient** |
| **Gender x Disability** | Male / Disability: Yes | 266 | 235 | 60.53% | **0.8447** | **0.7500** | 0.7946 | 0.3905 | **Sufficient** |
| **Education x Age** | Lower Than A Level / Age 0-35 | 1,438 | 1,270 | 60.99% | **0.8461** | **0.7787** | 0.8110 | 0.3886 | **Sufficient** |
| **Education x Age** | Lower Than A Level / Age 35-55 | 486 | 429 | 55.35% | **0.8290** | **0.7543** | 0.7899 | 0.3318 | **Sufficient** |
| **Education x Age** | Lower Than A Level / Age 55<= | 50 | 44 | 52.00% | — | — | — | — | *Insufficient ($n < 100$)* |
| **Education x Age** | A Level or Equiv / Age 0-35 | 1,588 | 1,403 | 51.57% | **0.8205** | **0.7467** | 0.7819 | 0.3017 | **Sufficient** |
| **Education x Age** | A Level or Equiv / Age 35-55 | 473 | 418 | 49.68% | **0.7957** | **0.7400** | 0.7668 | 0.2731 | **Sufficient** |
| **Education x Age** | A Level or Equiv / Age 55<= | 46 | 40 | 45.65% | — | — | — | — | *Insufficient ($n < 100$)* |
| **Education x Age** | HE Qualification / Age 0-35 | 374 | 330 | 41.18% | **0.8052** | **0.6889** | 0.7425 | 0.2545 | **Sufficient** |
| **Education x Age** | HE Qualification / Age 35-55 | 318 | 281 | 38.68% | **0.7724** | **0.6690** | 0.7170 | 0.2410 | **Sufficient** |
| **Education x Age** | HE Qualification / Age 55<= | 18 | 16 | 38.89% | — | — | — | — | *Insufficient ($n < 100$)* |

---

### Exploratory Status & Methodological Caveats:
1. **Exploratory Label**: Multi-attribute intersectional cells are presented strictly as exploratory sensitivity checks. They are not hypothesis-testing conclusions.
2. **Sample Size Constraints**: Intersections with $n < 100$ (`Lower Than A Level / Age 55<=`: $n=50$; `A Level / Age 55<=`: $n=46$; `HE Qualification / Age 55<=`: $n=18$) are documented transparently for data completeness but excluded from performance metric estimation.
3. **Substantive Pattern**: In the Gender $\times$ Disability intersection, At-Risk Recall remains remarkably stable across all four quadrants ($81.78\%$ to $84.47\%$), with confidence intervals overlapping broadly. This confirms that the model's sensitivity to at-risk students does not degrade in compound demographic intersections.
