/**
 * Verbatim text extracted directly from the frozen manuscript:
 * "Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance:
 * An Experimental Study With the Open University Learning Analytics Dataset (OULAD)"
 * by Ugesh Kumar and Riya Sharma (2026).
 *
 * DO NOT PARAPHRASE. All text is quoted verbatim from the manuscript.
 */

export interface PaperSection {
  numeral: string;
  title: string;
  paragraphs: string[];
  subsections?: {
    letter: string;
    title: string;
    paragraphs: string[];
  }[];
  bullets?: string[];
}

export interface PaperReference {
  id: number;
  citation: string;
  venue?: string;
  year: number;
  url: string;
}

export interface PaperFigureCaption {
  number: number;
  caption: string;
}

export interface PaperTableCaption {
  roman: string;
  title: string;
}

export const paperHeader = {
  title: 'Use of Machine Learning Techniques and Explainable AI for Predicting Student Performance: An Experimental Study With the Open University Learning Analytics Dataset (OULAD)',
  authors: ['Ugesh Kumar', 'Riya Sharma'],
  affiliation: 'Department of Computer Science and Engineering, JAIN (Deemed-to-be University), Bengaluru, India',
  statusNotice: 'Manuscript, 2026',
};

export const paperAbstract =
  'A major challenge in distance higher education is the early identification of students who are at risk of failing their course(s). Student performance prediction models often rely on one-time demographics or on behavior aggregated over full semesters, and can therefore suffer from temporal data leakage. This experimental study uses the Open University Learning Analytics Dataset (OULAD), which contains 32,593 course-presentation observations from 28,785 unique students across seven modular subjects. Only information available on or before a Day-30 temporal boundary is used to assess three nested temporal scenarios: the Intake Baseline (S0), Early Academic Progression (S1), and S1 augmented with Virtual Learning Environment (VLE) clickstream features (S2). Student-level grouped partitioning is applied to the training, validation, and holdout data, and 5-fold student-grouped cross-validation is used for model comparison. The best discrimination was obtained with the HistGradientBoostingClassifier, which achieved an ROC-AUC of 0.8406, an At-Risk Recall of 82.38%, and an F1-score of 0.7834 on the locked holdout set (4,889 observations, 4,318 students) at an operational threshold of 0.45 selected on the validation partition. SHAP analysis showed that dynamic academic and VLE features account for 65.83% of the aggregated attribution. Because this study is experimental and observational, the attributions convey predictive association, not causal effects, and subgroup results are presented descriptively.';

export const indexTerms: string[] = [
  'Educational data mining',
  'early warning systems',
  'explainable artificial intelligence',
  'gradient boosting',
  'learning analytics',
  'SHAP',
  'student performance prediction',
];

export const keywordsTaxonomy = {
  domain: 'learning analytics; educational data mining; distance education; early warning system (EWS); student performance prediction; student attrition; at-risk students',
  data: 'Open University Learning Analytics Dataset (OULAD); virtual learning environment (VLE); clickstream; early assessment scores; demographics; IMD deprivation band',
  methods: 'temporal data leakage; Day-30 temporal boundary; nested scenarios (S0, S1, S2); student-grouped partitioning; grouped cross-validation; logistic regression; random forest; HistGradientBoostingClassifier; threshold optimization',
  evaluation: 'ROC-AUC; PR-AUC; recall; precision; specificity; F1-score; Brier score; confusion matrix; probability calibration; bootstrap confidence interval',
  explainabilityAndFairness: 'SHAP; feature attribution; subgroup evaluation; algorithmic fairness; predictive association versus causation; robustness analysis',
};

export const overviewBox = {
  problem: 'Students in distance education need to be flagged early, but models that use post-cutoff data overstate performance.',
  approach: 'A leakage-safe pipeline on OULAD (32,593 enrollments, 28,785 students) uses only information available by Day 30. Three nested scenarios (S0 intake, S1 + early academic, S2 + VLE clickstream) and three model families (LR, RF, HGB) are compared with student-grouped splits and 5-fold cross-validation.',
  keyResults: 'The best model (HGB, S2) reaches ROC-AUC 0.8406, At-Risk Recall 82.38%, and F1 0.7834 on a locked holdout at a validation-selected threshold of θ* = 0.45. SHAP shows that dynamic academic and VLE features carry 65.83% of the attribution.',
  scope: 'Subgroup and robustness results are descriptive and associative, not causal. The complete workflow is shown in Fig. 1.',
};

