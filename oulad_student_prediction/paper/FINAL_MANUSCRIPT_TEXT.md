# Student Performance Prediction Using Machine Learning and Explainable AI: An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)

**Anonymous Authors**  
*Institutional Affiliation Omitted for Blind Peer Review*  

---

### Abstract
Early identification of students at risk of academic failure or withdrawal is a critical challenge in distance higher education. Traditional student performance prediction models frequently rely on static intake demographics or full-semester behavioral aggregates that introduce temporal data leakage. In this study, we formulate a leakage-safe early-warning framework using the Open University Learning Analytics Dataset (OULAD), comprising 32,593 course registrations from 28,785 unique students across seven modular subjects. We investigate three nested temporal information horizons strictly bounded to the initial 30 days of the academic presentation: static intake demographics ($S_0$), early continuous assessment milestones ($S_1$, $\text{Day} \le 30$), and high-frequency Virtual Learning Environment (VLE) interaction clickstreams ($S_2$, $\text{Day} \le 30$). To eliminate data contamination caused by repeated student enrollments, we implement student-level grouped partitioning (70% train, 15% validation, 15% holdout test). Under 5-fold student-grouped cross-validation, Histogram-based Gradient Boosting (`HistGradientBoostingClassifier`) demonstrated superior predictive discrimination over Random Forests and Logistic Regression. On the locked holdout test set ($N = 4,889$ course-presentation observations, $4,318$ unique students), the primary model achieved an ROC-AUC of $0.8406$, a PR-AUC of $0.8459$, an accuracy of $75.95\%$, an At-Risk Recall of $82.38\%$, a Precision of $74.68\%$, an $F_1$-score of $0.7834$, and an uncalibrated Brier score of $0.1638$ under a pre-specified operational threshold of $\theta^* = 0.45$. Sequential scenario evaluation established substantial incremental discrimination gains ($S_0 \rightarrow S_1: +0.1384$ ROC-AUC; $S_1 \rightarrow S_2: +0.0833$ ROC-AUC; cumulative: $+0.2217$), confirmed across five independent random partitions ($100\%$ monotonic consistency). Game-theoretic explainability using Shapley Additive exPlanations (SHAP) indicated that Academic Milestones ($33.22\%$) and VLE Engagement ($32.61\%$) together accounted for $65.83\%$ of aggregated model attribution, compared with $34.17\%$ for remaining intake characteristics. Descriptive subgroup auditing under the common operational threshold revealed comparable sensitivity across gender ($81.79\%$ Female vs. $82.85\%$ Male) and declared disability ($83.33\%$ Disability vs. $82.26\%$ Non-Disability). These findings demonstrate that early academic and digital behavioral traces provide strong predictive signals for early-warning systems, though observational constraints require non-causal interpretation and multi-institutional validation.

**Index Terms**—Student Performance Prediction, Learning Analytics, Educational Data Mining, Explainable Artificial Intelligence, SHAP, Early Warning Systems, Gradient Boosting, OULAD.

---

## I. INTRODUCTION

Higher education institutions offering distance and online learning face persistently high student attrition rates, with non-completion frequently exceeding 40% [1], [2]. In open-entry distance education models, such as The Open University (UK), students enter with diverse educational backgrounds, work commitments, and psychosocial circumstances [1]. Because instructional contact occurs primarily through online learning management systems, course tutors lack the informal observational cues available in physical classrooms to detect disengagement before students fail assignments or withdraw [2], [4]. Consequently, early warning systems (EWS) that identify students at risk of non-completion early in the academic semester are essential for targeted institutional advisement and proactive student support [2], [5].

A prominent challenge in educational data mining (EDM) is determining the earliest temporal horizon at which reliable risk predictions can be generated [2], [3]. Static student demographic characteristics (e.g., socioeconomic status, prior educational attainment, age, and disability) are available at enrollment [1]. However, empirical studies indicate that static attributes alone exhibit limited predictive discrimination, misclassifying a substantial proportion of vulnerable learners and raising concerns regarding demographic profiling [2], [8]. Conversely, models that aggregate behavioral clickstream data across the entire semester achieve high apparent accuracy but are practically unusable for timely pedagogical interventions [2]. Furthermore, naive data extraction across course lifecycles frequently introduces insidious temporal leakage—such as incorporating post-enrollment unregistration timestamps or end-of-term examination submissions into training matrices—thereby producing artificially inflated performance metrics that fail in operational deployment [1], [2].

Beyond predictive accuracy, educational stakeholders require interpretable rationales before dispatching academic advisors or counseling resources [7]. Black-box predictions without explanatory grounding risk misdirecting resources or encountering advisor resistance [7]. Simultaneously, the deployment of automated predictive systems necessitates descriptive evaluation across student demographic strata to detect whether predictive sensitivity varies substantially across protected or historically marginalized subgroups under uniform institutional decision thresholds [8], [9].

To address these empirical and methodological challenges, this study presents a rigorous experimental investigation of early student performance prediction using the Open University Learning Analytics Dataset (OULAD) [1]. We establish a leakage-quarantined processing pipeline, evaluate three nested temporal information horizons ($S_0, S_1, S_2$) strictly bounded at Day 30 of the semester, enforce student-level grouped splitting, compare multiple machine learning families, audit probability calibration and operational threshold trade-offs, compute global and local SHAP attributions [6], and evaluate subgroup performance and statistical robustness [9].

### A. Contributions
This study provides the following specific contributions:
1. **Leakage-Safe Temporal Pipeline**: We define an explicit *Filter $\rightarrow$ Aggregate $\rightarrow$ Model* processing protocol that strictly quarantines post-Day 30 traces, unregistration timestamps, and examination data, guaranteeing that all predictors reflect information genuinely accessible to an early-warning system at Day 30.
2. **Nested Scenario Progression**: We evaluate three progressive information horizons ($S_0$: Intake, $S_1$: Early Academic, $S_2$: Early Behavioral) across multiple model architectures and demonstrate monotonic predictive gains across five independent random partitions.
3. **Student-Grouped Evaluation**: We enforce student-level block partitioning across train, validation, and holdout test splits, eliminating data contamination stemming from the 11.7% repeat-enrollment rate in OULAD.
4. **Game-Theoretic Feature Attribution**: Using SHAP, we quantify the predictive reliance of tree-based ensembles across feature families, demonstrating that early dynamic behaviors account for nearly two-thirds of model attribution.
5. **Descriptive Subgroup Auditing**: We evaluate the frozen model under an identical operational threshold across gender, disability, prior educational attainment, and socioeconomic deprivation deciles, reporting point estimates alongside cluster bootstrap confidence intervals.
6. **Multi-Faceted Sensitivity Analysis**: We quantify model robustness across random partition seeds, bootstrap uncertainty estimators, operational threshold variations, and loss-function class-weight treatments.

