# PAPER CHANGELOG

**Document**: `paper/FINAL_MANUSCRIPT_TEXT.md` and `paper/Student_Performance_Prediction_OULAD_IEEE.docx`  
**Audit Baseline**: Legacy Preliminary Draft vs. Real Pipeline Output (`run_master_pipeline.py`)  
**Guiding Principle**: The real computed pipeline is the sole ground truth. Zero hand-tuning or post-processing to match old values.

---

## 1. Summary of Updated Claims & Numbers

| Location in Paper | Old Text / Value | New Text / Value | Source File in `results/` |
| :--- | :--- | :--- | :--- |
| **Abstract, Section VII-A** | Train: 22,815 / Val: 4,889 / Test: 4,889 | **Train: 22,859 (70.13%) / Val: 4,875 (14.96%) / Test: 4,859 (14.91%)** | `results/splits/student_partition_assignment.csv` |
| **Abstract, Overview, Sec X** | Operational threshold $\theta^* = 0.45$ | **Operational threshold $\theta^* = 0.35$ (Validation Max-$F_1$ Point)** | `results/metrics/selected_threshold.json` |
| **Abstract, Sec XI-C, Table I** | Test ROC-AUC: $0.8406$ [0.8298, 0.8512] | **Test ROC-AUC: $0.8487$ [0.8380, 0.8593]** | `results/tables/Table_XVIII_final_test_results.md` |
| **Abstract, Sec XI-C, Table I** | Test PR-AUC: $0.8459$ [0.8348, 0.8567] | **Test PR-AUC: $0.8815$ [0.8715, 0.8919]** | `results/tables/Table_XVIII_final_test_results.md` |
| **Abstract, Sec XI-C, Table I** | Test Accuracy: $75.95\%$ [$74.74\%, 77.15\%$] | **Test Accuracy: $73.86\%$ [$72.61\%, 75.12\%$]** | `results/tables/Table_XVIII_final_test_results.md` |
| **Abstract, Sec XI-C, Table I** | At-Risk Recall: $82.38\%$ [$80.89\%, 83.82\%$] | **At-Risk Recall: $85.25\%$ [$83.84\%, 86.55\%$]** | `results/tables/Table_XVIII_final_test_results.md` |
| **Abstract, Sec XI-C, Table I** | At-Risk Precision: $74.68\%$ [$73.08\%, 76.24\%$] | **At-Risk Precision: $71.01\%$ [$69.34\%, 72.68\%$]** | `results/tables/Table_XVIII_final_test_results.md` |
| **Abstract, Sec XI-C, Table I** | At-Risk $F_1$: $0.7834$ [$0.7721, 0.7944$] | **At-Risk $F_1$: $0.7748$ [$0.7619, 0.7872$]** | `results/tables/Table_XVIII_final_test_results.md` |
| **Abstract, Sec XI-C, Table I** | Test Specificity: $68.75\%$ [$66.85\%, 70.61\%$] | **Test Specificity: $61.15\%$ [$59.13\%, 63.19\%$]** | `results/tables/Table_XVIII_final_test_results.md` |
| **Abstract, Sec XI-C, Table I** | Brier Calibration Score: $0.1638$ | **Brier Calibration Score: $0.1565$ [$0.1511, 0.1619$]** | `results/tables/Table_XVIII_final_test_results.md` |
| **Section XI-C, Confusion Matrix** | TP=2,127, FN=455, TN=1,586, FP=721 | **TP=2,185, FN=378, TN=1,404, FP=892** | `results/tables/Table_XIX_test_confusion_matrix.csv` |
| **Section X, Discussion** | "identifies 46 additional students ... FN 501 to 455 ... 58 false alarms" | **Identifies 324 additional students ($2,185$ vs $1,861$), reducing FN from 702 to 378, with 892 false alarms (FP)** | `results/tables/Table_XVIII_final_test_results.md` |
| **Abstract, Sec XI-B, Table II** | Validation $S_0 \rightarrow S_1 \rightarrow S_2$ ROC-AUC: $0.6208 \rightarrow 0.7592 \rightarrow 0.8425$ | **Validation $S_0 \rightarrow S_1 \rightarrow S_2$ ROC-AUC: $0.6677 \rightarrow 0.8234 \rightarrow 0.8500$** | `results/tables/Table_XV_model_comparison.md` |
| **Abstract, Sec XI-D, Table III** | Combined Academic + VLE SHAP share: $65.83\%$ | **Combined Academic + VLE SHAP share: $58.84\%$ (Academic: $32.88\%$, VLE: $25.96\%$)** | `results/tables/Table_XXII_shap_raw_feature_group_importance.md` |
| **Abstract, Sec XI-D** | Top Predictor: `early_avg_score_d30` (0.4285) | **Top Predictors: `code_module` ($18.85\%$), `early_assessments_submitted_d30` ($16.60\%$)** | `results/tables/Table_XXII_shap_raw_feature_group_importance.md` |
| **Abstract, Sec XI-E, Table IV** | Subgroup sensitivity: Female $81.79\%$, Male $82.85\%$ | **Subgroup sensitivity: Female $84.23\%$, Male $86.12\%$** | `results/tables/Table_XXV_subgroup_performance_metrics.md` |
| **Abstract, Sec XI-E, Table IV** | Subgroup sensitivity: Disability $83.33\%$, Non-Disability $82.26\%$ | **Subgroup sensitivity: Disability $89.10\%$, Non-Disability $84.72\%$** | `results/tables/Table_XXV_subgroup_performance_metrics.md` |
| **Abstract, Sec XI-E, Table IV** | Claimed "~81-83% stable recall across subgroups" | **Min-Max Range: 55.26% (AAA) / 78.57% (HE) to 93.90% (1 prev attempt)** | `results/tables/Table_XXV_subgroup_performance_metrics.md` |
| **Section VIII-2, Methods** | Random Forest `min_samples_leaf = 10` | **Random Forest `min_samples_leaf = 5`** | `results/tables/hyperparameter_search_results.csv` |
| **Section XI-F3, Robustness** | Class-weight false-positive difference: "+157" | **Class-weight false-positive difference: -113 ($902 \rightarrow 789$)** | `results/tables/Table_XXXI_class_weight_sensitivity.md` |
| **Section I, Introduction** | "non-completion frequently exceeding 40% [1], [2]" | **"non-completion frequently reaching substantial levels in large-scale distance education environments [1], [2]"** | Softened per requirement D3 |
| **Section XIII, Limitations** | Added missing methodological constraints | **Added: Single primary partition (seed 42), threshold selected on validation set, subgroup precision/FPR disparities** | Requirement D3 |