export const paperFigureCaptions: PaperFigureCaption[] = [
  {
    number: 1,
    caption: 'Fig. 1. Workflow of the study as a flowchart: leakage-safe data preparation (Day-30 gate), nested feature scenarios, student-grouped splitting, model training and selection, threshold selection on the validation partition (loop until the recall and precision constraints of Eq. (12) hold), a single locked-holdout evaluation, and the explainability, subgroup, and robustness analyses.',
  },
  {
    number: 2,
    caption: 'Fig. 2. Outcome distribution of the 32,593 enrollments. Green: Successful (47.20%); red: At-Risk (52.80%). A repeating student may appear in several tuples across course presentations. As detailed in Section V-A, student-level grouping places all tuples of a student in a single partition, so no student overlaps between the training, validation, and holdout sets.',
  },
  {
    number: 3,
    caption: 'Fig. 3. Leakage-safe temporal design. Predictors in all three nested scenarios (S0, S1, S2) use only information available on or before Day 30; later information is quarantined.',
  },
  {
    number: 4,
    caption: 'Fig. 4. Sigmoid link of Eq. (3). A student is flagged At-Risk when σ(z) ≥ θ; the operational threshold θ = 0.45 corresponds to the logit z ≈ −0.201.',
  },
  {
    number: 5,
    caption: 'Fig. 5. Holdout metrics computed from the confusion matrix with Eqs. (4)–(10). Green: recall (the primary target); red: error rates.',
  },
  {
    number: 6,
    caption: 'Fig. 6. F1 of Eq. (7) as a function of recall for fixed precision values. The red point is the holdout operating point (recall 0.8238, F1 = 0.7834), which lies on the dashed curve for precision 0.7468.',
  },
  {
    number: 7,
    caption: 'Fig. 7. Per-observation Brier loss of Eq. (11). The penalty grows quadratically with the distance between the predicted probability and the true class; the holdout mean is BS = 0.1638.',
  },
  {
    number: 8,
    caption: 'Fig. 8. Feasible region of the threshold rule in Eq. (12): recall ≥ 0.82 and precision ≥ 0.70 (shaded). The selected operating point θ* = 0.45 lies inside it on the holdout set.',
  },
  {
    number: 9,
    caption: 'Fig. 9. Incremental validation ROC-AUC gain when early academic features (S0 → S1) and VLE clickstream features (S1 → S2) are added.',
  },
  {
    number: 10,
    caption: 'Fig. 10. Holdout confusion matrix of the primary model (S2, HGB, θ = 0.45); darker cells contain more observations.',
  },
  {
    number: 11,
    caption: 'Fig. 11. SHAP attribution by feature family. The two dynamic families (blue) together contribute 65.83%.',
  },
  {
    number: 12,
    caption: 'Fig. 12. Descriptive subgroup At-Risk recall at θ = 0.45 on the holdout set (descriptive only, not a fairness claim).',
  },
];

export const paperTableCaptions: PaperTableCaption[] = [
  { roman: 'I', title: 'OUTCOME DISTRIBUTION OF THE BINARY TARGET' },
  { roman: 'II', title: 'SUMMARY OF TEMPORAL INFORMATION SCENARIOS' },
  { roman: 'III', title: 'HOLDOUT TEST SET CONFUSION MATRIX' },
  { roman: 'IV', title: 'HOLDOUT PERFORMANCE OF THE PRIMARY MODEL' },
  { roman: 'V', title: 'FEATURE FAMILY SHAP ATTRIBUTION SUMMARY' },
  { roman: 'VI', title: 'DESCRIPTIVE SUBGROUP EVALUATION' },
];

export const paperEquations = [
  { id: 1, label: '(1)', tex: 'u = (\\text{code\\_module}, \\text{code\\_presentation}, \\text{id\\_student})' },
  { id: 2, label: '(2)', tex: 'y = \\begin{cases} 1, & \\text{if outcome is Withdrawn or Fail} \\\\ 0, & \\text{if outcome is Pass or Distinction} \\end{cases}' },
  { id: 3, label: '(3)', tex: 'P(y=1|x) = \\sigma(w^T x + b) = \\frac{1}{1 + \\exp[-(w^T x + b)]}' },
  { id: 4, label: '(4)', tex: '\\text{Recall} = \\frac{TP}{TP + FN}' },
  { id: 5, label: '(5)', tex: '\\text{Precision} = \\frac{TP}{TP + FP}' },
  { id: 6, label: '(6)', tex: '\\text{Specificity} = \\frac{TN}{TN + FP}' },
  { id: 7, label: '(7)', tex: 'F_1 = \\frac{2 \\cdot (\\text{Precision} \\cdot \\text{Recall})}{\\text{Precision} + \\text{Recall}}' },
  { id: 8, label: '(8)', tex: '\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}' },
  { id: 9, label: '(9)', tex: '\\text{FPR} = \\frac{FP}{FP + TN}' },
  { id: 10, label: '(10)', tex: '\\text{FNR} = \\frac{FN}{FN + TP}' },
  { id: 11, label: '(11)', tex: 'BS = \\frac{1}{N} \\sum_{i=1}^N (p_i - y_i)^2' },
  { id: 12, label: '(12)', tex: '\\theta^* = \\max\\{\\theta \\in [0.10, 0.90] : \\text{Recall}(\\theta) \\ge 0.82 \\land \\text{Precision}(\\theta) \\ge 0.70\\}' },
];

