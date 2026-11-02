# Table XVI: Final Model Architecture & Evaluation Specification

### Frozen Specification Prior to Test Set Evaluation

| Specification Dimension | Frozen Parameter / Architecture Decision | Rationale / Empirical Selection Basis |
| :--- | :--- | :--- |
| **Selected Scenario** | **Scenario $S_2$ (Early Behavioral)** | Achieved highest 5-fold CV ROC-AUC ($0.8410 \pm 0.0045$) and validation ROC-AUC ($0.8425$), delivering $+0.2217$ AUC gain over $S_0$ and $+0.0833$ over $S_1$. |
| **Prediction Cutoff** | **Day $\le 30$** (First month of module presentation) | Earliest time window balancing high discriminative power with ample institutional lead time for academic intervention. |
| **Predictor Features** | **29 raw predictors** (21 numerical, 8 categorical) $\rightarrow$ **68 transformed features** | Integrates demographic intake attributes, early graded assessment submissions, and early VLE digital clickstream. |
| **Model Family** | **Gradient Boosted Decision Trees** (`HistGradientBoostingClassifier`) | Outperformed Logistic Regression ($0.8168$) and Random Forest ($0.8321$) across all discriminative and probabilistic metrics. |
| **Hyperparameters** | `learning_rate=0.05, max_iter=200, max_leaf_nodes=31, min_samples_leaf=20, class_weight=None` | Optimized on 5-fold student-grouped cross-validation on $X_{\text{train}}$ ($N = 22,815$). Zero non-convergence issues. |
| **Preprocessing Pipeline** | Tree-based `ColumnTransformer` (Median imputation for numericals, mode imputation + OneHotEncoder for categoricals; scaling omitted) | Preserves raw split boundary interpretability and tree invariance to monotonic scaling. |
| **Probability Calibration** | **Base Estimator Native Sigmoid Probabilities** | Evaluated on base `HistGradientBoostingClassifier` log-loss outputs (validation Brier: $0.1624$, test Brier: $0.1638$). Platt (sigmoid) scaling evaluated as an auxiliary calibration diagnostic on validation (reducing Brier to $0.1610$). |
| **Operational Threshold** | **$\theta^* = 0.45$** (Conservative Early-Warning Threshold) | Predefined rule: $\theta^* = \max\{\theta : \text{Recall}(\theta) \ge 0.82 \text{ and } \text{Precision}(\theta) \ge 0.70\}$. Selects the highest threshold satisfying both constraints to maintain an $82\%$ recall floor while limiting false alarms (716 vs 819 at $\theta = 0.40$). |
| **Standard Threshold** | **$\theta = 0.50$** (Secondary Comparative Benchmark) | Standard baseline threshold retained for direct literature comparison ($80.86\%$ validation recall, $76.03\%$ precision). |
| **Statistical Max-F1 Point** | **$\theta = 0.40$** (Reported in Sensitivity Analysis) | Identifies the statistical maximum validation F1 point ($0.7872$, Recall: $85.51\%$, Precision: $72.93\%$), explicitly distinguished from the conservative operational threshold ($\theta^* = 0.45$). |
| **Random Seed** | `RANDOM_SEED = 42` | Enforced universally across all splits, estimators, and bootstrap replicates. |
