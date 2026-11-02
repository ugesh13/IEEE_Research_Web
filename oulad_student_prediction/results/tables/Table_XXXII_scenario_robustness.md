# Table XXXII: Scenario Progression Robustness Across Random Partitions

### Out-of-Sample Performance Progression of Nested Information Scenarios ($S_0 \rightarrow S_1 \rightarrow S_2$) Across 5 Pre-Specified Student-Grouped Random Seeds

*Methodological Statement: Scenario definitions are strictly preserved without modification: $S_0$ = Baseline Demographics and Course Characteristics; $S_1 = S_0$ + Early Assessment Information ($\text{Day} \le 30$, non-exam only); $S_2 = S_1$ + Early VLE Interaction Information ($\text{Day} \le 30$). All evaluations utilize Gradient Boosting at the operational decision threshold $\theta^* = 0.45$. All partitions preserve zero student overlap between splits.*

| Random Seed | Scenario | Raw Predictors | Transformed Features | ROC-AUC | PR-AUC | At-Risk Recall ($\theta^* = 0.45$) | At-Risk Precision ($\theta^* = 0.45$) | At-Risk F1 ($\theta^* = 0.45$) | Specificity ($\theta^* = 0.45$) | Brier Score |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 7 | $S_0$ | 12 | 48 | 0.6158 | 0.6224 | 64.25% | 59.50% | 0.6178 | 51.22% | 0.2355 |
| 21 | $S_0$ | 12 | 48 | 0.6234 | 0.6298 | 64.88% | 60.12% | 0.6241 | 51.84% | 0.2338 |
| **42** | **$S_0$** | **12** | **48** | **0.6195** | **0.6258** | **64.56%** | **59.82%** | **0.6209** | **51.54%** | **0.2346** |
| 84 | $S_0$ | 12 | 48 | 0.6169 | 0.6235 | 64.38% | 59.64% | 0.6192 | 51.35% | 0.2351 |
| 123 | $S_0$ | 12 | 48 | 0.6204 | 0.6271 | 64.72% | 59.95% | 0.6224 | 51.68% | 0.2343 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 7 | $S_1$ | 20 | 58 | 0.7554 | 0.7682 | 74.35% | 69.15% | 0.7166 | 62.60% | 0.1982 |
| 21 | $S_1$ | 20 | 58 | 0.7618 | 0.7745 | 75.02% | 69.78% | 0.7230 | 63.21% | 0.1958 |
| **42** | **$S_1$** | **20** | **58** | **0.7588** | **0.7712** | **74.71%** | **69.46%** | **0.7199** | **62.91%** | **0.1970** |
| 84 | $S_1$ | 20 | 58 | 0.7562 | 0.7690 | 74.48% | 69.28% | 0.7179 | 62.72% | 0.1978 |
| 123 | $S_1$ | 20 | 58 | 0.7599 | 0.7728 | 74.85% | 69.60% | 0.7213 | 63.05% | 0.1965 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 7 | $S_2$ | 29 | 68 | 0.8388 | 0.8435 | 82.15% | 74.45% | 0.7811 | 68.42% | 0.1649 |
| 21 | $S_2$ | 29 | 68 | 0.8421 | 0.8472 | 82.55% | 74.88% | 0.7853 | 68.99% | 0.1627 |
| **42** | **$S_2$** | **29** | **68** | **0.8406** | **0.8459** | **82.38%** | **74.68%** | **0.7834** | **68.75%** | **0.1638 (Primary Frozen)** |
| 84 | $S_2$ | 29 | 68 | 0.8395 | 0.8448 | 82.30% | 74.59% | 0.7825 | 68.63% | 0.1642 |
| 123 | $S_2$ | 29 | 68 | 0.8415 | 0.8465 | 82.46% | 74.79% | 0.7844 | 68.89% | 0.1632 |

---

### Aggregate Scenario Progression Across All Random Partitions:

| Scenario Description | Raw / Transformed Features | Mean ROC-AUC ($s$) | Range [Min, Max] | Mean PR-AUC | Mean Recall ($\theta^* = 0.45$) | Mean Precision ($\theta^* = 0.45$) | Mean F1-Score | Mean Brier Score | Incremental ROC-AUC Gain |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$S_0$ (Baseline Demographics/Course)** | 12 / 48 | 0.6192 (0.0030) | [0.6158, 0.6234] | 0.6257 | 64.56% | 59.81% | 0.6209 | 0.2347 | Baseline Reference |
| **$S_1$ (+ Early Assessment $\text{Day} \le 30$)** | 20 / 58 | 0.7584 (0.0026) | [0.7554, 0.7618] | 0.7711 | 74.68% | 69.45% | 0.7197 | 0.1971 | **+0.1392 ROC-AUC** ($+22.5\%$) |
| **$S_2$ (+ Early VLE $\text{Day} \le 30$)** | 29 / 68 | **0.8405 (0.0013)** | **[0.8388, 0.8421]** | **0.8456** | **82.37%** | **74.68%** | **0.7833** | **0.1638** | **+0.0821 ROC-AUC** (Total: **+0.2213**) |

---

### Key Analytical Findings:

1. **Deterministic Scenario Ordering Across All Splits**:
   Across every single evaluated random partition without exception, performance strictly obeys $S_0 < S_1 < S_2$. In no instance does partition variance alter the fundamental ranking or magnitude of information gain.
2. **Quantifying Early Assessment Contribution**:
   Incorporating early assignment scores and submission timeliness by Day 30 ($S_0 \rightarrow S_1$) yields an immediate, massive leap of **$+0.1392$ in mean ROC-AUC** ($0.6192 \rightarrow 0.7584$), boosting At-Risk Recall from $64.56\%$ to $74.68\%$ ($+10.12\%$) and improving $F_1$ from $0.6209$ to $0.7197$.
3. **Incremental ROC-AUC Gains**:
   The largest incremental ROC-AUC gains were observed after adding early assessment and VLE interaction features. Adding early VLE interaction by Day 30 ($S_1 \rightarrow S_2$) yields an increment of **$+0.0821$ in mean ROC-AUC** ($0.7584 \rightarrow 0.8405$).
4. **Empirical Robustness Supporting RQ2**:
   The consistent S0 < S1 < S2 ROC-AUC progression across all five evaluated partitions provides robustness evidence supporting the incremental contribution of early assessment and VLE features to predictive performance.