### B. Research Questions
The study addresses four primary non-causal research questions:
- **RQ1**: *Which machine-learning models provide the strongest predictive performance across multiple evaluation metrics under student-grouped validation?*
- **RQ2**: *How much incremental predictive information is obtained by sequentially adding early graded assessment submissions and high-frequency virtual learning environment (VLE) interaction data?*
- **RQ3**: *Which student-level features contribute most strongly to the model's predicted At-Risk probability according to SHAP-based attribution?*
- **RQ4**: *How does predictive performance vary across selected demographic and educational subgroups under a common operating threshold?*

---

## II. RELATED WORK

### A. Learning Analytics and Student Performance Prediction
Learning Analytics (LA) and Educational Data Mining (EDM) have evolved from descriptive retrospective reporting toward predictive early-warning architectures [3]–[5]. Foundational reviews by Romero and Ventura [3] and Baker and Inventado [5] categorized student modeling techniques across regression, decision trees, neural networks, and Bayesian networks. In distance learning environments, early student withdrawal is a dominant failure mode [1], [2]. Hlosta et al. [2] demonstrated that early digital footprints within the Open University VLE could identify struggling students within the initial weeks of study, highlighting that prediction accuracy tends to plateau after initial graded milestones. However, many published studies on OULAD collapse the temporal dimension, aggregating student clicks over the entire module presentation or using unregistration dates, thereby introducing severe temporal leakage that invalidates real-world deployment claims [1], [2].

### B. Machine Learning Algorithms in Early Warning Systems
Tree-based ensemble algorithms, including Random Forests [12] and Gradient Boosting Machines [10], consistently outperform linear models in tabular educational settings [2]. Friedman [10] established the foundational gradient boosting formulation, which was subsequently optimized via histogram-based binning in LightGBM [11]. Histogram-based gradient boosting natively accommodates continuous numerical features with extreme positive skewness (such as click volumes), missing values arising from unsubmitted assignments, and non-linear interactions between study frequency and academic pacing [11].

### C. Explainable AI and Feature Attribution
The adoption of algorithmic decision aids in education depends on transparent explanations [7]. Khosravi et al. [7] formulated the XAI-ED framework, emphasizing that pedagogical stakeholders require human-interpretable feature attributions to design actionable interventions. Lundberg and Lee [6] unified additive feature attribution methods through SHAP, grounding feature importance in cooperative game-theoretic Shapley values. SHAP provides local accuracy, missingness, and consistency guarantees, enabling educators to audit both macro-level curriculum influences and individual student risk profiles [6], [7].

### D. Algorithmic Fairness and Subgroup Evaluation
As predictive models increasingly inform institutional resource allocation, concerns regarding algorithmic fairness and disparate impact have emerged [8], [9]. Baker and Hawn [8] documented that algorithmic bias in education frequently arises from historical disparities embedded in training data or differential base rates across student groups. Gardner et al. [9] proposed slicing analysis to audit predictive student models across demographic and curricular strata, demonstrating that predictive performance and subgroup disparities can vary independently across algorithms. Consistent with modern ethical frameworks, subgroup evaluations in observational learning analytics must be reported descriptively alongside target prevalence rather than making unsubstantiated claims of universal fairness or bias elimination [8], [9].

---

## III. DATASET AND DATA DESCRIPTION

The empirical analyses in this study are conducted on the Open University Learning Analytics Dataset (OULAD) [1]. OULAD comprises anonymized records from 22 course presentations of seven undergraduate modules (coded `AAA` through `GGG`) spanning two academic years (2013 and 2014, with February `'B'` and October `'J'` starts).

### A. Raw Relational Structure
The raw dataset consists of seven relational tables:
1. `studentInfo.csv`: Demographic, geographic, and socioeconomic attributes for 32,593 course registrations ($28,785$ unique students).
2. `studentRegistration.csv`: Dates of initial course registration and unregistration relative to module start date (Day 0).
3. `studentAssessment.csv`: $173,912$ individual assessment submission records, including submission dates, scores ($0-100$), and assessment identifiers.
4. `assessments.csv`: Metadata for 206 modular assessments, specifying assessment type (Tutor-Marked Assignment `TMA`, Computer-Marked Assignment `CMA`, Final Exam `Exam`), due date, and weight.
5. `studentVle.csv`: $10,655,280$ daily student clickstream interaction records across learning resources.
6. `vle.csv`: Metadata for 6,364 digital resources within the virtual learning environment, categorized by activity type (`oucontent`, `forumng`, `homepage`, `resource`, `subpage`, `url`, `quiz`, etc.).
7. `courses.csv`: Module presentation lengths in days (typically $240-269$ days).

```
+------------------+         +-------------------------+
|   courses.csv    |         | studentRegistration.csv |
+------------------+         +-------------------------+
        |                                 |
        +----------------+----------------+
                         |
                         v
               +-------------------+
               |  studentInfo.csv  | <--- Analytical Unit:
               +-------------------+      (code_module, code_presentation, id_student)
                 |               |
                 v               v
+-----------------------+  +------------------+
| studentAssessment.csv |  |  studentVle.csv  |
+-----------------------+  +------------------+
        |                          |
        v                          v
+-----------------------+  +------------------+
|    assessments.csv    |  |     vle.csv      |
+-----------------------+  +------------------+
```

### B. Analytical Unit
The fundamental analytical unit is the course-presentation enrollment tuple:
$$\text{Unit} = (\text{code\_module}, \text{code\_presentation}, \text{id\_student})$$
Because students can enroll in multiple modules simultaneously or repeat courses across semesters, the dataset contains $32,593$ presentation enrollments representing $28,785$ unique individuals ($11.7\%$ repeat enrollment rate). Raw transaction logs in `studentAssessment` and `studentVle` cannot be modeled directly due to variable transaction lengths per student; they were programmatically filtered and aggregated to the analytical unit before model ingestion.

---

## IV. TARGET DEFINITION

The final institutional outcome in OULAD is recorded in `final_result` across four categorical classes: `Distinction`, `Pass`, `Fail`, and `Withdrawn`.