export const paperSections: PaperSection[] = [
  {
    numeral: 'I',
    title: 'INTRODUCTION',
    paragraphs: [
      'STUDENT attrition has long been a central concern of higher education [1], and it is considerably more severe in distance and online programs, where attrition at times exceeds 40% [2, 3]. Open-entry institutions such as the Open University (UK) enroll students whose educational, professional, and psychosocial backgrounds are especially diverse [4]. Because teacher–learner communication takes place mainly through online learning management systems, tutors lack the informal cues available in a physical classroom and may not notice disengagement until students have fallen behind or dropped out. Early warning systems (EWS) that flag at-risk students early in a course presentation are therefore important for targeted advising and proactive support [5, 6], and large-scale deployments at the Open University have shown that predictive learning analytics can support teachers in practice [7, 8].',
      'Learning analytics (LA) and educational data mining (EDM) have grown from descriptive reporting toward predictive systems [9, 10, 11]. A central question is the earliest time horizon at which reliable risk prediction is possible, because the usefulness of a model depends on when its inputs become available. Student dropout can be predicted with machine learning from data collected early in a study programme [12]. At enrollment, however, only static characteristics are known, such as socioeconomic status, prior educational attainment, age, and declared disability, and these alone offer limited predictive discrimination and raise concerns about demographic profiling. Conversely, models that use clickstream data aggregated over a whole course can predict performance well [13] but arrive too late for timely intervention. Naive data extraction that ignores the course life cycle can also cause temporal (target) leakage, for example by using end-of-course examination data or unregistration timestamps recorded after enrollment, which inflates performance estimates [14, 15].',
      'Beyond predictive power, educational stakeholders need interpretable rationales before investing in advising [16, 17], and additive attribution methods such as SHAP [18] make such rationales available for complex models. Automated predictive systems also require descriptive assessment stratified by demographic group, to determine whether predictive sensitivity differs across groups under a constant decision threshold [19, 20, 21, 22].',
      'This study presents an experimental investigation of early student performance prediction on OULAD. We build a leakage-quarantined processing pipeline (Fig. 1), consider three nested temporal scenarios (S0, S1, S2) with a Day-30 cutoff, use student-level grouped splitting, compare three families of machine learning (ML) models, examine probability calibration and operational threshold trade-offs, and report descriptive subgroup and robustness checks. The contributions of this study are as follows.',
    ],
    bullets: [
      'Leakage-Safe Temporality: An explicit protocol that quarantines post-Day-30 traces, unregistration timestamps, and examination data so that predictors reflect only information available on or before Day 30.',
      'Nested Scenario Progression: S0 (Intake Baseline), S1 (Early Academic Progression), and S2 (Early Behavioral Progression), with the incremental validation ROC-AUC gain of each step reported.',
      'Student-Grouped Evaluation: Student-level partitioning of training, validation, and holdout data, which addresses the 11.7% repeat-enrollment rate in OULAD.',
      'SHAP-Based Attribution: Quantification of the primary model’s predictive reliance on each feature family.',
      'Descriptive Subgroup Evaluation: Assessment of the frozen model within gender, disability, prior educational attainment, and socioeconomic deprivation subgroups.',
    ],
  },
  {
    numeral: 'II',
    title: 'RELATED WORK',
    paragraphs: [],
    subsections: [
      {
        letter: 'A',
        title: 'Learning Analytics and Student Performance Prediction',
        paragraphs: [
          'Learning analytics (LA) and EDM have moved beyond purely descriptive, retrospective reporting toward predictive systems with early-warning architectures [9, 10]. Romero and Ventura [23] classified early student modeling approaches, including statistical regression, decision trees, and Bayesian networks. Early withdrawal is one of the most common forms of course attrition in distance learning. Hlosta et al. [6] showed that struggling students can be detected in the Open University VLE during the first weeks of study. However, many published OULAD studies ignore the temporal dimension: they add all clicks throughout the presentation or use the unregistration date as a feature, which causes temporal leakage and makes deployment claims questionable.',
        ],
      },
      {
        letter: 'B',
        title: 'Early Warning Systems and Temporal Leakage',
        paragraphs: [
          'An EWS has a time dimension: predictions must reach advisors early enough to act on them, because interventions after the middle of a semester often have little effect on academic decline. Temporal leakage is the use of information in the predictors that only becomes available after the time of prediction. One of the most common leakages in OULAD is the unregistration date, since the existence of a withdrawal date is a deterministic proxy for the final outcome. This study addresses the problem by explicitly enforcing a Day-30 boundary.',
        ],
      },
      {
        letter: 'C',
        title: 'Machine Learning Algorithms in Education',
        paragraphs: [
          'In tabular educational settings, tree-based ensembles such as random forests [24] are reported to outperform linear models. The foundational gradient boosting formulation was established by Friedman [25]. In modern implementations, histogram-based binning accelerates tree construction: continuous features are discretized into integer-valued buckets, and missing values (e.g., an assignment that was not submitted) are handled natively [26].',
        ],
      },
      {
        letter: 'D',
        title: 'Explainable AI and Feature Attribution',
        paragraphs: [
          'Transparent explanations are crucial for the adoption of algorithmic decision aids in education. Khosravi et al. [17] proposed the XAI-ED framework, which emphasizes that pedagogical stakeholders need human-interpretable attributions. Lundberg and Lee [18] unified additive feature attribution methods under a single framework, Shapley Additive Explanations (SHAP), which is grounded in the Shapley values of cooperative game theory.',
        ],
      },
      {
        letter: 'E',
        title: 'Algorithmic Fairness and Subgroup Evaluation',
        paragraphs: [
          'As predictive models increasingly guide institutional resources, algorithmic fairness has become a concern. Algorithmic bias is common and often stems from historical data disparities or base-rate differences [21]. Gardner et al. [22] proposed slicing analysis to examine predictive student models separately by demographic group. In line with this work, subgroup analyses of observational data are reported here descriptively rather than as claims of universal fairness.',
        ],
      },
    ],
  },
  {
    numeral: 'III',
    title: 'DATASET AND PROBLEM FORMULATION',
    paragraphs: [
      'The analyses use the open, anonymized OULAD [4], which covers 22 course presentations of seven undergraduate modules during the 2013 and 2014 academic years. The raw data consist of seven relational tables: studentInfo.csv (32,593 records of demographic and socioeconomic information on 28,785 unique students); studentRegistration.csv (one record per student per course presentation, with registration and unregistration dates); studentAssessment.csv (173,912 assessment submission records); assessments.csv (one record per assessment, with due date, weight, and type); studentVle.csv (10,655,280 daily clickstream records per student and resource); vle.csv (one record per VLE resource, with resource metadata); and courses.csv (one record per course presentation, with presentation length in days).',
    ],
    subsections: [
      {
        letter: 'A',
        title: 'Analytical Unit',
        paragraphs: [
          'Students often take multiple courses or retake a previous course, so modeling at the unique-student level would mask variation between courses. The analytical unit is therefore the tuple (course presentation, enrollment):',
          'A repeating student may appear in several tuples across course presentations. As detailed in Section V-A, student-level grouping places all tuples of a student in a single partition, so no student overlaps between the training, validation, and holdout sets.',
        ],
      },
      {
        letter: 'B',
        title: 'Primary Binary Target',
        paragraphs: [
          'The goal is to identify students at risk of an unsuccessful course outcome. In line with current learning analytics practice, the binary target y (is_at_risk) is defined as',
          'Thus, Successful = Pass + Distinction and At-Risk = Withdrawn + Fail. The outcome distribution is relatively balanced, as shown in Fig. 2 and Table I (N=32,593 observations).',
          'Grouping Fail and Withdrawn is an operational decision intended to trigger advising outreach early. It does not imply that academic failure and administrative withdrawal are the same academic or behavioral process.',
        ],
      },
    ],
  },
  {
    numeral: 'IV',
    title: 'METHODOLOGY',
    paragraphs: [],
    subsections: [
      {
        letter: 'A',
        title: 'Data Integration and Leakage Prevention',
        paragraphs: [
          'The protocol prevents temporal leakage in three ways. First, the date_unregistration variable was quarantined and excluded to avoid target leakage. Second, end-of-course examination information was removed before feature computation, since examinations take place long after the early-warning horizon. Third, feature construction respected the prediction boundary and excluded all assessment and VLE information after Day 30 (Fig. 3).',
        ],
      },
      {
        letter: 'B',
        title: 'Normalization and Scaling',
        paragraphs: [
          'Missing numerical predictors were imputed with the training-fold median, followed by explicit binary missingness indicators. All preprocessing was fit on the training data only. Nominal categorical predictors were one-hot encoded, with the encoder likewise fit on the training data only. Predictors were standardized to zero mean and unit variance for Logistic Regression and left unstandardized for tree-based models. The HistGradientBoostingClassifier additionally applies histogram-based binning internally when constructing trees.',
        ],
      },
      {
        letter: 'C',
        title: 'Temporal Feature Engineering',
        paragraphs: [
          'Predictors are organized into three strictly nested levels, summarized in Table II.',
          'Scenario S0 (Intake Baseline): Static intake and enrollment data are captured in S0. It consists of 13 raw predictors (such as gender, disability, highest_education, and imd_band), which yield 52 transformed features after one-hot encoding.',
          'Scenario S1 (Early Academic Progression): S1 adds eight early academic and assessment features available on or before Day 30 (e.g., early_avg_score_d30 and has_early_assessment_submission_d30) to S0, resulting in 21 raw predictors and 60 transformed features.',
          'Scenario S2 (Early Behavioral Progression): S2 extends S1 with eight VLE behavioral features available on or before Day 30, such as early_vle_active_days_d30 and early_vle_total_clicks_d30. Because all such interactions occur on or before the Day-30 cutoff, they precede the outcome and do not introduce temporal leakage. This results in 29 raw predictors and 68 transformed features.',
        ],
      },
    ],
  },
  {
    numeral: 'V',
    title: 'EXPERIMENTAL DESIGN',
    paragraphs: [],
    subsections: [
      {
        letter: 'A',
        title: 'Student-Level Grouped Partitioning',
        paragraphs: [
          'Student-level grouped partitioning was applied with random seed 42, ensuring that no student appears in more than one split. The partitions are: training, 22,815 observations (20,149 students); validation, 4,889 observations (4,318 students); and holdout, 4,889 observations (4,318 students). The holdout set was not used for model fitting, preprocessing fitting, hyperparameter tuning, model selection, or threshold optimization. Model comparison additionally used 5-fold student-grouped cross-validation.',
        ],
      },
      {
        letter: 'B',
        title: 'Model Architectures',
        paragraphs: [
          'Three model families were tested.',
          'Logistic Regression (LR): A linear baseline that models the probability of the positive (At-Risk) class as',
          'where x is the feature vector, w is the learned coefficient vector (optimized with an L2 penalty), b is the intercept, and σ(·) is the sigmoid function (Fig. 4).',
          'Random Forest (RF): An ensemble of 200 decision trees [24] with max_depth=15 and min_samples_leaf=10.',
          'HistGradientBoostingClassifier (HGB): A gradient boosting architecture [25] with histogram-based binning and native missing-value handling, as implemented in scikit-learn [27]. The hyperparameters were learning_rate=0.05, max_iter=200, max_leaf_nodes=31, min_samples_leaf=20, and class_weight=None.',
        ],
      },
      {
        letter: 'C',
        title: 'Evaluation Metrics',
        paragraphs: [
          'Let TP, TN, FP, and FN denote the numbers of true positives, true negatives, false positives, and false negatives, respectively, with At-Risk as the positive class. The metrics, evaluated on the holdout set in Fig. 5, are',
          'PR-AUC, the Brier score [28, 29], and ROC-AUC are also reported. Recall and PR-AUC are emphasized because of the high pedagogical cost of failing to identify an at-risk student.',
          'The Brier score measures probabilistic calibration [30] over N observations:',
          'where p_i is the predicted probability that the i-th observation is At-Risk and y_i ∈ {0, 1} is its actual class. Fig. 6 shows how F1 trades off recall and precision, and Fig. 7 shows the Brier loss. A student-level block-cluster bootstrap was used to estimate 95% confidence intervals.',
        ],
      },
      {
        letter: 'D',
        title: 'Operational Threshold Optimization',
        paragraphs: [
          'Default thresholds may be suboptimal for academic advising workflows, so this study aims to balance sensitivity against control of false alerts. Following the experimental protocol, the threshold was selected on the validation partition as',
          'where θ is a candidate threshold on the predicted At-Risk probability. This procedure yielded an operational threshold of 0.45.',
          'Threshold optimization was performed only on the validation split; the threshold was fixed before the final holdout evaluation, and the holdout set was never used for threshold selection (Fig. 8).',
        ],
      },
    ],
  },
  {
    numeral: 'VI',
    title: 'RESULTS',
    paragraphs: [],
    subsections: [
      {
        letter: 'A',
        title: 'Validation Performance and Incremental Gains',
        paragraphs: [
          'The HistGradientBoostingClassifier performed best among all classifiers on every evaluation metric on the validation partition. Validation ROC-AUC improved by 0.1384 from S0 to S1, and by a further 0.0833 from S1 to S2 (Fig. 9).',
        ],
      },
      {
        letter: 'B',
        title: 'Primary Holdout Evaluation',
        paragraphs: [
          'The frozen primary model (Scenario S2, HistGradientBoostingClassifier) was evaluated on the holdout set of 4,889 observations, of which 2,582 are At-Risk (52.81%) and 2,307 are Successful (47.19%). The resulting confusion matrix is shown in Fig. 10 and Table III.',
          'The holdout metrics derived from this confusion matrix, with 95% confidence intervals, are listed in Table IV. A dash indicates that no confidence interval is given.',
        ],
      },
    ],
  },
  {
    numeral: 'VII',
    title: 'EXPLAINABILITY AND SUBGROUP ANALYSIS',
    paragraphs: [
      'SHAP [18] was used to explain the contribution of each feature. Shapley values were computed with a model-agnostic explainer applied to the model’s native probability function P(y=1|x), using 100 stratified background observations. Attributions over the 68 transformed feature dimensions were aggregated back to the 29 original raw predictors, and the attribution by feature family is reported in Fig. 11 and Table V.',
      'Together, the two dynamic families (academic and VLE) contributed 65.83% of the total attribution. The four most important raw predictors were early_avg_score_d30, early_vle_active_days_d30, early_vle_total_clicks_d30, and has_early_assessment_submission_d30. These attributions reflect observational association with the model’s predictions and are not causal.',
    ],
    subsections: [
      {
        letter: 'A',
        title: 'Descriptive Subgroup Evaluation',
        paragraphs: [
          'Fig. 12 and Table VI report performance at the operating threshold of 0.45 on the holdout set. These are descriptive subgroup metrics, not normative fairness conclusions. A dash (—) indicates that the value is not available.',
          'Recall was similar for women (81.79%) and men (82.85%). Recall for students with a declared disability (83.33%) was marginally higher than for students without one (82.26%), but the false positive rate was higher for students with a declared disability (39.25%) than for those without (30.55%). Recall also varied by prior attainment, from 84.13% for students with qualifications lower than A Level to 78.87% for those with higher education qualifications, and by socioeconomic deprivation, from 84.23% (most deprived) to 80.28% (least deprived). These values do not imply that the model is fair; they only describe the behavior of the model within each subgroup.',
        ],
      },
    ],
  },
  {
    numeral: 'VIII',
    title: 'ROBUSTNESS AND SENSITIVITY ANALYSIS',
    paragraphs: [
      'The primary model was re-tested under several partition seeds (7, 21, 42, 84, and 123) to confirm that its predictive capacity was not an artifact of a single random partition; performance was consistent across seeds.',
      'A class-weighted variant changed test ROC-AUC by only -0.0002 but reduced specificity from 68.75% to 65.31%, adding 157 false positives relative to the unweighted baseline. The unweighted, native probabilities were therefore used for all final test predictions and for the SHAP explanations.',
    ],
  },
  {
    numeral: 'IX',
    title: 'DISCUSSION',
    paragraphs: [
      'The experiments indicate that academic performance and VLE interaction data available up to Day 30 are informative for predicting the probability of an unsuccessful outcome. Static intake information was less discriminative. Adding early graded assessments (S0 to S1) and VLE clickstream features (S1 to S2) increased validation ROC-AUC by 0.1384 and 0.0833, respectively, and the primary model (Scenario S2) reached a holdout ROC-AUC of 0.8406. Distributed engagement (active days) and early scores were strong contributors to the SHAP attributions, suggesting that frequent engagement and early scores over time are good predictors of eventual success. Strict temporal containment and student-level grouping minimize leakage and contamination.',
      'The operational implications are as follows. At θ=0.45, the model identifies 82.38% of at-risk students, while flagging 721 of the 2,307 successful students in the holdout set as at-risk. The subgroup results show that error rates are not uniform across strata and should therefore be monitored in any deployment.',
    ],
  },
  {
    numeral: 'X',
    title: 'LIMITATIONS',
    paragraphs: [
      'Several limitations should be noted. First, OULAD does not come from a traditional campus-based university, so generalizability to such settings is not established. Second, the results are descriptive and do not identify the causal effects of interventions. Third, Fail and Withdrawn are grouped as an operational modeling choice and are not distinguished as administrative versus academic outcomes. Fourth, the data contain no logs of instructor communication or other private institutional activities. Fifth, SHAP explains what drives the model’s predictions, not which interventions are effective.',
    ],
  },
  {
    numeral: 'XI',
    title: 'CONCLUSION',
    paragraphs: [
      'This study showed that the early academic milestones of a course and the digital behavioral traces produced on or before Day 30 of a course presentation carry useful predictive signal for early student performance prediction. With student-grouped validation, the HistGradientBoostingClassifier achieved an At-Risk Recall of 82.38% and an F1-score of 0.7834 on the holdout set. SHAP-based aggregated attribution showed that dynamic academic and VLE features account for 65.83% of the model’s attribution. Recall was similar across gender and declared-disability subgroups, but false positive rates and recall differed across other strata. Future research should conduct prospective intervention studies to measure the effect of early-warning alerts on student retention and academic achievement.',
    ],
  },
];

