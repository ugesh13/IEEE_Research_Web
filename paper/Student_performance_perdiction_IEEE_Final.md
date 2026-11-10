

## 1IEEE TRANSACTIONS ON ARTIFICIAL INTELLIGENCE, VOL. XX, NO. XX, MONTH 2026
Use of Machine Learning Techniques and Explainable
AI for Predicting Student Performance: An
Experimental Study With the Open University
Learning Analytics Dataset (OULAD)
Ugesh Kumar and Riya Sharma
Abstract—A major challenge in distance higher education
is  the  early  identification  of  students  who  are  at  risk  of
failing  their  course(s).Student  performance  prediction
models  often  rely  on  one-time  demographics  or  on  be-
havior  aggregated  over  full  semesters,  and  can  therefore
suffer  from  temporal  data  leakage.This  experimental
study uses the Open University Learning Analytics Dataset
(OULAD),  which  contains  32,593  course-presentation  ob-
servations from 28,785 unique students across seven modu-
lar subjects. Only information available on or before a Day-
30  temporal  boundary  is  used  to  assess  three  nested  tem-
poral scenarios:  the Intake Baseline (S0), Early Academic
Progression  (S1),  and  S1  augmented  with  Virtual  Learn-
ing Environment (VLE) clickstream features (S2). Student-
level grouped partitioning is applied to the training, valida-
tion,  and  holdout  data,  and  5-fold  student-grouped  cross-
validation is used for model comparison.  The best discrim-
ination was obtained with the HistGradientBoostingClassi-
fier, which achieved an ROC-AUC of 0.8406, an At-Risk Re-
call of 82.38%, and an F1-score of 0.7834 on the locked hold-
out set (4,889 observations, 4,318 students) at an operational
threshold of 0.45 selected on the validation partition. SHAP
analysis showed that dynamic academic and VLE features
account for 65.83% of the aggregated attribution.  Because
this  study  is  experimental  and  observational,  the  attribu-
tions convey predictive association,  not causal effects,  and
subgroup results are presented descriptively.
Index Terms—Educational data mining, early warning systems,
explainable  artificial  intelligence,  gradient  boosting,  learning
analytics, SHAP, student performance prediction.
## I.   INTRODUCTION
STUDENTattrition has long been a central concern of higher ed-
ucation [1], and it is considerably more severe in distance and
online programs, where attrition at times exceeds 40% [2, 3].
Open-entry institutions such as the Open University (UK) en-
roll  students  whose  educational,  professional,  and  psychoso-
Manuscript received XX Month 2026; revised XX Month 2026; accepted
XX Month 2026. Date of publication XX Month 2026. (Corresponding author:
## Ugesh Kumar.)
The  authors  are  with  the  Department  of  Computer  Science  and  En-
gineering,    JAIN   (Deemed-to-be   University),    Bengaluru,    India   (e-mail:
juug25btech27281@jainuniversity.ac.in).
cial backgrounds are especially diverse [4].  Because teacher–
learner communication takes place mainly through online learn-
ing management systems, tutors lack the informal cues available
in a physical classroom and may not notice disengagement until
students have fallen behind or dropped out. Early warning sys-
tems (EWS) that flag at-risk students early in a course presenta-
tion are therefore important for targeted advising and proactive
support [5, 6], and large-scale deployments at the Open Univer-
sity have shown that predictive learning analytics can support
teachers in practice [7, 8].
Learning analytics (LA) and educational data mining (EDM)
have  grown  from  descriptive  reporting  toward  predictive  sys-
tems [9, 10, 11]. A central question is the earliest time horizon
at which reliable risk prediction is possible,  because the use-
fulness of a model depends on when its inputs become avail-
able.  Student dropout can be predicted with machine learning
from data collected early in a study programme [12].   At en-
rollment, however, only static characteristics are known, such
as socioeconomic status, prior educational attainment, age, and
declared disability, and these alone offer limited predictive dis-
crimination  and  raise  concerns  about  demographic  profiling.
Conversely,  models that use clickstream data aggregated over
a whole course can predict performance well [13] but arrive too
late for timely intervention.  Naive data extraction that ignores
the course life cycle can also cause temporal (target) leakage,
for example by using end-of-course examination data or unreg-
istration timestamps recorded after enrollment,  which inflates
performance estimates [14, 15].
Beyond predictive power, educational stakeholders need in-
terpretable rationales before investing in advising [16, 17], and
additive  attribution  methods  such  as  SHAP  [18]  make  such
rationales  available  for  complex  models.   Automated  predic-
tive  systems  also  require  descriptive  assessment  stratified  by
demographic group,  to determine whether predictive sensitiv-
ity  differs  across  groups  under  a  constant  decision  threshold
## [19, 20, 21, 22].
This  study  presents  an  experimental  investigation  of  early
student   performance   prediction   on   OULAD.   We   build   a
leakage-quarantined processing pipeline (Fig. 1), consider three
nested temporal scenarios (S0,  S1,  S2) with a Day-30 cutoff,
use student-level grouped splitting,  compare three families of
machine learning (ML) models, examine probability calibration
and operational threshold trade-offs, and report descriptive sub-
Department of Computer Science and Engineering, JAIN (Deemed-to-be University), Bengaluru, India
Email: juug25btech27281@jainuniversity.ac.in;  juug25btech24730@jainuniversity.ac.in

KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI2
group and robustness checks.  The contributions of this study
are as follows.
•Leakage-Safe Temporality:An explicit protocol that quar-
antines post-Day-30 traces,  unregistration timestamps,  and
examination data so that predictors reflect only information
available on or before Day 30.
•Nested  Scenario  Progression:S0  (Intake  Baseline),  S1
(Early  Academic  Progression),  and  S2  (Early  Behavioral
Progression),  with  the  incremental  validation  ROC-AUC
gain of each step reported.
•Student-Grouped  Evaluation:Student-level  partitioning  of
training,  validation,  and holdout data,  which addresses the
11.7% repeat-enrollment rate in OULAD.
•SHAP-Based  Attribution:Quantification  of  the  primary
model’s predictive reliance on each feature family.
•Descriptive Subgroup Evaluation:Assessment of the frozen
model within gender, disability, prior educational attainment,
and socioeconomic deprivation subgroups.
## KEYWORDS
Domainlearning analytics; educational data mining; distance edu-
cation; early warning system (EWS); student performance
prediction; student attrition; at-risk students
DataOpen  University  Learning  Analytics  Dataset  (OULAD);
virtual learning environment (VLE); clickstream; early as-
sessment scores; demographics; IMD deprivation band
Methodstemporal data leakage; Day-30 temporal boundary; nested
scenarios   (S0,   S1,   S2);   student-grouped   partitioning;
grouped cross-validation; logistic regression; random for-
est;  HistGradientBoostingClassifier;  threshold  optimiza-
tion
EvaluationROC-AUC;  PR-AUC;  recall;  precision;  specificity;  F1-
score;  Brier score;  confusion matrix;  probability calibra-
tion; bootstrap confidence interval
## Explainability
## & Fairness
SHAP; feature attribution;  subgroup evaluation;  algorith-
mic  fairness;  predictive  association  versus  causation;  ro-
bustness analysis
## OVERVIEW  OF THERESEARCH
Problem.Students  in  distance  education  need  to  be  flagged
early ,  but  models  that  usepost-cutoff data   overstate  perfor-
mance.
Approach.Aleakage-safepipelineonOULAD
## (
32,593 enrollments ,28,785 students )   uses   only   informa-
tion available by
Day 30 .   Threenested scenarios   (S0 intake,
S1  +  early  academic,  S2  +  VLE  clickstream)  and  three  model
families  (LR,  RF,  HGB)  are  compared  with
student-grouped
splits and 5-fold cross-validation.
Keyresults.Thebestmodel(HGB,S2)reaches
ROC-AUC 0.8406 ,At-Risk Recall 82.38% ,  andF1 0.7834
on   a   locked   holdout   at   a   validation-selected   threshold   of
θ
## ∗
=0.45 .SHAP  shows  that  dynamic  academic  and  VLE
features carry65.83%  of the attribution.
Scope.Subgroupandrobustnessresultsare
descriptive and associative, not causal .  The complete workflow
is shown in Fig. 1.
## II.   RELATEDWORK
A.  Learning Analytics and Student Performance Prediction
Learning analytics (LA) and EDM have moved beyond purely
descriptive,  retrospective  reporting  toward  predictive  systems
with  early-warning  architectures  [9,  10].    Romero  and  Ven-
tura [23] classified early student modeling approaches, includ-
ing statistical regression, decision trees, and Bayesian networks.
Early withdrawal is one of the most common forms of course
attrition  in  distance  learning.   Hlostaet  al.[6]  showed  that
struggling students can be detected in the Open University VLE
during  the  first  weeks  of  study.    However,  many  published
OULAD studies ignore the temporal dimension:  they add all
clicks throughout the presentation or use the unregistration date
as a feature, which causes temporal leakage and makes deploy-
ment claims questionable.
B.  Early Warning Systems and Temporal Leakage
An EWS has a time dimension:  predictions must reach advi-
sors early enough to act on them,  because interventions after
the  middle  of  a  semester  often  have  little  effect  on  academic
decline.  Temporal leakage is the use of information in the pre-
dictors that only becomes available after the time of prediction.
One of the most common leakages in OULAD is the unregis-
tration date, since the existence of a withdrawal date is a deter-
ministic proxy for the final outcome.  This study addresses the
problem by explicitly enforcing a Day-30 boundary.
C.  Machine Learning Algorithms in Education
In  tabular  educational  settings,  tree-based  ensembles  such  as
random forests [24] are reported to outperform linear models.
The foundational gradient boosting formulation was established
by  Friedman  [25].    In  modern  implementations,  histogram-
based binning accelerates tree construction: continuous features
are discretized into integer-valued buckets, and missing values
(e.g.,  an  assignment  that  was  not  submitted)  are  handled  na-
tively [26].
D.  Explainable AI and Feature Attribution
Transparent explanations are crucial for the adoption of algo-
rithmic decision aids in education.   Khosraviet al.[17] pro-
posed the XAI-ED framework, which emphasizes that pedagog-
ical stakeholders need human-interpretable attributions.  Lund-
berg  and  Lee  [18]  unified  additive  feature  attribution  meth-
ods under a single framework, Shapley Additive Explanations
(SHAP), which is grounded in the Shapley values of coopera-
tive game theory.
E.  Algorithmic Fairness and Subgroup Evaluation
As predictive models increasingly guide institutional resources,
algorithmic fairness has become a concern.   Algorithmic bias
is common and often stems from historical data disparities or

KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI3
Start:  OULAD
7 relational tables
Integrate tables
unitu= (module,
presentation, student)
Recorded on or
before Day 30?
Feature engineering
## S0⊂S1⊂S2
Student-grouped split
train / val / holdout
Quarantine and discard
post-Day-30, un-
registration, exams
Train LR, RF, HGB
5-fold grouped CV
Select best on validation
(HGB, scenario S2)
Recall≥0.82 and
## Precision≥0.70?
Fix threshold
θ
## ∗
## =0.45 (val-
idation only)
Evaluate once on
locked holdout
## Adjustθ∈[0.10,0.90]
and re-check
SHAP attribution
29 raw predictors
Descriptive sub-
group evaluation
Robustness:  seeds,
class weighting
End:  findings
and limitations
## Yes
## No
## Yes
## No
repeat
Fig. 1.  Workflow of the study as a flowchart:  leakage-safe data preparation (Day-30 gate), nested feature scenarios, student-grouped splitting, model training and
selection, threshold selection on the validation partition (loop until the recall and precision constraints of Eq. (12) hold), a single locked-holdout evaluation, and the
explainability, subgroup, and robustness analyses.
base-rate differences [21]. Gardneret al.[22] proposed slicing
analysis to examine predictive student models separately by de-
mographic group.  In line with this work, subgroup analyses of
observational data are reported here descriptively rather than as
claims of universal fairness.
## III.   DATASET ANDPROBLEMFORMULATION
The  analyses  use  the  open,  anonymized  OULAD  [4],  which
covers  22  course  presentations  of  seven  undergraduate  mod-
ules  during  the  2013  and  2014  academic  years.The  raw
data  consist  of  seven  relational  tables:studentInfo.csv
(32,593  records  of  demographic  and  socioeconomic  informa-
tion on 28,785 unique students);studentRegistration.csv
(one  record  per  student  per  course  presentation,  with  regis-
tration  and  unregistration  dates);studentAssessment.csv
(173,912 assessment submission records);assessments.csv
(one record per assessment, with due date, weight, and type);
studentVle.csv(10,655,280  daily  clickstream  records  per
student and resource);vle.csv(one record per VLE resource,
with  resource  metadata);  andcourses.csv(one  record  per
course presentation, with presentation length in days).
## A.  Analytical Unit
Students often take multiple courses or retake a previous course,
so modeling at the unique-student level would mask variation
between  courses.    The  analytical  unit  is  therefore  the  tuple
(course presentation, enrollment):
u= (code_module,code_presentation,id_student).(1)
## Pass
## 37.93%
## Distinction
## 9.28%
## Withdrawn31.16%
## Fail21.64%
Share of the 32,593 enrollments
Fig.  2.   Outcome  distribution  of  the  32,593  enrollments.   Green:  Successful
(47.20%); red: At-Risk (52.80%).
A repeating student may appear in several tuples across course
presentations. As detailed in Section V-A, student-level group-
ing  places  all  tuples  of  a  student  in  a  single  partition,  so  no
student overlaps between the training, validation, and holdout
sets.
## B.  Primary Binary Target
The goal is to identify students at risk of an unsuccessful course
outcome.   In line with current learning analytics practice,  the
binary targety(is_at_risk) is defined as
y=
## (
1,if outcome is Withdrawn or Fail
0,if outcome is Pass or Distinction.
## (2)
Thus,  Successful  =  Pass  +  Distinction  and  At-Risk  =  With-
drawn + Fail.  The outcome distribution is relatively balanced,
as shown in Fig. 2 and Table I (N=32,593 observations).
Grouping Fail and Withdrawn is an operational decision in-
tended to trigger advising outreach early. It does not imply that
academic  failure  and  administrative  withdrawal  are  the  same
academic or behavioral process.

KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI4
## TABLEI
## OUTCOMEDISTRIBUTION  OF THEBINARYTARGET
ClassOutcomeCountShare (%)
SuccessfulTotal15,38547.20
## Pass12,36137.93
## Distinction3,0249.28
At-RiskTotal17,20852.80
## Withdrawn10,15631.16
## Fail7,05221.64
## Day 0
## Day 30 (cutoff)
## End
Allowed predictors
## Quarantined
post-Day-30 traces,
unregistration dates,
examination data
S0: 13 raw / 52 feat.
S1 = S0 + 8 academic (21 / 60)
## S2 = S1 + 8 VLE (29 / 68)
nested scenarios
Fig. 3.  Leakage-safe temporal design.  Predictors in all three nested scenarios
(S0, S1, S2) use only information available on or before Day 30; later informa-
tion is quarantined.
## IV.   METHODOLOGY
A.  Data Integration and Leakage Prevention
The protocol prevents temporal leakage in three ways.   First,
thedate_unregistrationvariable was quarantined and ex-
cluded to avoid target leakage. Second, end-of-course examina-
tion information was removed before feature computation, since
examinations take place long after the early-warning horizon.
Third,  feature construction respected the prediction boundary
and excluded all assessment and VLE information after Day 30
(Fig. 3).
B.  Normalization and Scaling
Missing numerical predictors were imputed with the training-
fold  median,  followed  by  explicit  binary  missingness  indica-
tors.  All preprocessing was fit on the training data only.  Nom-
inal categorical predictors were one-hot encoded, with the en-
coder likewise fit on the training data only. Predictors were stan-
dardized to zero mean and unit variance for Logistic Regression
and left unstandardized for tree-based models.  The HistGradi-
entBoostingClassifier additionally applies histogram-based bin-
ning internally when constructing trees.
## C.  Temporal Feature Engineering
Predictors are organized into three strictly nested levels, sum-
marized in Table II.
Scenario S0 (Intake Baseline):Static intake and enrollment
data are captured in S0.  It consists of 13 raw predictors (such
as  gender,  disability,highest_education,  andimd_band),
which yield 52 transformed features after one-hot encoding.
Scenario S1 (Early Academic Progression):S1 adds eight
early  academic  and  assessment  features  available  on  or  be-
fore  Day  30  (e.g.,early_avg_score_d30andhas_early_
assessment_submission_d30) to S0, resulting in 21 raw pre-
## TABLEII
## SUMMARY OFTEMPORALINFORMATIONSCENARIOS
ScenarioDescriptionRawTransformed
S0Intake Baseline1352
S1Early Academic Progression2160
S2Early Behavioral Progression2968
dictors and 60 transformed features.
Scenario S2 (Early Behavioral Progression):S2 extends S1
with eight VLE behavioral features available on or before Day
30, such asearly_vle_active_days_d30andearly_vle_
total_clicks_d30. Because all such interactions occur on or
before the Day-30 cutoff, they precede the outcome and do not
introduce temporal leakage.  This results in 29 raw predictors
and 68 transformed features.
## V.   EXPERIMENTALDESIGN
A.  Student-Level Grouped Partitioning
Student-level  grouped  partitioning  was  applied  with  random
seed  42,  ensuring  that  no  student  appears  in  more  than  one
split.  The partitions are:  training, 22,815 observations (20,149
students); validation, 4,889 observations (4,318 students); and
holdout, 4,889 observations (4,318 students).  The holdout set
was  not  used  for  model  fitting,  preprocessing  fitting,  hyper-
parameter  tuning,  model  selection,  or  threshold  optimization.
Model  comparison  additionally  used  5-fold  student-grouped
cross-validation.
## B.  Model Architectures
Three model families were tested.
•Logistic Regression (LR):A linear baseline that models the
probability of the positive (At-Risk) class as
## P(y=1|x) =σ(w
## ⊤
x+b) =
## 1
## 1+exp[−(w
## ⊤
x+b)]
## (3)
wherexis the feature vector,wis the learned coefficient vec-
tor (optimized with an L2 penalty),bis the intercept,  and
σ(·)is the sigmoid function (Fig. 4).
•Random Forest (RF):An ensemble of 200 decision trees [24]
withmax_depth=15andmin_samples_leaf=10.
•HistGradientBoostingClassifier  (HGB):A  gradient  boost-
ing  architecture  [25]  with  histogram-based  binning  and
native  missing-value  handling,  as  implemented  in  scikit-
learn   [27].The   hyperparameters   werelearning_
rate=0.05,max_iter=200,max_leaf_nodes=31,min_
samples_leaf=20, andclass_weight=None.
## C.  Evaluation Metrics
Let TP, TN, FP, and FN denote the numbers of true positives,
true negatives, false positives, and false negatives, respectively,
with At-Risk as the positive class. The metrics, evaluated on the

KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI5
## −6
## −4−2024
## 6
## 0
## 0.2
## 0.4
## 0.6
## 0.8
## 1
z=ln
## 0.45
## 0.55
## ≈−0.201
z=w
## ⊤
x+b
σ
## (
z
## )
σ(z)
θ=0.45
Fig. 4.  Sigmoid link of Eq. (3).  A student is flagged At-Risk whenσ(z)≥θ;
the operational thresholdθ=0.45 corresponds to the logitz≈−0.201.
## Recall82.38
## Precision74.68
## Specificity
## 68.75
## Accuracy
## 75.95
## F
## 1
## ×100
## 78.34
## FPR
## 31.25
## FNR
## 17.62
values in %
Fig. 5.   Holdout metrics computed from the confusion matrix with Eqs. (4)–
(10). Green: recall (the primary target); red: error rates.
holdout set in Fig. 5, are
## Recall=
## T P
## T P+F N
## (4)
## Precision=
## T P
## T P+F P
## (5)
## Specificity=
## T N
## T N+F P
## (6)
## F
## 1
## =
2·(Precision·Recall)
Precision+Recall
## (7)
## Accuracy=
## T P+T N
## T P+T N+F P+F N
## (8)
## FPR=
## F P
## F P+T N
## (9)
## FNR=
## F N
## F N+T P
## .(10)
PR-AUC, the Brier score [28, 29], and ROC-AUC are also
reported.  Recall and PR-AUC are emphasized because of the
high pedagogical cost of failing to identify an at-risk student.
The Brier score measures probabilistic calibration [30] overN
observations:
## BS=
## 1
## N
## N
## ∑
i=1
## (p
i
## −y
i
## )
## 2
## (11)
wherep
i
is the predicted probability that theith observation is
At-Risk andy
i
∈{0,1}is its actual class.   Fig. 6 shows how
## F
## 1
trades off recall and precision,  and Fig. 7 shows the Brier
loss.  A student-level block-cluster bootstrap was used to esti-
mate 95% confidence intervals.
## D.  Operational Threshold Optimization
Default  thresholds  may  be  suboptimal  for  academic  advising
workflows, so this study aims to balance sensitivity against con-
## 0.50.6
## 0.70.80.91
## 0.6
## 0.8
## 1
## Recall
## F
## 1
## Prec. 0.60
## Prec. 0.70
## Prec. 0.80
## Prec. 0.7468
holdout
Fig. 6.F
## 1
of Eq. (7) as a function of recall for fixed precision values.  The red
point is the holdout operating point (recall 0.8238,F
## 1
=0.7834), which lies on
the dashed curve for precision 0.7468.
## 00.20.4
## 0.6
## 0.81
## 0
## 0.2
## 0.4
## 0.6
## 0.8
## 1
predicted probabilityp
i
## (
p
i
## −
y
i
## )
## 2
y
i
=0 (Successful)
y
i
=1 (At-Risk)
Fig. 7. Per-observation Brier loss of Eq. (11). The penalty grows quadratically
with the distance between the predicted probability and the true class; the hold-
out mean isBS=0.1638.
trol  of  false  alerts.   Following  the  experimental  protocol,  the
threshold was selected on the validation partition as
θ
## ∗
## =max{θ∈[0.10,0.90]: Recall(θ)≥0.82
∧Precision(θ)≥0.70}
## (12)
whereθis a candidate threshold on the predicted At-Risk prob-
ability. This procedure yielded an operational threshold of 0.45.
Threshold optimization was performed only on the validation
split;  the threshold was fixed before the final holdout evalua-
tion, and the holdout set was never used for threshold selection
(Fig. 8).
## VI.   RESULTS
A.  Validation Performance and Incremental Gains
The HistGradientBoostingClassifier performed best among all
classifiers on every evaluation metric on the validation partition.
Validation ROC-AUC improved by 0.1384 from S0 to S1, and
by a further 0.0833 from S1 to S2 (Fig. 9).
## B.  Primary Holdout Evaluation
The frozen primary model (Scenario S2, HistGradientBoosting-
Classifier) was evaluated on the holdout set of 4,889 observa-
tions, of which 2,582 are At-Risk (52.81%) and 2,307 are Suc-
cessful (47.19%).  The resulting confusion matrix is shown in
Fig. 10 and Table III.
The holdout metrics derived from this confusion matrix, with
95% confidence intervals, are listed in Table IV. A dash indi-

KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI6
## 0.6
## 0.70.80.91
## 0.6
## 0.7
## 0.8
## 0.9
## 1
feasible set of Eq. (12)
holdout,θ=0.45
## Recall(θ)
## Precision
## (
θ
## )
Fig.  8.   Feasible  region  of  the  threshold  rule  in  Eq.  (12):  recall≥0.82  and
precision≥0.70 (shaded). The selected operating pointθ
## ∗
=0.45 lies inside it
on the holdout set.
∆val. ROC-AUC
## 0.1384
## 0.0833
## S0→S1
## (academic)
## S1→S2
## (VLE)
Fig. 9.  Incremental validation ROC-AUC gain when early academic features
(S0→S1) and VLE clickstream features (S1→S2) are added.
cates that no confidence interval is given.
## VII.   EXPLAINABILITY ANDSUBGROUPANALYSIS
SHAP [18] was used to explain the contribution of each feature.
Shapley values were computed with a model-agnostic explainer
applied to the model’s native probability functionP(y=1|x),
using 100 stratified background observations. Attributions over
the  68  transformed  feature  dimensions  were  aggregated  back
to the 29 original raw predictors, and the attribution by feature
family is reported in Fig. 11 and Table V.
Together,  the  two  dynamic  families  (academic  and  VLE)
contributed   65.83%   of   the   total   attribution.The   four
most   important   raw   predictors   wereearly_avg_score_
d30,early_vle_active_days_d30,early_vle_total_
clicks_d30,   andhas_early_assessment_submission_
d30.   These attributions reflect observational association with
the model’s predictions and are not causal.
## A.  Descriptive Subgroup Evaluation
Fig. 12 and Table VI report performance at the operating thresh-
old of 0.45 on the holdout set.  These are descriptive subgroup
metrics, not normative fairness conclusions.  A dash (—) indi-
cates that the value is not available.
Recall was similar for women (81.79%) and men (82.85%).
Recall  for  students  with  a  declared  disability  (83.33%)  was
marginally higher than for students without one (82.26%), but
the false positive rate was higher for students with a declared
disability  (39.25%)  than  for  those  without  (30.55%).   Recall
also varied by prior attainment, from 84.13% for students with
qualifications  lower  than  A  Level  to  78.87%  for  those  with
higher education qualifications, and by socioeconomic depriva-
## TP = 2127
## FN = 455
## FP = 721
## TN = 1586
## Predicted
At-Risk
## Predicted
## Successful
## Actual
At-Risk
## Actual
## Successful
Fig. 10. Holdout confusion matrix of the primary model (S2, HGB,θ=0.45);
darker cells contain more observations.
## TABLEIII
## HOLDOUTTESTSETCONFUSIONMATRIX
Predicted At-RiskPredicted Successful
Actual At-RiskTP = 2127FN = 455
Actual SuccessfulFP = 721TN = 1586
tion, from 84.23% (most deprived) to 80.28% (least deprived).
These values do not imply that the model is fair; they only de-
scribe the behavior of the model within each subgroup.
## VIII.   ROBUSTNESS ANDSENSITIVITYANALYSIS
The primary model was re-tested under several partition seeds
(7, 21, 42, 84, and 123) to confirm that its predictive capacity
was not an artifact of a single random partition;  performance
was consistent across seeds.  A class-weighted variant changed
test ROC-AUC by only−0.0002 but reduced specificity from
68.75%  to  65.31%,  adding  157  false  positives  relative  to  the
unweighted baseline. The unweighted, native probabilities were
therefore used for all final test predictions and for the SHAP
explanations.
## IX.   DISCUSSION
The experiments indicate that academic performance and VLE
interaction data available up to Day 30 are informative for pre-
dicting the probability of an unsuccessful outcome.  Static in-
take information was less discriminative.  Adding early graded
assessments (S0 to S1) and VLE clickstream features (S1 to S2)
increased validation ROC-AUC by 0.1384 and 0.0833, respec-
tively, and the primary model (Scenario S2) reached a holdout
ROC-AUC of 0.8406. Distributed engagement (active days) and
early scores were strong contributors to the SHAP attributions,
suggesting that frequent engagement and early scores over time
are good predictors of eventual success.   Strict temporal con-
tainment and student-level grouping minimize leakage and con-
tamination.
The operational implications are as follows. Atθ=0.45, the
model identifies 82.38% of at-risk students, while flagging 721
of the 2,307 successful students in the holdout set as at-risk. The
subgroup results show that error rates are not uniform across
strata and should therefore be monitored in any deployment.
## X.   LIMITATIONS
Several limitations should be noted.   First,  OULAD does not
come  from  a traditional  campus-based  university,  so  general-

KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI7
## TABLEIV
## HOLDOUTPERFORMANCE OF THEPRIMARYMODEL
MetricValue95% CI
## ROC-AUC0.8406[0.8298–0.8512]
## PR-AUC0.8459[0.8348–0.8567]
## Accuracy75.95%[74.74–77.15]
At-Risk Recall82.38%[80.89–83.82]
At-Risk Precision74.68%[73.08–76.24]
## F1-score0.7834[0.7721–0.7944]
## Specificity68.75%[66.85–70.61]
## FPR31.25%—
## FNR17.62%—
## Brier Score0.1638[0.1565–0.1712]
## Academic Milestones33.22%
VLE Digital Engagement
## 32.61%
## Static Intake & Context34.17%
Share of aggregated SHAP attribution
Fig. 11.  SHAP attribution by feature family.  The two dynamic families (blue)
together contribute 65.83%.
izability to such settings is not established.  Second, the results
are descriptive and do not identify the causal effects of interven-
tions. Third, Fail and Withdrawn are grouped as an operational
modeling choice and are not distinguished as administrative ver-
sus academic outcomes. Fourth, the data contain no logs of in-
structor communication or other private institutional activities.
Fifth, SHAP explains what drives the model’s predictions, not
which interventions are effective.
## XI.   CONCLUSION
This  study  showed  that  the  early  academic  milestones  of  a
course and the digital behavioral traces produced on or before
Day 30 of a course presentation carry useful predictive signal
for early student performance prediction. With student-grouped
validation, the HistGradientBoostingClassifier achieved an At-
Risk Recall of 82.38% and an F1-score of 0.7834 on the holdout
set.  SHAP-based aggregated attribution showed that dynamic
academic and VLE features account for 65.83% of the model’s
attribution.    Recall  was  similar  across  gender  and  declared-
disability subgroups, but false positive rates and recall differed
across  other  strata.   Future  research  should  conduct  prospec-
tive intervention studies to measure the effect of early-warning
alerts on student retention and academic achievement.
## REFERENCES
[1]  V. Tinto,Leaving College:  Rethinking the Causes and Cures of Student
Attrition, 2nd ed. Chicago, IL, USA: Univ. Chicago Press, 1993.
[2]  S. B. Kotsiantis, C. J. Pierrakeas, and P. E. Pintelas, “Preventing student
dropout in distance learning using machine learning techniques,” inProc.
Int. Conf. Knowl.-Based Intell. Inf. Eng. Syst. (KES), 2003, pp. 267–274.
[3]  I.  Lykourentzou,  I.  Giannoukos,  V.  Nikolopoulos,  G.  Mpardis,  and  V.
Loumos,  “Dropout prediction in e-learning courses through the combi-
nation of machine learning techniques,”Comput. Educ., vol. 53, no. 3, pp.
## 950–965, 2009.
[4]  J. Kuzilek, M. Hlosta, and Z. Zdrahal, “Open University Learning Ana-
lytics dataset,”Sci. Data, vol. 4, 2017, Art. no. 170171.
[5]  K. E. Arnold and M. D. Pistilli, “Course Signals at Purdue: Using learn-
ing analytics to increase student success,” inProc. 2nd Int. Conf. Learn.
## TABLEV
## FEATUREFAMILYSHAP ATTRIBUTIONSUMMARY
Feature FamilyContribution
## Academic Milestones33.22%
VLE Digital Engagement32.61%
## Static Intake & Context34.17%
## Total100.0%
## Female
## 81.79%
## Male82.85%
No disability
## 82.26%
Declared disability
## 83.33%
Lower than A level84.13%
Higher education
## 78.87%
Most deprived
## 84.23%
Least deprived
## 80.28%
At-Risk recall; bars start at 70%
Fig. 12.   Descriptive subgroup At-Risk recall atθ=0.45 on the holdout set
(descriptive only, not a fairness claim).
Analytics Knowl. (LAK), 2012, pp. 267–270.
[6]  M. Hlosta, Z. Zdrahal, and J. Zendulka, “Ouroboros: Early identification
of at-risk students without models based on legacy data,” inProc. 7th Int.
Conf. Learn. Analytics Knowl. (LAK), 2017, pp. 6–15.
[7]  C. Herodotou, B. Rienties, A. Boroowa, Z. Zdrahal, and M. Hlosta, “A
large-scale implementation of predictive learning analytics in higher edu-
cation: The teachers’ role and perspective,”Educ. Technol. Res. Develop.,
vol. 67, no. 5, pp. 1273–1306, 2019.
[8]  C.  Herodotouet  al.,  “Empowering  online  teachers  through  predictive
learning analytics,”Brit. J. Educ. Technol., vol. 50, no. 6, pp. 3064–3079,
## 2019.
[9]  G. Siemens and P. Long, “Penetrating the fog:  Analytics in learning and
education,”EDUCAUSE Rev., vol. 46, no. 5, pp. 30–40, 2011.
[10]  R. S. Baker and P. S. Inventado, “Educational data mining and learning
analytics,” inLearning Analytics: From Research to Practice. New York,
NY, USA: Springer, 2014, pp. 61–75.
[11]  C. Romero and S. Ventura, “Educational data mining and learning analyt-
ics: An updated survey,”WIREs Data Mining Knowl. Discovery, vol. 10,
no. 3, 2020, Art. no. e1355.
[12]  L. Kemper, G. Vorhoff, and B. U. Wigger, “Predicting student dropout:
A machine learning approach,”Eur. J. Higher Educ., vol. 10, no. 1, pp.
## 28–47, 2020.
[13]  H. Waheed, S.-U. Hassan, N. R. Aljohani, J. Hardman, S. Alelyani, and
R. Nawaz, “Predicting academic performance of students from VLE big
data using deep learning models,”Comput. Hum. Behav., vol. 104, 2020,
Art. no. 106189.
[14]  S. Kaufman,  S. Rosset,  C. Perlich,  and O. Stitelman,  “Leakage in data
mining: Formulation, detection, and avoidance,”ACM Trans. Knowl. Dis-
covery Data, vol. 6, no. 4, pp. 1–21, 2012.
[15]  S. Kapoor and A. Narayanan, “Leakage and the reproducibility crisis in
machine-learning-based science,”Patterns, vol. 4, no. 9, 2023, Art. no.
## 100804.
[16]  F. Doshi-Velez and B. Kim, “Towards a rigorous science of interpretable
machine learning,” 2017,arXiv:1702.08608.
[17]  H. Khosraviet al., “Explainable artificial intelligence in education,”Com-
put. Educ., Artif. Intell., vol. 3, 2022, Art. no. 100074.
[18]  S. M. Lundberg and S.-I. Lee, “A unified approach to interpreting model
predictions,” inProc. Adv. Neural Inf. Process. Syst. (NeurIPS), vol. 30,
2017, pp. 4765–4774.
[19]  M.  Hardt,  E.  Price,  and  N.  Srebro,  “Equality  of  opportunity  in  super-
vised learning,” inProc. Adv. Neural Inf. Process. Syst. (NeurIPS), vol.
29, 2016, pp. 3315–3323.
[20]  N. Mehrabi, F. Morstatter, N. Saxena, K. Lerman, and A. Galstyan, “A
survey on bias and fairness in machine learning,”ACM Comput. Surv.,
vol. 54, no. 6, pp. 1–35, 2021.

KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI8
## TABLEVI
## DESCRIPTIVESUBGROUPEVALUATION
AttributeStratumRecallFPR
GenderFemale81.79%—
## Male82.85%—
DisabilityNo Declared Disability82.26%30.55%
## Declared Disability83.33%39.25%
Prior AttainmentLower Than A Level84.13%—
## Higher Education78.87%—
SocioeconomicMost Deprived84.23%—
## Least Deprived80.28%—
[21]  R. S. Baker and A. Hawn, “Algorithmic bias in education,”Int. J. Artif.
Intell. Educ., vol. 32, no. 4, pp. 1052–1092, 2022.
[22]  J. Gardner, C. Brooks, and R. Baker, “Evaluating the fairness of predictive
student models through slicing analysis,”  inProc. 9th Int. Conf. Learn.
Analytics Knowl. (LAK), 2019, pp. 226–235.
[23]  C. Romero and S. Ventura,  “Educational data mining:  A review of the
state of the art,”IEEE Trans. Syst., Man, Cybern. C, Appl. Rev., vol. 40,
no. 6, pp. 601–618, Nov. 2010.
[24]  L. Breiman,  “Random forests,”Mach. Learn.,  vol. 45,  no. 1,  pp. 5–32,
## 2001.
[25]  J.  H.  Friedman,  “Greedy  function  approximation:  A  gradient  boosting
machine,”Ann. Statist., vol. 29, no. 5, pp. 1189–1232, 2001.
[26]  G. Keet al., “LightGBM: A highly efficient gradient boosting decision
tree,” inProc. Adv. Neural Inf. Process. Syst. (NeurIPS), 2017, pp. 3146–
## 3154.
[27]  F. Pedregosaet al., “Scikit-learn: Machine learning in Python,”J. Mach.
Learn. Res., vol. 12, pp. 2825–2830, 2011.
[28]  G. W. Brier, “Verification of forecasts expressed in terms of probability,”
Monthly Weather Rev., vol. 78, no. 1, pp. 1–3, 1950.
[29]  A. Niculescu-Mizil and R. Caruana, “Predicting good probabilities with
supervised learning,” inProc. 22nd Int. Conf. Mach. Learn. (ICML), 2005,
pp. 625–632.
[30]  J. C. Platt, “Probabilistic outputs for support vector machines and com-
parisons to regularized likelihood methods,” inAdvances in Large Margin
Classifiers. Cambridge, MA, USA: MIT Press, 1999, pp. 61–74.