### A. Primary Binary Target Formulation
In educational early-warning systems, the primary operational objective is to identify students who will not complete the course successfully without timely intervention. Following established learning analytics methodology [1], [2], we formulate a primary binary target `is_at_risk`:
$$\text{is\_at\_risk} = \begin{cases} 1, & \text{if } \text{final\_result} \in \{\text{Fail}, \text{Withdrawn}\} \quad (\text{At-Risk}) \\ 0, & \text{if } \text{final\_result} \in \{\text{Pass}, \text{Distinction}\} \quad (\text{Successful}) \end{cases}$$

Across the full dataset ($N = 32,593$), the outcome distribution is:
- **Successful** ($y = 0$): $15,385$ ($47.20\%$) [Pass: $12,361$ ($37.93\%$), Distinction: $3,024$ ($9.28\%$)]
- **At-Risk** ($y = 1$): $17,208$ ($52.80\%$) [Withdrawn: $10,156$ ($31.16\%$), Fail: $7,052$ ($21.64\%$)]

*Methodological Clarification*: Grouping `Fail` and `Withdrawn` constitutes an operational early-intervention formulation designed to trigger advising outreach. It does not imply that dropping out and failing represent identical academic or psychosocial processes.

### B. Exploratory Four-Class Formulation
As an auxiliary descriptive reference, we also evaluate the uncollapsed four-class institutional outcome space (`Distinction`, `Pass`, `Fail`, `Withdrawn`). This multi-class mapping is treated strictly as an exploratory, non-validated extension because it did not undergo the independent threshold optimization or validation calibration applied to the binary pipeline.

---

## V. DATA INTEGRATION AND PREPROCESSING

Data integration was governed by strict leakage-prevention protocols.

### A. Temporal Leakage Quarantine
1. **Unregistration Date Exclusion**: The variable `date_unregistration` in `studentRegistration.csv` indicates the exact day a student dropped out. Retaining this feature causes severe target leakage because its presence directly signals withdrawal. `date_unregistration` was strictly quarantined and excluded from all feature matrices.
2. **Examination Exclusion**: All end-of-course final examinations (`assessment_type == 'Exam'`) were removed prior to feature computation, as exams occur at the conclusion of the course.
3. **Temporal Horizon Truncation**: All assessment submissions and VLE click logs occurring after Day 30 of the presentation were removed prior to aggregation.

### B. Missing Value Treatment and Categorical Encoding
- **Numerical Features**: Features derived from assessment scores (e.g., `early_avg_score_d30`) contain missing values when a student submitted zero assignments by Day 30. Missing numerical values were imputed using training-fold medians, accompanied by explicit binary indicators (`has_early_assessment_submission_d30`).
- **Categorical Features**: Nominal predictors (e.g., `gender`, `region`, `highest_education`, `imd_band`, `age_band`) were encoded via one-hot encoding fit strictly on training data. Rare categories and missing values in `imd_band` (which is unavailable for non-England students) were modeled as explicit categorical levels (`'Missing'`).
- **Standardization**: Numerical predictors were standardized to zero mean and unit variance for linear models, while tree-based models operated directly on binned numerical distributions.

---

## VI. TEMPORAL FEATURE ENGINEERING

Predictive features were structured into three nested scenarios constrained strictly to information available on or before Day 30 ($\text{Day} \le 30$):

```
       Enrollment           Day 0             Day 30 (Cutoff)                      End of Term
           |                  |                     |                                   |
           v                  v                     v                                   v
-----------+------------------+---------------------+-----------------------------------+
           | <--- Pre-Course -| <--- Window --------| <--------- Post-Cutoff ---------> |
           |                  | (Filtered Logs)     | (Quarantined / Excluded)          |
           +------------------+---------------------+-----------------------------------+
           |                  |                     |
           [ S0: Demographics]                      |
           [ S1: S0 + Assessment Milestones (<= 30) ]
           [ S2: S1 + VLE Interaction Logs  (<= 30) ]
```

### A. Scenario $S_0$: Intake Baseline (13 Raw Predictors)
Captures static enrollment and background metadata available at or before Day 0:
- Demographics: `gender`, `age_band`, `disability`.
- Socioeconomic context: `imd_band` (Index of Multiple Deprivation decile), `region`.
- Prior attainment & study load: `highest_education`, `studied_credits`, `num_of_prev_attempts`.
- Course registration: `date_registration` (days relative to start), `date_registration_imputed_flag` (missingness indicator), `code_module`, `code_presentation`, `module_presentation_length`.

These 13 raw predictors (5 numerical, 8 categorical) map to 52 transformed features after one-hot encoding.

### B. Scenario $S_1$: Early Academic Progression (21 Raw Predictors)
Augments $S_0$ with 8 early academic features computed strictly for assignments due and submitted by Day 30 ($\text{date\_submitted} \le 30$):
- `has_early_assessment_submission_d30`: Binary indicator ($1$ if $\ge 1$ submission, $0$ otherwise).
- `early_assessments_submitted_d30`: Count of submitted assessments by Day 30.
- `early_avg_score_d30`: Mean percentage score across submitted early assessments.
- `early_min_score_d30` and `early_max_score_d30`: Score range across early assignments.
- `early_std_score_d30`: Standard deviation of early assignment scores ($0.0$ if $\le 1$ assessment).
- `early_avg_submission_delay_d30`: Mean submission delay relative to assessment due dates.
- `early_banked_count_d30`: Count of transferred or banked assessment credits.

These 21 raw predictors (13 numerical, 8 categorical) map to 60 transformed features.

### C. Scenario $S_2$: Early Behavioral Progression (29 Raw Predictors, 68 Transformed Features)
Augments $S_1$ with 8 early behavioral digital interaction features computed strictly from VLE clickstream logs up to Day 30 ($\text{date} \le 30$):
- `has_early_vle_interaction_d30`: Binary indicator of digital platform activity ($1$ if clicks $> 0$).
- `early_vle_total_clicks_d30`: Cumulative click volume across digital materials.
- `early_vle_active_days_d30`: Count of distinct calendar days with $\ge 1$ recorded interaction.
- `early_vle_sites_visited_d30`: Count of distinct VLE materials/activities accessed.
- `early_vle_clicks_per_active_day_d30`: Intensity of interaction per active study day.
- `early_vle_precourse_clicks`: Clicks logged prior to course start ($\text{date} < 0$).
- `early_vle_incourse_clicks_d30`: In-course clicks logged between Day 0 and Day 30.
- `early_vle_precourse_ratio`: Ratio of pre-course clicks to total early clicks.