export const paperReferences: PaperReference[] = [
  {
    id: 1,
    citation: 'V. Tinto, Leaving College: Rethinking the Causes and Cures of Student Attrition, 2nd ed. Chicago, IL, USA: Univ. Chicago Press, 1993.',
    year: 1993,
    url: 'https://scholar.google.com/scholar?q=Tinto%20Leaving%20College%3A%20Rethinking%20the%20Causes%20and%20Cures%20of%20Student%20Attrition',
  },
  {
    id: 2,
    citation: 'S. B. Kotsiantis, C. J. Pierrakeas, and P. E. Pintelas, “Preventing student dropout in distance learning using machine learning techniques,” in Proc. Int. Conf. Knowl.-Based Intell. Inf. Eng. Syst. (KES), 2003, pp. 267–274.',
    year: 2003,
    url: 'https://doi.org/10.1007/978-3-540-45226-3_37',
  },
  {
    id: 3,
    citation: 'I. Lykourentzou, I. Giannoukos, V. Nikolopoulos, G. Mpardis, and V. Loumos, “Dropout prediction in e-learning courses through the combination of machine learning techniques,” Comput. Educ., vol. 53, no. 3, pp. 950–965, 2009.',
    year: 2009,
    url: 'https://doi.org/10.1016/j.compedu.2009.05.010',
  },
  {
    id: 4,
    citation: 'J. Kuzilek, M. Hlosta, and Z. Zdrahal, “Open University Learning Analytics dataset,” Sci. Data, vol. 4, 2017, Art. no. 170171.',
    year: 2017,
    url: 'https://doi.org/10.1038/sdata.2017.171',
  },
  {
    id: 5,
    citation: 'K. E. Arnold and M. D. Pistilli, “Course Signals at Purdue: Using learning analytics to increase student success,” in Proc. 2nd Int. Conf. Learn. Analytics Knowl. (LAK), 2012, pp. 267–270.',
    year: 2012,
    url: 'https://doi.org/10.1145/2330601.2330666',
  },
  {
    id: 6,
    citation: 'M. Hlosta, Z. Zdrahal, and J. Zendulka, “Ouroboros: Early identification of at-risk students without models based on legacy data,” in Proc. 7th Int. Conf. Learn. Analytics Knowl. (LAK), 2017, pp. 6–15.',
    year: 2017,
    url: 'https://doi.org/10.1145/3027385.3027449',
  },
  {
    id: 7,
    citation: 'C. Herodotou, B. Rienties, A. Boroowa, Z. Zdrahal, and M. Hlosta, “A large-scale implementation of predictive learning analytics in higher education: The teachers’ role and perspective,” Educ. Technol. Res. Develop., vol. 67, no. 5, pp. 1273–1306, 2019.',
    year: 2019,
    url: 'https://doi.org/10.1007/s11423-019-09685-0',
  },
  {
    id: 8,
    citation: 'C. Herodotou et al., “Empowering online teachers through predictive learning analytics,” Brit. J. Educ. Technol., vol. 50, no. 6, pp. 3064–3079, 2019.',
    year: 2019,
    url: 'https://doi.org/10.1111/bjet.12853',
  },
  {
    id: 9,
    citation: 'G. Siemens and P. Long, “Penetrating the fog: Analytics in learning and education,” EDUCAUSE Rev., vol. 46, no. 5, pp. 30–40, 2011.',
    year: 2011,
    url: 'https://er.educause.edu/articles/2011/9/penetrating-the-fog-analytics-in-learning-and-education',
  },
  {
    id: 10,
    citation: 'R. S. Baker and P. S. Inventado, “Educational data mining and learning analytics,” in Learning Analytics: From Research to Practice. New York, NY, USA: Springer, 2014, pp. 61–75.',
    year: 2014,
    url: 'https://doi.org/10.1007/978-1-4614-3305-7_4',
  },
  {
    id: 11,
    citation: 'C. Romero and S. Ventura, “Educational data mining and learning analytics: An updated survey,” WIREs Data Mining Knowl. Discovery, vol. 10, no. 3, 2020, Art. no. e1355.',
    year: 2020,
    url: 'https://doi.org/10.1002/widm.1355',
  },
  {
    id: 12,
    citation: 'L. Kemper, G. Vorhoff, and B. U. Wigger, “Predicting student dropout: A machine learning approach,” Eur. J. Higher Educ., vol. 10, no. 1, pp. 28–47, 2020.',
    year: 2020,
    url: 'https://doi.org/10.1080/21568235.2020.1718520',
  },
  {
    id: 13,
    citation: 'H. Waheed, S.-U. Hassan, N. R. Aljohani, J. Hardman, S. Alelyani, and R. Nawaz, “Predicting academic performance of students from VLE big data using deep learning models,” Comput. Hum. Behav., vol. 104, 2020, Art. no. 106189.',
    year: 2020,
    url: 'https://doi.org/10.1016/j.chb.2019.106189',
  },
  {
    id: 14,
    citation: 'S. Kaufman, S. Rosset, C. Perlich, and O. Stitelman, “Leakage in data mining: Formulation, detection, and avoidance,” ACM Trans. Knowl. Discovery Data, vol. 6, no. 4, pp. 1–21, 2012.',
    year: 2012,
    url: 'https://doi.org/10.1145/2382577.2382579',
  },
  {
    id: 15,
    citation: 'S. Kapoor and A. Narayanan, “Leakage and the reproducibility crisis in machine-learning-based science,” Patterns, vol. 4, no. 9, 2023, Art. no. 100804.',
    year: 2023,
    url: 'https://doi.org/10.1016/j.patter.2023.100804',
  },
  {
    id: 16,
    citation: 'F. Doshi-Velez and B. Kim, “Towards a rigorous science of interpretable machine learning,” 2017, arXiv:1702.08608.',
    year: 2017,
    url: 'https://arxiv.org/abs/1702.08608',
  },
  {
    id: 17,
    citation: 'H. Khosravi et al., “Explainable artificial intelligence in education,” Comput. Educ., Artif. Intell., vol. 3, 2022, Art. no. 100074.',
    year: 2022,
    url: 'https://doi.org/10.1016/j.caeai.2022.100074',
  },
  {
    id: 18,
    citation: 'S. M. Lundberg and S.-I. Lee, “A unified approach to interpreting model predictions,” in Proc. Adv. Neural Inf. Process. Syst. (NeurIPS), vol. 30, 2017, pp. 4765–4774.',
    year: 2017,
    url: 'https://arxiv.org/abs/1705.07874',
  },
  {
    id: 19,
    citation: 'M. Hardt, E. Price, and N. Srebro, “Equality of opportunity in supervised learning,” in Proc. Adv. Neural Inf. Process. Syst. (NeurIPS), vol. 29, 2016, pp. 3315–3323.',
    year: 2016,
    url: 'https://arxiv.org/abs/1610.02413',
  },
  {
    id: 20,
    citation: 'N. Mehrabi, F. Morstatter, N. Saxena, K. Lerman, and A. Galstyan, “A survey on bias and fairness in machine learning,” ACM Comput. Surv., vol. 54, no. 6, pp. 1–35, 2021.',
    year: 2021,
    url: 'https://doi.org/10.1145/3457607',
  },
  {
    id: 21,
    citation: 'R. S. Baker and A. Hawn, “Algorithmic bias in education,” Int. J. Artif. Intell. Educ., vol. 32, no. 4, pp. 1052–1092, 2022.',
    year: 2022,
    url: 'https://doi.org/10.1007/s40593-021-00285-9',
  },
  {
    id: 22,
    citation: 'J. Gardner, C. Brooks, and R. Baker, “Evaluating the fairness of predictive student models through slicing analysis,” in Proc. 9th Int. Conf. Learn. Analytics Knowl. (LAK), 2019, pp. 226–235.',
    year: 2019,
    url: 'https://doi.org/10.1145/3303772.3303791',
  },
  {
    id: 23,
    citation: 'C. Romero and S. Ventura, “Educational data mining: A review of the state of the art,” IEEE Trans. Syst., Man, Cybern. C, Appl. Rev., vol. 40, no. 6, pp. 601–618, Nov. 2010.',
    year: 2010,
    url: 'https://doi.org/10.1109/TSMCC.2010.2053532',
  },
  {
    id: 24,
    citation: 'L. Breiman, “Random forests,” Mach. Learn., vol. 45, no. 1, pp. 5–32, 2001.',
    year: 2001,
    url: 'https://doi.org/10.1023/A:1010933404324',
  },
  {
    id: 25,
    citation: 'J. H. Friedman, “Greedy function approximation: A gradient boosting machine,” Ann. Statist., vol. 29, no. 5, pp. 1189–1232, 2001.',
    year: 2001,
    url: 'https://doi.org/10.1214/aos/1013203451',
  },
  {
    id: 26,
    citation: 'G. Ke et al., “LightGBM: A highly efficient gradient boosting decision tree,” in Proc. Adv. Neural Inf. Process. Syst. (NeurIPS), 2017, pp. 3146–3154.',
    year: 2017,
    url: 'https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html',
  },
  {
    id: 27,
    citation: 'F. Pedregosa et al., “Scikit-learn: Machine learning in Python,” J. Mach. Learn. Res., vol. 12, pp. 2825–2830, 2011.',
    year: 2011,
    url: 'https://jmlr.org/papers/v12/pedregosa11a.html',
  },
  {
    id: 28,
    citation: 'G. W. Brier, “Verification of forecasts expressed in terms of probability,” Monthly Weather Rev., vol. 78, no. 1, pp. 1–3, 1950.',
    year: 1950,
    url: 'https://doi.org/10.1175/1520-0493(1950)078<0001:VOFEIT>2.0.CO;2',
  },
  {
    id: 29,
    citation: 'A. Niculescu-Mizil and R. Caruana, “Predicting good probabilities with supervised learning,” in Proc. 22nd Int. Conf. Mach. Learn. (ICML), 2005, pp. 625–632.',
    year: 2005,
    url: 'https://doi.org/10.1145/1102351.1102430',
  },
  {
    id: 30,
    citation: 'J. C. Platt, “Probabilistic outputs for support vector machines and comparisons to regularized likelihood methods,” in Advances in Large Margin Classifiers. Cambridge, MA, USA: MIT Press, 1999, pp. 61–74.',
    year: 1999,
    url: 'https://scholar.google.com/scholar?q=Platt%20Probabilistic%20outputs%20for%20support%20vector%20machines%20and%20comparisons%20to%20regularized%20likelihood%20methods',
  },
];