## CLICKABLE REFERENCE LINKS
Click the blue link under any reference to open the paper (DOI, arXiv, or publisher page).
[1] V. Tinto, Leaving College: Rethinking the Causes and Cures of Student Attrition, 2nd ed. Univ. Chicago Press, 1993.
https://scholar.google.com/scholar?q=Tinto%20Leaving%20College%3A%20Rethinking%20the%20Cause... (Google Scholar
search)
[2] S. B. Kotsiantis, C. J. Pierrakeas, and P. E. Pintelas, "Preventing student dropout in distance learning using machine learning
techniques," KES, 2003.
https://doi.org/10.1007/978-3-540-45226-3_37
[3] I. Lykourentzou et al., "Dropout prediction in e-learning courses through the combination of machine learning techniques,"
## Comput. Educ., 2009.
https://doi.org/10.1016/j.compedu.2009.05.010
[4] J. Kuzilek, M. Hlosta, and Z. Zdrahal, "Open University Learning Analytics dataset," Sci. Data, 2017.
https://doi.org/10.1038/sdata.2017.171
[5] K. E. Arnold and M. D. Pistilli, "Course Signals at Purdue: Using learning analytics to increase student success," LAK, 2012.
https://doi.org/10.1145/2330601.2330666
[6] M. Hlosta, Z. Zdrahal, and J. Zendulka, "Ouroboros: Early identification of at-risk students without models based on legacy
data," LAK, 2017.
https://doi.org/10.1145/3027385.3027449
[7] C. Herodotou et al., "A large-scale implementation of predictive learning analytics in higher education: The teachers' role and
perspective," Educ. Technol. Res. Develop., 2019.
https://doi.org/10.1007/s11423-019-09685-0
[8] C. Herodotou et al., "Empowering online teachers through predictive learning analytics," Brit. J. Educ. Technol., 2019.
https://doi.org/10.1111/bjet.12853
[9] G. Siemens and P. Long, "Penetrating the fog: Analytics in learning and education," EDUCAUSE Rev., 2011.
https://er.educause.edu/articles/2011/9/penetrating-the-fog-analytics-in-learning-and-educat...
[10] R. S. Baker and P. S. Inventado, "Educational data mining and learning analytics," in Learning Analytics, Springer, 2014.
https://doi.org/10.1007/978-1-4614-3305-7_4
[11] C. Romero and S. Ventura, "Educational data mining and learning analytics: An updated survey," WIREs Data Mining
## Knowl. Discovery, 2020.
https://doi.org/10.1002/widm.1355
[12] L. Kemper, G. Vorhoff, and B. U. Wigger, "Predicting student dropout: A machine learning approach," Eur. J. Higher
## Educ., 2020.
https://doi.org/10.1080/21568235.2020.1718520
[13] H. Waheed et al., "Predicting academic performance of students from VLE big data using deep learning models," Comput.
## Hum. Behav., 2020.
https://doi.org/10.1016/j.chb.2019.106189
[14] S. Kaufman, S. Rosset, C. Perlich, and O. Stitelman, "Leakage in data mining: Formulation, detection, and avoidance," ACM
## TKDD, 2012.
https://doi.org/10.1145/2382577.2382579
[15] S. Kapoor and A. Narayanan, "Leakage and the reproducibility crisis in machine-learning-based science," Patterns, 2023.
https://doi.org/10.1016/j.patter.2023.100804
[16] F. Doshi-Velez and B. Kim, "Towards a rigorous science of interpretable machine learning," arXiv:1702.08608, 2017.
https://arxiv.org/abs/1702.08608
[17] H. Khosravi et al., "Explainable artificial intelligence in education," Comput. Educ., Artif. Intell., 2022.
https://doi.org/10.1016/j.caeai.2022.100074
[18] S. M. Lundberg and S.-I. Lee, "A unified approach to interpreting model predictions," NeurIPS, 2017.
https://arxiv.org/abs/1705.07874
[19] M. Hardt, E. Price, and N. Srebro, "Equality of opportunity in supervised learning," NeurIPS, 2016.

https://arxiv.org/abs/1610.02413
[20] N. Mehrabi et al., "A survey on bias and fairness in machine learning," ACM Comput. Surv., 2021.
https://doi.org/10.1145/3457607
[21] R. S. Baker and A. Hawn, "Algorithmic bias in education," Int. J. Artif. Intell. Educ., 2022.
https://doi.org/10.1007/s40593-021-00285-9
[22] J. Gardner, C. Brooks, and R. Baker, "Evaluating the fairness of predictive student models through slicing analysis," LAK,
## 2019.
https://doi.org/10.1145/3303772.3303791
[23] C. Romero and S. Ventura, "Educational data mining: A review of the state of the art," IEEE Trans. SMC-C, 2010.
https://doi.org/10.1109/TSMCC.2010.2053532
[24] L. Breiman, "Random forests," Mach. Learn., 2001.
https://doi.org/10.1023/A:1010933404324
[25] J. H. Friedman, "Greedy function approximation: A gradient boosting machine," Ann. Statist., 2001.
https://doi.org/10.1214/aos/1013203451
[26] G. Ke et al., "LightGBM: A highly efficient gradient boosting decision tree," NeurIPS, 2017.
https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html
[27] F. Pedregosa et al., "Scikit-learn: Machine learning in Python," J. Mach. Learn. Res., 2011.
https://jmlr.org/papers/v12/pedregosa11a.html
[28] G. W. Brier, "Verification of forecasts expressed in terms of probability," Monthly Weather Rev., 1950.
https://doi.org/10.1175/1520-0493(1950)078<0001:VOFEIT>2.0.CO;2
[29] A. Niculescu-Mizil and R. Caruana, "Predicting good probabilities with supervised learning," ICML, 2005.
https://doi.org/10.1145/1102351.1102430
[30] J. C. Platt, "Probabilistic outputs for support vector machines and comparisons to regularized likelihood methods," 1999.
https://scholar.google.com/scholar?q=Platt%20Probabilistic%20outputs%20for%20support%20vecto... (Google Scholar search)