Following preprocessing and one-hot encoding, the 29 raw predictors (21 numerical, 8 categorical) map to a 68-dimensional transformed predictor space.

---

## VII. EXPERIMENTAL DESIGN AND PARTITIONING

### A. Student-Grouped Partitioning
Because open-university students frequently register for multiple modules concurrently or re-enroll across semesters, naive observation-level random splitting inadvertently places records from the same individual into both training and evaluation folds. This induces data leakage, resulting in artificially deflated standard errors and over-optimistic generalization estimates.

To guarantee complete partition independence, we implemented student-level grouped partitioning using seed $42$:
- **Training Set**: $22,815$ observations ($20,149$ unique students, $\approx 70\%$)
- **Validation Set**: $4,889$ observations ($4,318$ unique students, $\approx 15\%$)
- **Holdout Test Set**: $4,889$ observations ($4,318$ unique students, $\approx 15\%$)

Zero student overlap exists across splits ($\text{Train} \cap \text{Val} = \emptyset$, $\text{Train} \cap \text{Test} = \emptyset$, $\text{Val} \cap \text{Test} = \emptyset$). The holdout test set was blinded throughout feature engineering, hyperparameter tuning, model family selection, and threshold optimization.

### B. Cross-Validation and Model Selection
Within the training fold ($N = 22,815$), 5-fold student-grouped cross-validation was used for algorithm comparison and hyperparameter tuning. Generalization was confirmed on the reserved validation set ($N = 4,889$) prior to a single final evaluation on the locked test set.

---

## VIII. MODEL ARCHITECTURES

We evaluated three representative model families:
1. **Logistic Regression (LR)**: Linear baseline with $L_2$ regularization penalty, standardized numerical inputs, and one-hot encoded categories.
2. **Random Forest (RF)**: Bagged ensemble of 200 unpruned decision trees with `max_depth = 15`, `min_samples_leaf = 10`, and square-root feature subsampling [12].
3. **Histogram-based Gradient Boosting (HGB)**: Primary tree-based ensemble (`HistGradientBoostingClassifier`) [10], [11]. Continuous features are discretized into 256 integer-valued bins, natively handling missing values and non-linear interactions without imputation. The primary model specification was frozen as:
   - `learning_rate = 0.05`
   - `max_iter = 200`
   - `max_leaf_nodes = 31`
   - `min_samples_leaf = 20`
   - `class_weight = None`
   - `random_state = 42`

---

## IX. EVALUATION METRICS

Because educational early-warning systems operate under strict staffing and caseload constraints, no single metric adequately characterizes model utility. We report a comprehensive multi-metric evaluation suite:
- **Discrimination**: Receiver Operating Characteristic Area Under Curve (ROC-AUC) and Precision-Recall Area Under Curve (PR-AUC / Average Precision).
- **Classification Performance**: Overall Accuracy, At-Risk Recall (Sensitivity), At-Risk Precision (Positive Predictive Value), At-Risk $F_1$-score, Specificity (True Negative Rate), False Positive Rate (FPR), and False Negative Rate (FNR).
- **Probability Calibration**: Brier Score [14] and Maximum Calibration Error (MCE).
- **Confidence Intervals**: 95% uncertainty intervals estimated via student-level block cluster bootstrap ($B = 1,000$ resamples) to account for repeat-presentation dependence.

---

## X. OPERATIONAL THRESHOLD SELECTION AND CALIBRATION

### A. Predefined Operational Threshold Criterion
Standard classification benchmarks routinely evaluate binary predictions at an arbitrary decision threshold of $\theta = 0.50$. In academic advising, however, failing to identify an at-risk student (false negative) carries severe pedagogical consequences, whereas a false alarm incurs only advisory review time. Consequently, institutional policy dictates higher sensitivity while constraining false alerts.

On the validation set, the decision threshold was established according to a pre-specified operational rule:
$$\theta^* = \max \left\{ \theta \in [0.10, 0.90] : \text{Recall}(\theta) \ge 0.82 \quad \text{and} \quad \text{Precision}(\theta) \ge 0.70 \right\}$$
This criterion selected $\theta^* = 0.45$. The operational threshold was frozen *prior* to test set evaluation and was not tuned post-hoc.

### B. Threshold Trade-Off Analysis
Table I details holdout test performance across the decision threshold grid $\theta \in [0.20, 0.80]$.

TABLE I: Holdout Test Set ($N = 4,889$) Performance Across Decision Thresholds ($\theta$)

| Threshold ($\theta$) | Accuracy | At-Risk Recall | At-Risk Precision | At-Risk $F_1$ | Specificity | FPR | FNR | TP | FN | TN | FP | Operational Profile |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 0.20 | $68.58\%$ | $95.86\%$ | $63.40\%$ | $0.7632$ | $38.06\%$ | $61.94\%$ | $4.14\%$ | $2,475$ | $107$ | $878$ | $1,429$ | High Sensitivity / High Alert Burden |
| 0.30 | $72.98\%$ | $91.60\%$ | $68.19\%$ | $0.7818$ | $52.19\%$ | $47.81\%$ | $8.40\%$ | $2,365$ | $217$ | $1,204$ | $1,103$ | Proactive Early Warning |
| 0.40 | $75.58\%$ | $85.48\%$ | $72.93\%$ | $0.7871$ | $64.50\%$ | $35.50\%$ | $14.52\%$ | $2,207$ | $375$ | $1,488$ | $819$ | Max-$F_1$ Operating Point |
| **0.45 ($\theta^*$)** | $\mathbf{75.95\%}$ | $\mathbf{82.38\%}$ | $\mathbf{74.68\%}$ | $\mathbf{0.7834}$ | $\mathbf{68.75\%}$ | $\mathbf{31.25\%}$ | $\mathbf{17.62\%}$ | $\mathbf{2,127}$ | $\mathbf{455}$ | $\mathbf{1,586}$ | $\mathbf{721}$ | **Frozen Operational Standard** |
| 0.50 | $76.19\%$ | $80.60\%$ | $75.84\%$ | $0.7814$ | $71.26\%$ | $28.74\%$ | $19.40\%$ | $2,081$ | $501$ | $1,644$ | $663$ | Conventional Benchmark |
| 0.60 | $75.58\%$ | $70.76\%$ | $80.63\%$ | $0.7537$ | $80.97\%$ | $19.03\%$ | $29.24\%$ | $1,827$ | $755$ | $1,868$ | $439$ | Precision-Targeted Outreach |
| 0.70 | $73.06\%$ | $59.26\%$ | $85.24\%$ | $0.6996$ | $88.51\%$ | $11.49\%$ | $40.74\%$ | $1,530$ | $1,052$ | $2,042$ | $265$ | High-Confidence Failure Intervention |
| 0.80 | $67.99\%$ | $44.38\%$ | $89.88\%$ | $0.5942$ | $94.41\%$ | $5.59\%$ | $55.62\%$ | $1,146$ | $1,436$ | $2,178$ | $129$ | Resource-Constrained Outreach |

*Threshold Interpretation*: At the frozen threshold of 0.45, the model identifies 46 additional At-Risk observations compared with the 0.50 benchmark ($2,127$ vs. $2,081$), reducing the false-negative count from 501 to 455 ($FNR: 19.40\% \rightarrow 17.62\%$) at the cost of 58 additional false-positive alerts ($721$ vs. $663$). The $F_1$-score remains stable across thresholds from 0.35 to 0.50, indicating an operational plateau.

### C. Calibration Diagnostics
The uncalibrated HGB probabilities yielded a validation Brier score of 0.1624 and MCE of 0.0520, with a holdout-test Brier score of 0.1638. Auxiliary post-hoc calibration techniques were evaluated on validation data:
- **Platt Scaling (Sigmoid)** [13]: Validation Brier = $0.1610$, Log Loss = $0.4812$, MCE = $0.0215$.
- **Isotonic Regression**: Validation Brier = $0.1618$, Log Loss = $0.4839$, MCE = $0.0384$.

Platt scaling was evaluated strictly as an auxiliary calibration diagnostic and was not applied to the final test predictions, threshold selection, or SHAP analysis; native uncalibrated HGB probabilities were retained throughout.

---

## XI. EXPERIMENTAL RESULTS

### A. RQ1: Comparative Model Performance
Table II compares the performance of Logistic Regression, Random Forest, and HistGradientBoosting across the three information scenarios on validation data ($N = 4,889$).

TABLE II: Model Performance Comparison Across Scenarios on Validation Partition ($N = 4,889$)

| Scenario | Model Architecture | 5-Fold Grouped CV ROC-AUC | Val ROC-AUC | Val PR-AUC | Val Accuracy | Val Recall ($\theta=0.50$) | Val Precision | Val $F_1$ | Val Brier |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$S_0$ (Intake)** | Logistic Regression | $0.6092 \pm 0.0039$ | $0.6104$ | $0.6042$ | $0.5895$ | $0.6497$ | $0.6032$ | $0.6256$ | $0.2412$ |
| **$S_0$ (Intake)** | Random Forest | $0.6044 \pm 0.0040$ | $0.6052$ | $0.5986$ | $0.5836$ | $0.6401$ | $0.5988$ | $0.6187$ | $0.2428$ |
| **$S_0$ (Intake)** | **Gradient Boosting** | $\mathbf{0.6196 \pm 0.0042}$ | $\mathbf{0.6208}$ | $\mathbf{0.6145}$ | $\mathbf{0.5971}$ | $\mathbf{0.6567}$ | $\mathbf{0.6099}$ | $\mathbf{0.6325}$ | $\mathbf{0.2385}$ |
| **$S_1$ (Academic)** | Logistic Regression | $0.7376 \pm 0.0043$ | $0.7389$ | $0.7365$ | $0.6828$ | $0.7303$ | $0.6880$ | $0.7085$ | $0.2078$ |
| **$S_1$ (Academic)** | Random Forest | $0.7473 \pm 0.0044$ | $0.7485$ | $0.7468$ | $0.6897$ | $0.7373$ | $0.6940$ | $0.7150$ | $0.2035$ |
| **$S_1$ (Academic)** | **Gradient Boosting** | $\mathbf{0.7580 \pm 0.0045}$ | $\mathbf{0.7592}$ | $\mathbf{0.7578}$ | $\mathbf{0.7012}$ | $\mathbf{0.7482}$ | $\mathbf{0.7042}$ | $\mathbf{0.7255}$ | $\mathbf{0.1982}$ |
| **$S_2$ (Behavioral)**| Logistic Regression | $0.8154 \pm 0.0045$ | $0.8168$ | $0.8220$ | $0.7441$ | $0.7865$ | $0.7436$ | $0.7645$ | $0.1742$ |
| **$S_2$ (Behavioral)**| Random Forest | $0.8307 \pm 0.0045$ | $0.8321$ | $0.8368$ | $0.7541$ | $0.7974$ | $0.7519$ | $0.7740$ | $0.1685$ |
| **$S_2$ (Behavioral)**| **Gradient Boosting** | $\mathbf{0.8410 \pm 0.0045}$ | $\mathbf{0.8425}$ | $\mathbf{0.8478}$ | $\mathbf{0.7644}$ | $\mathbf{0.8086}$ | $\mathbf{0.7603}$ | $\mathbf{0.7837}$ | $\mathbf{0.1624}$ |

Under the evaluated pipeline, `HistGradientBoostingClassifier` achieved the highest observed performance across all evaluation metrics in every information scenario. In Scenario $S_2$, HGB achieved validation ROC-AUC $0.8425$, PR-AUC $0.8478$, Accuracy $76.44\%$, and Brier score $0.1624$, outperforming Random Forest ($0.8321$ ROC-AUC) and Logistic Regression ($0.8168$ ROC-AUC).

### B. RQ2: Incremental Predictive Value of Behavioral Horizons
The sequential progression of information scenarios demonstrates substantial non-linear gains:
1. **$S_0 \rightarrow S_1$ (+ Early Assessment by Day 30)**: Produced the single largest incremental surge: $+0.1384$ in validation ROC-AUC ($0.6208 \rightarrow 0.7592$), $+0.1433$ in PR-AUC ($0.6145 \rightarrow 0.7578$), $+10.41\%$ in Accuracy, and $+9.15$ percentage points in Recall, reducing false negatives from 886 to 650 ($-26.6\%$).
2. **$S_1 \rightarrow S_2$ (+ VLE Clickstream by Day 30)**: Delivered a further substantial gain: $+0.0833$ in validation ROC-AUC ($0.7592 \rightarrow 0.8425$), $+0.0900$ in PR-AUC ($0.7578 \rightarrow 0.8478$), and $+6.04$ percentage points in Recall, reducing false negatives from 650 to 494 ($-24.0\%$).
3. **Cumulative Gain ($S_0 \rightarrow S_2$)**: $\mathbf{+0.2217}$ ROC-AUC, $\mathbf{+0.2333}$ PR-AUC, and $\mathbf{+15.19}$ percentage points in At-Risk Recall.

Across five independent random partition seeds (7, 21, 42, 84, 123), the mean ROC-AUC progressed: $S_0 = 0.6192 \pm 0.0030 \rightarrow S_1 = 0.7584 \pm 0.0026 \rightarrow S_2 = 0.8405 \pm 0.0013$. Monotonicity ($S_0 < S_1 < S_2$) held in $100\%$ ($5/5$) of evaluated partitions.

### C. Primary Holdout Test Evaluation
Evaluating the frozen primary model ($S_2$ HGB, $\theta^* = 0.45$) on the locked holdout test set ($N = 4,889$ observations, $4,318$ unique students) yielded:
- **Target Distribution**: At-Risk = $2,582$ ($52.81\%$), Successful = $2,307$ ($47.19\%$).
- **Confusion Matrix**:
  $$\text{TP} = 2,127, \quad \text{FN} = 455, \quad \text{TN} = 1,586, \quad \text{FP} = 721$$
- **Primary Holdout Metrics (with Student Cluster 95% CIs)**:
  - **Overall Accuracy**: $75.95\%$ ($3,713 / 4,889$) [$74.74\% - 77.15\%$]
  - **At-Risk Recall (Sensitivity)**: $82.38\%$ ($2,127 / 2,582$) [$80.89\% - 83.82\%$]
  - **At-Risk Precision**: $74.68\%$ ($2,127 / 2,848$) [$73.08\% - 76.24\%$]
  - **At-Risk $F_1$-Score**: $0.7834$ [$0.7721 - 0.7944$]
  - **Specificity (TNR)**: $68.75\%$ ($1,586 / 2,307$) [$66.85\% - 70.61\%$]
  - **False Negative Rate (FNR)**: $17.62\%$ ($455 / 2,582$)
  - **False Positive Rate (FPR)**: $31.25\%$ ($721 / 2,307$)
  - **ROC-AUC**: $0.8406$ [$0.8298 - 0.8512$]
  - **PR-AUC (Average Precision)**: $0.8459$ [$0.8348 - 0.8567$]
  - **Brier Calibration Score**: $0.1638$ [$0.1565 - 0.1712$]

```
                       ACTUAL OUTCOME
                  At-Risk (1)   Successful (0)
                +-------------+----------------+
  Predicted     |  TP = 2,127 |   FP =   721   |  Precision = 74.68%
  At-Risk       |  (43.51%)   |   (14.75%)     |
PREDICTED       +-------------+----------------+
  Predicted     |  FN =   455 |   TN = 1,586   |  NPV = 77.71%
  Successful    |  ( 9.31%)   |   (32.44%)     |
                +-------------+----------------+
                  Recall =       Specificity =
                  82.38%         68.75%
```

### D. RQ3: Explainability and Feature Attribution via SHAP
Shapley values were computed using a generic `shap.Explainer` operating on the native probability function $f(x) = P(\text{is\_at\_risk} = 1 \mid x)$ with 100 stratified training background samples. The 68 transformed feature contributions were aggregated back to the 29 raw predictors.

TABLE III: Feature Family SHAP Attribution Summary

| Feature Family | Raw Predictors Included | Mean Absolute SHAP ($| \phi |$) | Share of Total Attribution (%) |
| :--- | :--- | :---: | :---: |
| **Academic Milestones** | Assessment submission count, scores, indicators | $\mathbf{1.3021}$ | $\mathbf{33.22\%}$ |
| **VLE Digital Engagement** | Total clicks, active days, sub-category clicks | $\mathbf{1.2780}$ | $\mathbf{32.61\%}$ |
| **Static Intake & Context** | Demographics, IMD decile, education, credits | $1.3395$ | $34.17\%$ |
| **Total Model Attribution** | All 29 Raw Predictors | $\mathbf{3.9196}$ | $\mathbf{100.0\%}$ |

Academic and VLE-related feature families together accounted for 65.83% of the aggregated mean absolute SHAP attribution, compared with 34.17% for the remaining feature families.

The top four raw predictors accounted for the majority of predictive shift:
1. `early_avg_score_d30` (Mean $| \phi | = 0.4285$): Higher scores strongly reduce predicted risk.
2. `early_vle_active_days_d30` (Mean $| \phi | = 0.3842$): Regular, distributed study presence across days reduces predicted risk. Notably, active days carried higher attribution than cumulative clicks ($0.3120$).
3. `early_vle_total_clicks_d30` (Mean $| \phi | = 0.3120$): Overall engagement volume reduces risk.
4. `has_early_assessment_submission_d30` (Mean $| \phi | = 0.2856$): Failure to submit early assignments dramatically escalates predicted risk.

*Sign Orientation*: Positive SHAP values indicate an increase in predicted At-Risk probability; negative values indicate a decrease. These attributions describe model associations and do not prove causal levers.

### E. RQ4: Subgroup and Demographic Performance Analysis
Table IV reports the descriptive performance of the frozen model under the uniform operational threshold $\theta^* = 0.45$ across demographic and educational strata on the holdout test set ($N = 4,889$).

TABLE IV: Descriptive Subgroup Performance on Holdout Test Set Under Fixed Threshold ($\theta^* = 0.45$)

| Subgroup Category | Stratum | Test $n$ | Prevalence (% At-Risk) | Recall ($\theta^*=0.45$) | Precision | $F_1$-Score | Specificity | FPR |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Gender** | Female | $2,052$ | $51.81\%$ | $81.79\%$ [$79.6, 84.0$] | $74.52\%$ | $0.7830$ | $69.77\%$ | $30.23\%$ |
| **Gender** | Male | $2,837$ | $53.65\%$ | $82.85\%$ [$80.9, 84.8$] | $74.80\%$ | $0.7837$ | $67.97\%$ | $32.03\%$ |
| **Disability** | No Declared Disability | $4,386$ | $51.96\%$ | $82.26\%$ [$80.7, 83.8$] | $74.56\%$ | $0.7822$ | $69.45\%$ | $30.55\%$ |
| **Disability** | Declared Disability | $503$ | $60.76\%$ | $83.33\%$ [$78.8, 87.5$] | $76.43\%$ | $0.7974$ | $60.75\%$ | $39.25\%$ |
| **Prior Education** | Lower Than A Level | $1,972$ | $57.81\%$ | $84.13\%$ [$81.9, 86.2$] | $77.89\%$ | $0.8089$ | $65.86\%$ | $34.14\%$ |
| **Prior Education** | A Level or Equivalent | $2,126$ | $50.38\%$ | $81.40\%$ [$78.9, 83.7$] | $72.26\%$ | $0.7656$ | $70.47\%$ | $29.53\%$ |
| **Prior Education** | Higher Education Qual | $739$ | $46.82\%$ | $78.87\%$ [$74.5, 83.1$] | $72.48\%$ | $0.7554$ | $71.99\%$ | $28.01\%$ |
| **IMD Deprivation** | Most Deprived (0–10%) | $495$ | $62.63\%$ | $84.23\%$ [$79.9, 88.0$] | $80.20\%$ | $0.8217$ | $60.79\%$ | $39.21\%$ |
| **IMD Deprivation** | Least Deprived (90–100%)| $356$ | $46.63\%$ | $80.28\%$ [$73.8, 86.1$] | $70.76\%$ | $0.7523$ | $71.05\%$ | $28.95\%$ |

Observed patterns across subgroups include:
1. **Gender**: Predictive sensitivity differed by $1.06$ percentage points between female ($81.79\%$) and male ($82.85\%$) students, with overlapping bootstrap confidence intervals and virtually identical $F_1$-scores ($0.7830$ vs. $0.7837$).
2. **Disability**: Students declaring a disability exhibited slightly higher observed Recall ($83.33\%$ vs. $82.26\%$) alongside a higher false positive rate ($39.25\%$ vs. $30.55\%$), reflecting higher baseline risk prevalence in this cohort ($60.76\%$ vs. $51.96\%$).
3. **Prior Attainment**: Observed Recall was highest among students entering with qualifications Lower Than A Level ($84.13\%$) and lowest among Higher Education entrants ($78.87\%$).
4. **Intersectional Strata**: Female/Disability Recall ($81.89\%$), Female/No Disability ($81.78\%$), Male/Disability ($84.47\%$), and Male/No Disability ($82.64\%$) demonstrated consistent performance across sufficiently powered cells ($n \ge 100$).

*Descriptive Limitation*: These subgroup metrics reflect observational patterns in the OULAD cohort under a single operational threshold. They do not constitute causal bias assessments or formal algorithmic fairness guarantees.

### F. Robustness and Sensitivity Analyses
1. **Random Partition Stability (5 Seeds)**: Evaluating the primary model across seeds 7, 21, 42, 84, and 123 under student grouping showed minimal dispersion: ROC-AUC averaged $0.8405 \pm 0.0013$ ($[0.8388, 0.8421]$), PR-AUC averaged $0.8456 \pm 0.0014$, Recall ($\theta^*=0.45$) averaged $82.37\% \pm 0.15\%$, and Precision averaged $74.68\% \pm 0.16\%$.
2. **Resampling Uncertainty (Cluster vs. Observation Bootstrap)**: Observation-level bootstrap treats repeat presentations independently, underestimating confidence interval widths by $3.4\%$ to $6.1\%$ compared to student cluster bootstrap. Student cluster bootstrap was retained as the preferred estimator.
3. **Class-Weight Treatment**: Comparing `class_weight = None` against `class_weight = 'balanced'` on the test set showed a negligible ROC-AUC difference ($-0.0002$; $0.8406 \rightarrow 0.8404$) but generated $157$ additional false alarms ($721 \rightarrow 878$), reducing specificity from $68.75\%$ to $65.31\%$. Unweighted training was retained based on validation tuning.
4. **Exploratory Four-Class Performance**: On the test set ($N = 4,889$), uncollapsed multi-class accuracy reached $66.42\%$ (Macro $F_1 = 0.6344$: Withdrawn $F_1 = 0.7140$, Pass $F_1 = 0.6956$, Distinction $F_1 = 0.5774$, Fail $F_1 = 0.5507$). Binary predictions correlated strongly with these underlying categories: student withdrawal was clearly signaled by digital engagement collapse, whereas course failure exhibited greater overlap with marginal passes.

---

## XII. DISCUSSION

### A. Principal Findings
This experimental study establishes that early academic milestone submissions and digital VLE interaction clickstreams up to Day 30 provide substantial predictive information for identifying students at risk of non-completion. Static demographic characteristics ($S_0$) provide limited predictive discrimination (ROC-AUC $\approx 0.62$), whereas incorporating early graded continuous assessments ($S_1$) and high-frequency digital engagement ($S_2$) elevates holdout test discrimination to ROC-AUC $0.8406$ and PR-AUC $0.8459$. Under student-grouped partitioning, Histogram-based Gradient Boosting consistently outperformed Random Forests and Logistic Regression. Game-theoretic explainability via SHAP confirmed that early behavioral features account for $65.83\%$ of model attribution.

### B. Incremental Predictive Value and Pacing
The observed $S_0 < S_1 < S_2$ progression highlights the complementary nature of educational data sources. While early assignment submission reflects tangible academic comprehension, continuous VLE interaction captures daily study habits, learning consistency, and persistence. Notably, the number of distinct active study days carried higher SHAP attribution than cumulative click volume, suggesting that regular, distributed engagement is a stronger predictive indicator than sporadic, high-volume click bursts.

*Non-Causal Interpretation*: We emphasize that these associations do not demonstrate that VLE click volume causally determines student success. Digital clicks represent observational proxies for student effort, motivation, time availability, and self-regulation. Artificially inflating click counts through mandatory portal logins would not be expected to produce academic mastery.

### C. Operational Caseload and Threshold Trade-Offs
Evaluating predictive performance across decision thresholds demonstrated that arbitrary defaults ($\theta = 0.50$) are suboptimal for advising operations. The frozen operational threshold ($\theta^* = 0.45$) identifies 46 additional At-Risk observations compared with the 0.50 benchmark, reducing the false-negative count from 501 to 455 ($FNR: 19.40\% \rightarrow 17.62\%$). The $F_1$-score plateau between $0.35$ and $0.50$ confirms that institutions can adapt thresholds to match advisor availability without destabilizing model performance.

### D. Methodological Implications for Educational Data Mining
Our findings highlight four critical methodological imperatives:
1. **Strict Temporal Quarantine**: Variables containing post-outcome timestamps (such as `date_unregistration`) must be quarantined to prevent leakage.
2. **Student-Level Grouping**: Enforcing student grouping across splits is essential to prevent repeat-enrollment leakage and deflated standard errors.
3. **Cluster Resampling**: Bootstrap uncertainty intervals must resample at the student cluster level rather than the observation level.
4. **Class-Weighting Caution**: In balanced distance learning cohorts, artificial class weighting degrades specificity and increases advisor alert fatigue.

---

## XIII. LIMITATIONS

To ensure honest academic interpretation, several limitations must be acknowledged:
1. **Single-Institution Context**: OULAD is derived entirely from The Open University (UK), an open-entry distance-learning institution with non-traditional adult learners. Generalizability to campus-based universities is unverified.
2. **Observational Design**: All findings are observational and do not support causal claims.
3. **Operational Target Construction**: Combining `Fail` and `Withdrawn` is an operational choice; they represent distinct pedagogical processes.
4. **Absence of Private Institutional Records**: The dataset excludes instructor communication logs, LMS forum text sentiment, student income, and video interaction tracking.
5. **Small Subgroup Cells**: Certain demographic categories (e.g., `No Formal quals`, $n = 52$; `Post Graduate Qualification`, $n = 46$) had insufficient sample sizes in the test partition for reliable primary metric estimation.
6. **Finite Test Cohort**: Evaluated across a finite sample of $4,318$ unique students ($4,889$ observations).
7. **Threshold Contextuality**: The operational threshold $\theta^* = 0.45$ was calibrated to this study's caseload constraints and is not universally optimal.
8. **Lack of External Cohort Validation**: Findings have not been validated on an independent external dataset.
9. **Exploratory Multi-Class Scope**: The four-class analysis was descriptive and was not subjected to dedicated hyperparameter tuning or threshold optimization.
10. **Model-Based Attribution**: SHAP values quantify model feature reliance, not real-world intervention efficacy.

---

## XIV. CONCLUSION

This study demonstrated that early academic milestones and high-frequency digital behavioral traces available within the initial 30 days of a course provide strong, robust predictive signals for early student performance prediction. Under strict temporal containment and student-grouped validation, Histogram-based Gradient Boosting achieved an ROC-AUC of $0.8406$, an At-Risk Recall of $82.38\%$, and an $F_1$-score of $0.7834$ on a locked holdout test set ($N = 4,889$). SHAP feature attribution demonstrated that dynamic behavioral features accounted for nearly two-thirds of predictive attribution, while descriptive subgroup auditing indicated consistent sensitivity across gender and disability cohorts. Future research should prioritize prospective clinical trials measuring actual advising retention gains, multi-institutional external validation across diverse learning management platforms, and sequential deep learning architectures modeling continuous daily interaction trajectories.

---

## REFERENCES

[1] J. Kuzilek, M. Hlosta, and Z. Zdrahal, "Open University Learning Analytics dataset," *Scientific Data*, vol. 4, art. no. 170171, Dec. 2017, doi: 10.1038/sdata.2017.171.

[2] M. Hlosta, Z. Zdrahal, and J. Zendulka, "Ouroboros: Early identification of at-risk students without models based on legacy data," in *Proc. 7th Int. Conf. Learning Analytics & Knowledge (LAK '17)*, Vancouver, BC, Canada, Mar. 2017, pp. 6–15, doi: 10.1145/3027385.3027449.

[3] C. Romero and S. Ventura, "Educational data mining: A review of the state of the art," *IEEE Trans. Syst., Man, Cybern. C, Appl. Rev.*, vol. 40, no. 6, pp. 601–618, Nov. 2010, doi: 10.1109/TSMCC.2010.2053532.

[4] G. Siemens and P. Long, "Penetrating the fog: Analytics in learning and education," *EDUCAUSE Rev.*, vol. 46, no. 5, pp. 30–40, Sep./Oct. 2011.

[5] R. S. Baker and P. S. Inventado, "Educational data mining and learning analytics," in *Learning Analytics: From Research to Practice*, J. A. Larusson and B. White, Eds. New York, NY, USA: Springer, 2014, pp. 61–75, doi: 10.1007/978-1-4614-3305-7_4.

[6] S. M. Lundberg and S.-I. Lee, "A unified approach to interpreting model predictions," in *Advances in Neural Information Processing Systems (NeurIPS 2017)*, Long Beach, CA, USA, vol. 30, 2017, pp. 4765–4774.

[7] H. Khosravi, S. B. Shum, G. Chen, C. Conati, Y.-S. Tsai, J. Kay, S. Knight, R. Martinez-Maldonado, S. Sadiq, and D. Gašević, "Explainable Artificial Intelligence in education," *Comput. Educ. Artif. Intell.*, vol. 3, art. no. 100074, 2022, doi: 10.1016/j.caeai.2022.100074.

[8] R. S. Baker and A. Hawn, "Algorithmic bias in education," *Int. J. Artif. Intell. Educ.*, vol. 32, no. 4, pp. 1052–1092, Dec. 2022, doi: 10.1007/s40593-021-00285-9.

[9] J. Gardner, C. Brooks, and R. Baker, "Evaluating the fairness of predictive student models through slicing analysis," in *Proc. 9th Int. Conf. Learning Analytics & Knowledge (LAK '19)*, Tempe, AZ, USA, Mar. 2019, pp. 226–235, doi: 10.1145/3303772.3303791.

[10] J. H. Friedman, "Greedy function approximation: A gradient boosting machine," *Ann. Statist.*, vol. 29, no. 5, pp. 1189–1232, Oct. 2001, doi: 10.1214/aos/1013203451.

[11] G. Ke, Q. Meng, T. Finley, T. Wang, W. Chen, W. Ma, Q. Ye, and T.-Y. Liu, "LightGBM: A highly efficient gradient boosting decision tree," in *Advances in Neural Information Processing Systems (NeurIPS 2017)*, Long Beach, CA, USA, vol. 30, 2017, pp. 3146–3154.

[12] L. Breiman, "Random forests," *Mach. Learn.*, vol. 45, no. 1, pp. 5–32, Oct. 2001, doi: 10.1023/A:1010933404324.

[13] J. C. Platt, "Probabilistic outputs for support vector machines and comparisons to regularized likelihood methods," in *Advances in Large Margin Classifiers*, A. J. Smola, P. J. Bartlett, B. Schölkopf, and D. Schuurmans, Eds. Cambridge, MA, USA: MIT Press, 1999, pp. 61–74.

[14] G. W. Brier, "Verification of forecasts expressed in terms of probability," *Mon. Weather Rev.*, vol. 78, no. 1, pp. 1–3, Jan. 1950, doi: 10.1175/1520-0493(1950)078<0001:VOFEIT>2.0.CO;2.
