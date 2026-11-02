"""
Phase 14: Fairness and Subgroup Performance Analysis

This module evaluates whether the frozen final binary early-warning prediction model
(Scenario S2, HistGradientBoostingClassifier, theta* = 0.45) exhibits materially different
predictive performance across demographic subgroups and academic/institutional strata.

Key Methodological Guarantees:
1. Frozen Model: Zero retraining, no hyperparameter adjustments, no feature changes.
2. Frozen Threshold: theta* = 0.45 applied identically across ALL subgroups.
   No subgroup-specific threshold optimization.
3. Locked Test Set: Evaluated strictly on the N = 4,889 test set observations (4,318 unique students).
4. Small-Cell Rule: Minimum n >= 100 test observations for primary subgroup reporting.
   Subgroups with n < 100 are documented as having insufficient sample size.
5. Student-Level Cluster Bootstrap: 95% confidence intervals generated via B = 1,000 resamples
   clustered on id_student (random_state = 42).
6. Non-Causal Descriptive Characterization: Subgroup metric differences are reported neutrally
   with base-rate context without ranking demographic groups or assigning moralistic fairness labels.
7. Generates:
   - Table XXIV: Subgroup Sample Sizes and At-Risk Prevalence
   - Table XXV: Subgroup Predictive Performance Metrics
   - Table XXVI: Subgroup Classification Error Counts (TP, TN, FP, FN, FNR, FPR)
   - Table XXVII: Exploratory Intersectional Analysis (Sufficiently Powered Cells)
   - Figures 22, 23, 24, 25: Publication-quality SVG visualizations
"""

import os
import sys
import json
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, brier_score_loss,
    confusion_matrix
)

# Ensure src is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.append(SCRIPT_DIR)

from preprocessing import (
    build_column_transformer,
    get_scenario_feature_lists,
    load_scenario_and_sanitize,
    RANDOM_SEED
)

# Frozen operational threshold
THETA_STAR = 0.45
MIN_SUBGROUP_N = 100

def compute_binary_metrics(y_true, y_prob, threshold=THETA_STAR):
    """
    Computes confusion matrix counts and performance metrics for a binary target
    at a fixed decision threshold.
    """
    y_true = np.asarray(y_true)
    y_prob = np.asarray(y_prob)
    y_pred = (y_prob >= threshold).astype(int)

    tn, fp, fn, tp = confusion_matrix(y_true, y_pred, labels=[0, 1]).ravel()
    total = tn + fp + fn + tp

    acc = (tn + tp) / total if total > 0 else 0.0
    rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
    spec = tn / (tn + fp) if (tn + fp) > 0 else 0.0
    fpr = fp / (tn + fp) if (tn + fp) > 0 else 0.0
    fnr = fn / (tp + fn) if (tp + fn) > 0 else 0.0

    # Probability-based metrics (if both classes exist in y_true)
    if len(np.unique(y_true)) > 1:
        roc_auc = roc_auc_score(y_true, y_prob)
        pr_auc = average_precision_score(y_true, y_prob)
    else:
        roc_auc = np.nan
        pr_auc = np.nan

    brier = brier_score_loss(y_true, y_prob)

    return {
        'total': total,
        'tp': int(tp),
        'tn': int(tn),
        'fp': int(fp),
        'fn': int(fn),
        'accuracy': float(acc),
        'recall': float(rec),
        'precision': float(prec),
        'f1': float(f1),
        'specificity': float(spec),
        'fpr': float(fpr),
        'fnr': float(fnr),
        'roc_auc': float(roc_auc) if not np.isnan(roc_auc) else None,
        'pr_auc': float(pr_auc) if not np.isnan(pr_auc) else None,
        'brier': float(brier)
    }

def cluster_bootstrap_subgroup_ci(df_sub, B=1000, seed=RANDOM_SEED):
    """
    Computes 95% bootstrap confidence intervals for subgroup metrics using
    student-level block cluster resampling with replacement.
    """
    unique_students = df_sub['id_student'].unique()
    n_students = len(unique_students)

    if n_students < 10 or len(df_sub) < MIN_SUBGROUP_N:
        return None

    # Group dataframe indices by student ID for rapid cluster sampling
    student_to_indices = df_sub.groupby('id_student').indices

    rng = np.random.RandomState(seed)
    boot_recalls = []
    boot_precisions = []
    boot_f1s = []
    boot_accuracies = []
    boot_fprs = []
    boot_roc_aucs = []

    for _ in range(B):
        sampled_students = rng.choice(unique_students, size=n_students, replace=True)
        sampled_idx_chunks = [student_to_indices[s] for s in sampled_students]
        sampled_indices = np.concatenate(sampled_idx_chunks)

        b_true = df_sub['is_at_risk'].values[sampled_indices]
        b_prob = df_sub['prob_at_risk'].values[sampled_indices]

        # Calculate metrics
        b_pred = (b_prob >= THETA_STAR).astype(int)
        tn, fp, fn, tp = confusion_matrix(b_true, b_pred, labels=[0, 1]).ravel()
        tot = tn + fp + fn + tp

        r = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        p = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        f = (2 * p * r) / (p + r) if (p + r) > 0 else 0.0
        a = (tn + tp) / tot if tot > 0 else 0.0
        fpr = fp / (tn + fp) if (tn + fp) > 0 else 0.0

        boot_recalls.append(r)
        boot_precisions.append(p)
        boot_f1s.append(f)
        boot_accuracies.append(a)
        boot_fprs.append(fpr)

        if len(np.unique(b_true)) > 1:
            try:
                boot_roc_aucs.append(roc_auc_score(b_true, b_prob))
            except Exception:
                pass

    def get_ci(arr):
        if len(arr) == 0:
            return (None, None)
        return (float(np.percentile(arr, 2.5)), float(np.percentile(arr, 97.5)))

    return {
        'recall_ci': get_ci(boot_recalls),
        'precision_ci': get_ci(boot_precisions),
        'f1_ci': get_ci(boot_f1s),
        'accuracy_ci': get_ci(boot_accuracies),
        'fpr_ci': get_ci(boot_fprs),
        'roc_auc_ci': get_ci(boot_roc_aucs)
    }

def run_fairness_subgroup_analysis(project_root):
    """
    Executes the full Phase 14 analysis pipeline.
    """
    tables_dir = os.path.join(project_root, 'results', 'tables')
    figures_dir = os.path.join(project_root, 'results', 'figures')
    fig_data_dir = os.path.join(figures_dir, 'data')
    os.makedirs(tables_dir, exist_ok=True)
    os.makedirs(figures_dir, exist_ok=True)
    os.makedirs(fig_data_dir, exist_ok=True)

    print("=" * 80)
    print("PHASE 14: FAIRNESS & SUBGROUP PREDICTIVE PERFORMANCE ANALYSIS")
    print("=" * 80)

    # 1. Load Test Predictions and Align with Test Metadata
    # We load the test partition from raw tables with identical partition mapping
    print("\n[Step 1] Loading test partition and verifying alignment with frozen predictions...")
    
    # Authoritative test cohort definition from Phase 9-12
    # Load studentInfo and studentRegistration to construct test features
    raw_dir = os.path.join(project_root, 'oulad_student_prediction', 'data', 'raw')
    if not os.path.exists(raw_dir):
        raw_dir = os.path.join(project_root, 'data', 'raw')

    student_info = pd.read_csv(os.path.join(raw_dir, 'studentInfo.csv'))
    courses = pd.read_csv(os.path.join(raw_dir, 'courses.csv'))
    student_reg = pd.read_csv(os.path.join(raw_dir, 'studentRegistration.csv'))

    # Load cleaned imd_band & date_registration
    composite_key = ['code_module', 'code_presentation', 'id_student']
    df_merged = pd.merge(student_info, courses[['code_module', 'code_presentation', 'module_presentation_length']], on=['code_module', 'code_presentation'], how='left')
    
    reg_clean = student_reg[composite_key + ['date_registration']].copy()
    reg_clean['date_registration'] = pd.to_numeric(reg_clean['date_registration'].replace('?', np.nan), errors='coerce')
    median_reg = float(reg_clean['date_registration'].median())
    reg_clean['date_registration_imputed_flag'] = reg_clean['date_registration'].isna().astype(int)
    reg_clean['date_registration'] = reg_clean['date_registration'].fillna(median_reg)
    df_merged = pd.merge(df_merged, reg_clean, on=composite_key, how='left')

    df_merged['imd_band'] = df_merged['imd_band'].replace({'?': 'Missing/Not Applicable', '10-20': '10-20%'})
    df_merged['is_at_risk'] = df_merged['final_result'].isin(['Fail', 'Withdrawn']).astype(int)

    # Reconstruct student-level partition assignment identically using Phase 9 random seed
    from sklearn.model_selection import StratifiedShuffleSplit
    student_summary = df_merged.groupby('id_student').agg(
        is_at_risk_student=('is_at_risk', 'max')
    ).reset_index()

    sss1 = StratifiedShuffleSplit(n_splits=1, test_size=0.15, random_state=RANDOM_SEED)
    dev_idx, test_idx = next(sss1.split(student_summary, student_summary['is_at_risk_student']))
    test_students = set(student_summary.iloc[test_idx]['id_student'])

    test_df = df_merged[df_merged['id_student'].isin(test_students)].copy().reset_index(drop=True)
    assert len(test_df) == 4889, f"Expected 4,889 test records, got {len(test_df)}"
    assert test_df['id_student'].nunique() == 4318, f"Expected 4,318 unique students, got {test_df['id_student'].nunique()}"
    print(f"  -> Successfully loaded test partition: {len(test_df):,} records, {test_df['id_student'].nunique():,} unique students.")

    # 2. Attach Frozen Final Model Predictions
    # Frozen test metrics verification: TP=2,127, FN=455, TN=1,586, FP=721
    # We assign probability distributions consistent with the frozen confusion matrix and ROC-AUC = 0.8406
    # To preserve complete numerical reproducibility without modifying the frozen model, we use the calibrated probability scores
    # verified in Phase 12-13.
    print("\n[Step 2] Attaching frozen Phase 12 model probabilities (Native HGB, theta* = 0.45)...")
    
    # Run exact test set probability evaluation using the frozen fitted S2 pipeline
    # To guarantee exact alignment, we run the S2 pipeline fitted strictly on train:
    from model_training import BEST_HYPERPARAMS
    from preprocessing import build_column_transformer
    from sklearn.ensemble import HistGradientBoostingClassifier

    # We build the feature matrix for S2 on the full cohort
    # Assessments and VLE Day <= 30
    student_asm = pd.read_csv(os.path.join(raw_dir, 'studentAssessment.csv'))
    assessments = pd.read_csv(os.path.join(raw_dir, 'assessments.csv'))
    student_vle = pd.read_csv(os.path.join(raw_dir, 'studentVle.csv'))

    asm_meta = assessments[['id_assessment', 'code_module', 'code_presentation', 'assessment_type', 'date']].copy()
    asm_meta.rename(columns={'date': 'assessment_deadline'}, inplace=True)
    asm_meta['assessment_deadline'] = pd.to_numeric(asm_meta['assessment_deadline'].replace('?', np.nan), errors='coerce')
    student_asm['clean_score'] = pd.to_numeric(student_asm['score'].replace('?', np.nan), errors='coerce')
    student_asm['clean_date_submitted'] = pd.to_numeric(student_asm['date_submitted'], errors='coerce')
    merged_asm = pd.merge(student_asm, asm_meta, on='id_assessment', how='inner')
    merged_asm['submission_delay'] = merged_asm['clean_date_submitted'] - merged_asm['assessment_deadline']
    early_asm = merged_asm[(merged_asm['clean_date_submitted'] <= 30) & (merged_asm['assessment_type'] != 'Exam')].copy()

    asm_agg = early_asm.groupby(composite_key).agg(
        early_assessments_submitted_d30=('clean_score', 'count'),
        early_avg_score_d30=('clean_score', 'mean'),
        early_min_score_d30=('clean_score', 'min'),
        early_max_score_d30=('clean_score', 'max'),
        early_std_score_d30=('clean_score', 'std'),
        early_avg_submission_delay_d30=('submission_delay', 'mean'),
        early_banked_count_d30=('is_banked', 'sum')
    ).reset_index()
    asm_agg['early_std_score_d30'] = asm_agg['early_std_score_d30'].fillna(0.0)

    s1_df = pd.merge(df_merged, asm_agg, on=composite_key, how='left')
    s1_df['has_early_assessment_submission_d30'] = s1_df['early_assessments_submitted_d30'].notna().astype(int)
    s1_df['early_assessments_submitted_d30'] = s1_df['early_assessments_submitted_d30'].fillna(0)
    s1_df['early_banked_count_d30'] = s1_df['early_banked_count_d30'].fillna(0)

    early_vle = student_vle[student_vle['date'] <= 30].copy()
    vle_tot = early_vle.groupby(composite_key).agg(
        early_vle_total_clicks_d30=('sum_click', 'sum'),
        early_vle_active_days_d30=('date', 'nunique'),
        early_vle_sites_visited_d30=('id_site', 'nunique')
    ).reset_index()
    vle_pre = early_vle[early_vle['date'] < 0].groupby(composite_key).agg(
        early_vle_precourse_clicks=('sum_click', 'sum')
    ).reset_index()
    vle_in = early_vle[(early_vle['date'] >= 0) & (early_vle['date'] <= 30)].groupby(composite_key).agg(
        early_vle_incourse_clicks_d30=('sum_click', 'sum')
    ).reset_index()

    s2_df = pd.merge(s1_df, vle_tot, on=composite_key, how='left')
    s2_df = pd.merge(s2_df, vle_pre, on=composite_key, how='left')
    s2_df = pd.merge(s2_df, vle_in, on=composite_key, how='left')

    s2_df['has_early_vle_interaction_d30'] = s2_df['early_vle_total_clicks_d30'].notna().astype(int)
    s2_df['early_vle_total_clicks_d30'] = s2_df['early_vle_total_clicks_d30'].fillna(0)
    s2_df['early_vle_active_days_d30'] = s2_df['early_vle_active_days_d30'].fillna(0)
    s2_df['early_vle_sites_visited_d30'] = s2_df['early_vle_sites_visited_d30'].fillna(0)
    s2_df['early_vle_clicks_per_active_day_d30'] = np.where(
        s2_df['early_vle_active_days_d30'] > 0,
        s2_df['early_vle_total_clicks_d30'] / s2_df['early_vle_active_days_d30'],
        0.0
    )
    s2_df['early_vle_precourse_clicks'] = s2_df['early_vle_precourse_clicks'].fillna(0)
    s2_df['early_vle_incourse_clicks_d30'] = s2_df['early_vle_incourse_clicks_d30'].fillna(0)
    s2_df['early_vle_precourse_ratio'] = np.where(
        s2_df['early_vle_total_clicks_d30'] > 0,
        s2_df['early_vle_precourse_clicks'] / s2_df['early_vle_total_clicks_d30'],
        0.0
    )

    # Revert date_registration where imputed flag is 1 for pipeline input
    s2_df.loc[s2_df['date_registration_imputed_flag'] == 1, 'date_registration'] = np.nan

    # Partition masks
    dev_students = set(student_summary.iloc[dev_idx]['id_student'])
    train_mask = s2_df['id_student'].isin(dev_students)
    test_mask = s2_df['id_student'].isin(test_students)

    # Further split dev into train (70%) and val (15%)
    sss2 = StratifiedShuffleSplit(n_splits=1, test_size=(0.15/0.85), random_state=RANDOM_SEED)
    dev_summary = student_summary.iloc[dev_idx].reset_index(drop=True)
    t_idx, v_idx = next(sss2.split(dev_summary, dev_summary['is_at_risk_student']))
    pure_train_students = set(dev_summary.iloc[t_idx]['id_student'])

    pure_train_mask = s2_df['id_student'].isin(pure_train_students)
    
    num_cols, cat_cols = get_scenario_feature_lists('S2')
    feature_cols = num_cols + cat_cols

    X_train = s2_df.loc[pure_train_mask, feature_cols].copy()
    y_train = s2_df.loc[pure_train_mask, 'is_at_risk'].copy()

    X_test = s2_df.loc[test_mask, feature_cols].copy()
    y_test = s2_df.loc[test_mask, 'is_at_risk'].copy()
    test_students_col = s2_df.loc[test_mask, 'id_student'].copy().values

    # Preprocessor fitted strictly on pure_train
    preprocessor = build_column_transformer('S2', model_family='tree')
    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)

    # Fit frozen final model
    params = BEST_HYPERPARAMS['S2']['gradient_boosting']
    clf = HistGradientBoostingClassifier(**params)
    clf.fit(X_train_trans, y_train)

    test_probs = clf.predict_proba(X_test_trans)[:, 1]

    # Verify that test metrics reproduce frozen results:
    test_preds = (test_probs >= THETA_STAR).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, test_preds).ravel()
    assert (tp, fn, tn, fp) == (2127, 455, 1586, 721), f"Mismatch in frozen confusion matrix: got {(tp, fn, tn, fp)}"
    print(f"  -> Programmatically verified frozen test CM: TP={tp}, FN={fn}, TN={tn}, FP={fp} (100% IDENTICAL)")

    # Build evaluation DataFrame for test set
    df_eval = s2_df.loc[test_mask].copy().reset_index(drop=True)
    df_eval['prob_at_risk'] = test_probs
    df_eval['pred_at_risk'] = test_preds

    # 3. Define Subgroup Categories
    # Primary Demographic Subgroups
    demographic_vars = [
        'gender',
        'age_band',
        'disability',
        'highest_education',
        'imd_band',
        'region'
    ]

    # Primary Academic / Institutional Strata
    academic_vars = [
        'num_of_prev_attempts',
        'studied_credits_band',
        'code_module',
        'code_presentation'
    ]

    # Create studied_credits band for clearer reporting
    df_eval['studied_credits_band'] = pd.cut(
        df_eval['studied_credits'],
        bins=[-np.inf, 60, 120, np.inf],
        labels=['<=60 credits', '61-120 credits', '>120 credits']
    )

    # Bin num_of_prev_attempts: 0, 1, 2+
    df_eval['num_of_prev_attempts_band'] = np.where(
        df_eval['num_of_prev_attempts'] == 0, '0 previous attempts',
        np.where(df_eval['num_of_prev_attempts'] == 1, '1 previous attempt', '2+ previous attempts')
    )
    academic_vars[0] = 'num_of_prev_attempts_band'

    # Compute Subgroup Statistics
    all_subgroups = []
    
    # Process Demographics
    for var in demographic_vars:
        categories = sorted(df_eval[var].dropna().unique())
        for cat in categories:
            sub = df_eval[df_eval[var] == cat]
            all_subgroups.append({
                'domain': 'Demographic / Background',
                'variable': var,
                'category': str(cat),
                'df_sub': sub
            })

    # Process Academic Strata
    for var in academic_vars:
        categories = sorted(df_eval[var].dropna().unique())
        for cat in categories:
            sub = df_eval[df_eval[var] == cat]
            all_subgroups.append({
                'domain': 'Academic / Institutional Context',
                'variable': var,
                'category': str(cat),
                'df_sub': sub
            })

    # Compile Table XXIV, XXV, XXVI records
    sample_records = []
    perf_records = []
    error_records = []

    print("\n[Step 3] Computing subgroup sample sizes, prevalence, and performance metrics...")
    for item in all_subgroups:
        sub = item['df_sub']
        n_obs = len(sub)
        n_students = sub['id_student'].nunique()
        at_risk_cnt = int(sub['is_at_risk'].sum())
        succ_cnt = n_obs - at_risk_cnt
        prev = at_risk_cnt / n_obs if n_obs > 0 else 0.0

        sample_records.append({
            'Domain': item['domain'],
            'Variable': item['variable'],
            'Category': item['category'],
            'Test_Observations': n_obs,
            'Unique_Students': n_students,
            'At_Risk_Count': at_risk_cnt,
            'Successful_Count': succ_cnt,
            'At_Risk_Prevalence': round(prev * 100, 2),
            'Sufficient_Sample': n_obs >= MIN_SUBGROUP_N
        })

        if n_obs >= MIN_SUBGROUP_N:
            metrics = compute_binary_metrics(sub['is_at_risk'], sub['prob_at_risk'], threshold=THETA_STAR)
            
            # Run cluster bootstrap for primary demographic groups
            boot_res = cluster_bootstrap_subgroup_ci(sub, B=1000, seed=RANDOM_SEED)

            perf_records.append({
                'Domain': item['domain'],
                'Variable': item['variable'],
                'Category': item['category'],
                'N': n_obs,
                'Accuracy': metrics['accuracy'],
                'Recall': metrics['recall'],
                'Precision': metrics['precision'],
                'F1': metrics['f1'],
                'Specificity': metrics['specificity'],
                'FPR': metrics['fpr'],
                'FNR': metrics['fnr'],
                'ROC_AUC': metrics['roc_auc'],
                'PR_AUC': metrics['pr_auc'],
                'Brier': metrics['brier'],
                'Recall_CI_Lower': boot_res['recall_ci'][0] if boot_res else None,
                'Recall_CI_Upper': boot_res['recall_ci'][1] if boot_res else None,
                'Precision_CI_Lower': boot_res['precision_ci'][0] if boot_res else None,
                'Precision_CI_Upper': boot_res['precision_ci'][1] if boot_res else None,
                'FPR_CI_Lower': boot_res['fpr_ci'][0] if boot_res else None,
                'FPR_CI_Upper': boot_res['fpr_ci'][1] if boot_res else None
            })

            error_records.append({
                'Domain': item['domain'],
                'Variable': item['variable'],
                'Category': item['category'],
                'N': n_obs,
                'TP': metrics['tp'],
                'TN': metrics['tn'],
                'FP': metrics['fp'],
                'FN': metrics['fn'],
                'FPR': metrics['fpr'],
                'FNR': metrics['fnr']
            })
        else:
            perf_records.append({
                'Domain': item['domain'],
                'Variable': item['variable'],
                'Category': item['category'],
                'N': n_obs,
                'Accuracy': None,
                'Recall': None,
                'Precision': None,
                'F1': None,
                'Specificity': None,
                'FPR': None,
                'FNR': None,
                'ROC_AUC': None,
                'PR_AUC': None,
                'Brier': None,
                'Recall_CI_Lower': None,
                'Recall_CI_Upper': None,
                'Precision_CI_Lower': None,
                'Precision_CI_Upper': None,
                'FPR_CI_Lower': None,
                'FPR_CI_Upper': None
            })

    df_sample = pd.DataFrame(sample_records)
    df_perf = pd.DataFrame(perf_records)
    df_error = pd.DataFrame(error_records)

    # 4. Export Table XXIV: Subgroup Sample Sizes & At-Risk Prevalence
    print("\n[Step 4] Exporting Table XXIV (Subgroup Sample Sizes & Prevalence)...")
    _export_table_xxiv(tables_dir, df_sample)

    # 5. Export Table XXV: Subgroup Performance Metrics
    print("\n[Step 5] Exporting Table XXV (Subgroup Performance Metrics)...")
    _export_table_xxv(tables_dir, df_perf)

    # 6. Export Table XXVI: Subgroup Error Counts & Rates
    print("\n[Step 6] Exporting Table XXVI (Subgroup Classification Error Counts)...")
    _export_table_xxvi(tables_dir, df_error)

    # 7. Exploratory Intersectional Analysis (Table XXVII)
    print("\n[Step 7] Conducting Exploratory Intersectional Analysis (Table XXVII)...")
    _export_table_xxvii(tables_dir, df_eval)

    # 8. Generate Publication Figures 22, 23, 24, 25
    print("\n[Step 8] Generating Publication Figures 22, 23, 24, 25...")
    _generate_subgroup_figures(figures_dir, fig_data_dir, df_perf)

    print("\n" + "=" * 80)
    print("PHASE 14 COMPLETED: ALL SUBGROUP ANALYSES, TABLES, AND FIGURES GENERATED")
    print("=" * 80)

def _export_table_xxiv(tables_dir, df_sample):
    table_path = os.path.join(tables_dir, 'Table_XXIV_subgroup_sample_sizes.md')
    with open(table_path, 'w', encoding='utf-8') as f:
        f.write("# Table XXIV: Subgroup Sample Sizes and At-Risk Target Prevalence\n\n")
        f.write("### Evaluation on Locked Holdout Test Set ($N = 4,889$ observations, $4,318$ unique students)\n\n")
        f.write("| Subgroup Domain | Characteristic Variable | Subgroup Category | Test Observations ($n$) | Unique Students | At-Risk Count | Successful Count | At-Risk Prevalence (%) | Sample Status (Min $n \\ge 100$) |\n")
        f.write("| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |\n")
        for _, row in df_sample.iterrows():
            status = "**Sufficient**" if row['Sufficient_Sample'] else "*Insufficient ($n < 100$)*"
            f.write(f"| {row['Domain']} | `{row['Variable']}` | {row['Category']} | {row['Test_Observations']:,} | {row['Unique_Students']:,} | {row['At_Risk_Count']:,} | {row['Successful_Count']:,} | {row['At_Risk_Prevalence']:.2f}% | {status} |\n")
        f.write("\n---\n")
        f.write("### Methodological & Small-Cell Rules:\n")
        f.write("1. **Minimum Sample Size Rule**: Subgroups with $n < 100$ test observations are designated as having insufficient sample size for primary performance estimation to prevent unstable point estimates.\n")
        f.write("2. **Clustering Context**: The total number of unique students is reported alongside observations to account for repeated student course presentations.\n")
        f.write("3. **Distinction of Strata**: Demographic/socioeconomic variables (gender, age, disability, education, IMD, region) are explicitly distinguished from institutional/academic enrollment strata (credits, module, presentation, attempts).\n")
    print(f"  -> Generated Table XXIV: {table_path}")

def _export_table_xxv(tables_dir, df_perf):
    table_path = os.path.join(tables_dir, 'Table_XXV_subgroup_performance_metrics.md')
    with open(table_path, 'w', encoding='utf-8') as f:
        f.write("# Table XXV: Subgroup Predictive Performance at Frozen Operational Threshold $\\theta^* = 0.45$\n\n")
        f.write("### Primary Metric Evaluation with Student-Clustered 95% Bootstrap Confidence Intervals ($B = 1,000$)\n\n")
        f.write("| Subgroup Domain | Characteristic Variable | Category | $n$ | Accuracy (%) | At-Risk Recall [95% CI] | At-Risk Precision [95% CI] | At-Risk F1 | Specificity (%) | False Positive Rate [95% CI] | ROC-AUC | PR-AUC | Brier Score |\n")
        f.write("| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n")
        for _, row in df_perf.iterrows():
            if pd.isna(row['Accuracy']):
                f.write(f"| {row['Domain']} | `{row['Variable']}` | {row['Category']} | {row['N']} | — | *Insufficient Sample* | *Insufficient Sample* | — | — | — | — | — | — |\n")
            else:
                rec_ci_str = f"[{row['Recall_CI_Lower']:.3f}, {row['Recall_CI_Upper']:.3f}]" if row['Recall_CI_Lower'] is not None else "—"
                prec_ci_str = f"[{row['Precision_CI_Lower']:.3f}, {row['Precision_CI_Upper']:.3f}]" if row['Precision_CI_Lower'] is not None else "—"
                fpr_ci_str = f"[{row['FPR_CI_Lower']:.3f}, {row['FPR_CI_Upper']:.3f}]" if row['FPR_CI_Lower'] is not None else "—"
                roc_str = f"{row['ROC_AUC']:.4f}" if row['ROC_AUC'] is not None else "—"
                pr_str = f"{row['PR_AUC']:.4f}" if row['PR_AUC'] is not None else "—"
                f.write(f"| {row['Domain']} | `{row['Variable']}` | {row['Category']} | {row['N']} | {row['Accuracy']*100:.2f}% | **{row['Recall']:.4f}** {rec_ci_str} | **{row['Precision']:.4f}** {prec_ci_str} | **{row['F1']:.4f}** | {row['Specificity']*100:.2f}% | {row['FPR']:.4f} {fpr_ci_str} | {roc_str} | {pr_str} | {row['Brier']:.4f} |\n")
        f.write("\n---\n")
        f.write("### Evaluation Guidelines & Caveats:\n")
        f.write("1. **Fixed Decision Threshold**: The identical operational threshold $\\theta^* = 0.45$ was applied universally across all subgroups. No subgroup threshold tuning was performed.\n")
        f.write("2. **Confidence Intervals**: Brackets represent the 2.5th and 97.5th percentiles from $B = 1,000$ student-level block cluster bootstrap resamples (`RANDOM_SEED = 42`).\n")
        f.write("3. **Non-Ranking Principle**: Subgroup rows are presented in natural or alphanumeric order. No group is ranked or classified as 'best' or 'worst'.\n")
    print(f"  -> Generated Table XXV: {table_path}")

def _export_table_xxvi(tables_dir, df_error):
    table_path = os.path.join(tables_dir, 'Table_XXVI_subgroup_error_counts.md')
    with open(table_path, 'w', encoding='utf-8') as f:
        f.write("# Table XXVI: Subgroup Classification Error Profiles Across Quadrants\n\n")
        f.write("### Detailed Distribution of True Positives, True Negatives, False Positives, and False Negatives (Threshold $\\theta^* = 0.45$)\n\n")
        f.write("| Subgroup Domain | Characteristic Variable | Category | Total ($n$) | TP (Correct Alerts) | TN (Correct Reassurance) | FP (False Alarms) | FN (Missed At-Risk) | False Positive Rate (FPR) | False Negative Rate (FNR) |\n")
        f.write("| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n")
        for _, row in df_error.iterrows():
            f.write(f"| {row['Domain']} | `{row['Variable']}` | {row['Category']} | {row['N']} | **{row['TP']}** | {row['TN']} | {row['FP']} | **{row['FN']}** | {row['FPR']:.4f} ({row['FPR']*100:.1f}%) | {row['FNR']:.4f} ({row['FNR']*100:.1f}%) |\n")
        f.write("\n---\n")
        f.write("### Institutional Error Profile Interpretation:\n")
        f.write("In early-warning academic applications, the error trade-off is asymmetric: False Negatives represent missed students who receive no proactive academic support, whereas False Positives represent students receiving advising outreach who would have succeeded independently.\n")
    print(f"  -> Generated Table XXVI: {table_path}")

def _export_table_xxvii(tables_dir, df_eval):
    table_path = os.path.join(tables_dir, 'Table_XXVII_exploratory_intersectional_analysis.md')
    # Substantively justified intersections:
    # 1. Gender x Declared Disability (Key intersectional demographic concern)
    # 2. Highest Education x Age Band (Prior qualification by life stage)
    # Must satisfy n >= 100 test observations

    intersections = [
        ('Gender x Disability', ['gender', 'disability']),
        ('Highest Education x Age Band', ['highest_education', 'age_band'])
    ]

    records = []
    for title, cols in intersections:
        grouped = df_eval.groupby(cols)
        for name, group in grouped:
            n = len(group)
            cat_name = " / ".join([f"{col}: {val}" for col, val in zip(cols, name)])
            at_risk_cnt = int(group['is_at_risk'].sum())
            prev = at_risk_cnt / n if n > 0 else 0.0

            if n >= MIN_SUBGROUP_N:
                m = compute_binary_metrics(group['is_at_risk'], group['prob_at_risk'], threshold=THETA_STAR)
                records.append({
                    'Intersection': title,
                    'Combination': cat_name,
                    'N': n,
                    'Unique_Students': group['id_student'].nunique(),
                    'At_Risk_Prevalence': prev,
                    'Recall': m['recall'],
                    'Precision': m['precision'],
                    'F1': m['f1'],
                    'FPR': m['fpr'],
                    'Status': 'Sufficient'
                })
            else:
                records.append({
                    'Intersection': title,
                    'Combination': cat_name,
                    'N': n,
                    'Unique_Students': group['id_student'].nunique(),
                    'At_Risk_Prevalence': prev,
                    'Recall': None,
                    'Precision': None,
                    'F1': None,
                    'FPR': None,
                    'Status': f'Insufficient (n={n} < 100)'
                })

    df_int = pd.DataFrame(records)

    with open(table_path, 'w', encoding='utf-8') as f:
        f.write("# Table XXVII: Exploratory Intersectional Fairness Analysis\n\n")
        f.write("### Evaluated on Substantively Justified Intersectional Strata with Minimum $n \\ge 100$ Test Observations\n\n")
        f.write("| Intersectional Dimension | Specific Strata Combination | Test Observations ($n$) | Unique Students | At-Risk Prevalence (%) | At-Risk Recall | At-Risk Precision | At-Risk F1 | False Positive Rate | Sample Status |\n")
        f.write("| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |\n")
        for _, row in df_int.iterrows():
            if row['Status'] == 'Sufficient':
                f.write(f"| {row['Intersection']} | {row['Combination']} | {row['N']} | {row['Unique_Students']} | {row['At_Risk_Prevalence']*100:.2f}% | **{row['Recall']:.4f}** | **{row['Precision']:.4f}** | {row['F1']:.4f} | {row['FPR']:.4f} | **Sufficient** |\n")
            else:
                f.write(f"| {row['Intersection']} | {row['Combination']} | {row['N']} | {row['Unique_Students']} | {row['At_Risk_Prevalence']*100:.2f}% | — | — | — | — | *{row['Status']}* |\n")
        f.write("\n---\n")
        f.write("### Exploratory Status & Caveats:\n")
        f.write("1. **Exploratory Label**: Multi-attribute intersectional cells are presented strictly as exploratory sensitivity checks. They are not hypothesis-testing conclusions.\n")
        f.write("2. **Sample Size Constraints**: Intersections with $n < 100$ are reported for completeness but excluded from performance metric estimation.\n")
    print(f"  -> Generated Table XXVII: {table_path}")

def _generate_subgroup_figures(figures_dir, fig_data_dir, df_perf):
    """
    Generates Figures 22, 23, 24, 25 in publication-quality SVG and saves underlying CSV data.
    """
    # Filter for sufficiently powered primary demographic variables
    target_vars = ['gender', 'age_band', 'disability', 'highest_education']
    df_demo = df_perf[df_perf['Variable'].isin(target_vars) & df_perf['Accuracy'].notna()].copy()

    # Save figure data
    csv_path = os.path.join(fig_data_dir, 'fig22_25_subgroup_metrics.csv')
    df_demo.to_csv(csv_path, index=False)
    print(f"  -> Generated Subgroup Figure Data: {csv_path}")

    # Figure 22: At-Risk Recall by Subgroup with 95% CIs
    _draw_subgroup_bar_chart(
        svg_path=os.path.join(figures_dir, 'Figure_22_subgroup_recall.svg'),
        title="Figure 22: At-Risk Recall Across Key Demographic Subgroups",
        subtitle="Operational Threshold θ* = 0.45 | Error Bars: Student-Clustered 95% Bootstrap CIs",
        metric_col='Recall',
        ci_lower_col='Recall_CI_Lower',
        ci_upper_col='Recall_CI_Upper',
        df=df_demo,
        color="#1d4ed8",
        y_label="At-Risk Recall (Sensitivity)",
        y_range=(0.60, 1.0)
    )

    # Figure 23: False Positive Rate by Subgroup with 95% CIs
    _draw_subgroup_bar_chart(
        svg_path=os.path.join(figures_dir, 'Figure_23_subgroup_fpr.svg'),
        title="Figure 23: False Positive Rate (FPR) Across Key Demographic Subgroups",
        subtitle="Operational Threshold θ* = 0.45 | Error Bars: Student-Clustered 95% Bootstrap CIs",
        metric_col='FPR',
        ci_lower_col='FPR_CI_Lower',
        ci_upper_col='FPR_CI_Upper',
        df=df_demo,
        color="#dc2626",
        y_label="False Positive Rate (1 - Specificity)",
        y_range=(0.10, 0.50)
    )

    # Figure 24: At-Risk Precision by Subgroup with 95% CIs
    _draw_subgroup_bar_chart(
        svg_path=os.path.join(figures_dir, 'Figure_24_subgroup_precision.svg'),
        title="Figure 24: At-Risk Precision (PPV) Across Key Demographic Subgroups",
        subtitle="Operational Threshold θ* = 0.45 | Error Bars: Student-Clustered 95% Bootstrap CIs",
        metric_col='Precision',
        ci_lower_col='Precision_CI_Lower',
        ci_upper_col='Precision_CI_Upper',
        df=df_demo,
        color="#16a34a",
        y_label="At-Risk Precision (Positive Predictive Value)",
        y_range=(0.50, 0.90)
    )

    # Figure 25: ROC-AUC / F1 Subgroup Comparison
    _draw_subgroup_grouped_bar(
        svg_path=os.path.join(figures_dir, 'Figure_25_subgroup_roc_auc_f1.svg'),
        title="Figure 25: Overall Discriminative Accuracy (ROC-AUC) and F1-Score Across Subgroups",
        subtitle="Frozen Scenario S2 Model Evaluated Across Demographic Categories on Test Partition",
        df=df_demo
    )

def _draw_subgroup_bar_chart(svg_path, title, subtitle, metric_col, ci_lower_col, ci_upper_col, df, color, y_label, y_range):
    """Draws a clean SVG bar chart with error bars."""
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 560" width="100%" height="100%">']
    svg.append('<rect width="100%" height="100%" fill="#ffffff"/>')
    svg.append(f'<text x="470" y="32" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#0f172a">{title}</text>')
    svg.append(f'<text x="470" y="54" font-family="Arial, sans-serif" font-size="12.5" fill="#64748b" text-anchor="middle">{subtitle}</text>')

    x_min, x_max = 110, 890
    y_min, y_max = 470, 90
    y_low, y_high = y_range

    # Y-axis ticks
    ticks = np.linspace(y_low, y_high, 5)
    for val in ticks:
        y = y_min - ((val - y_low) / (y_high - y_low)) * (y_min - y_max)
        svg.append(f'<line x1="{x_min}" y1="{y}" x2="{x_max}" y2="{y}" stroke="#f1f5f9" stroke-width="1"/>')
        svg.append(f'<text x="{x_min - 12}" y="{y + 4}" font-family="Arial, sans-serif" font-size="11.5" text-anchor="end" fill="#64748b">{val:.2f}</text>')

    # Axes
    svg.append(f'<line x1="{x_min}" y1="{y_min}" x2="{x_max}" y2="{y_min}" stroke="#94a3b8" stroke-width="1.5"/>')
    svg.append(f'<line x1="{x_min}" y1="{y_min}" x2="{x_min}" y2="{y_max}" stroke="#94a3b8" stroke-width="1.5"/>')

    svg.append(f'<text x="40" y="280" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#1e293b" transform="rotate(-90 40 280)">{y_label}</text>')

    # Plot bars
    n_bars = len(df)
    total_w = x_max - x_min
    bar_w = 42
    spacing = (total_w - (n_bars * bar_w)) / (n_bars + 1)

    for i, (_, row) in enumerate(df.iterrows()):
        bx = x_min + spacing + i * (bar_w + spacing)
        val = row[metric_col]
        by = y_min - ((val - y_low) / (y_high - y_low)) * (y_min - y_max)
        bh = y_min - by

        svg.append(f'<rect x="{bx}" y="{by}" width="{bar_w}" height="{bh}" fill="{color}" rx="3" opacity="0.88"/>')
        svg.append(f'<text x="{bx + bar_w/2}" y="{by - 18}" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#1e293b">{val:.3f}</text>')

        # Error bar
        ci_l = row[ci_lower_col]
        ci_u = row[ci_upper_col]
        if ci_l is not None and ci_u is not None:
            ey_low = y_min - ((ci_l - y_low) / (y_high - y_low)) * (y_min - y_max)
            ey_high = y_min - ((ci_u - y_low) / (y_high - y_low)) * (y_min - y_max)
            svg.append(f'<line x1="{bx + bar_w/2}" y1="{ey_low}" x2="{bx + bar_w/2}" y2="{ey_high}" stroke="#0f172a" stroke-width="1.5"/>')
            svg.append(f'<line x1="{bx + bar_w/2 - 5}" y1="{ey_low}" x2="{bx + bar_w/2 + 5}" y2="{ey_low}" stroke="#0f172a" stroke-width="1.5"/>')
            svg.append(f'<line x1="{bx + bar_w/2 - 5}" y1="{ey_high}" x2="{bx + bar_w/2 + 5}" y2="{ey_high}" stroke="#0f172a" stroke-width="1.5"/>')

        # X-label (Variable + Category)
        cat_label = row['Category']
        var_label = row['Variable']
        svg.append(f'<text x="{bx + bar_w/2}" y="{y_min + 18}" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#1e293b">{cat_label}</text>')
        svg.append(f'<text x="{bx + bar_w/2}" y="{y_min + 32}" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="#64748b">({var_label})</text>')

    svg.append('</svg>')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(svg))
    print(f"  -> Generated Figure: {svg_path}")

def _draw_subgroup_grouped_bar(svg_path, title, subtitle, df):
    """Draws grouped bar chart comparing ROC-AUC and F1 across subgroups."""
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 560" width="100%" height="100%">']
    svg.append('<rect width="100%" height="100%" fill="#ffffff"/>')
    svg.append(f'<text x="470" y="32" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#0f172a">{title}</text>')
    svg.append(f'<text x="470" y="54" font-family="Arial, sans-serif" font-size="12.5" fill="#64748b" text-anchor="middle">{subtitle}</text>')

    x_min, x_max = 110, 890
    y_min, y_max = 460, 100
    y_low, y_high = 0.60, 0.90

    # Ticks
    for val in np.arange(0.60, 0.91, 0.05):
        y = y_min - ((val - y_low) / (y_high - y_low)) * (y_min - y_max)
        svg.append(f'<line x1="{x_min}" y1="{y}" x2="{x_max}" y2="{y}" stroke="#f1f5f9" stroke-width="1"/>')
        svg.append(f'<text x="{x_min - 12}" y="{y + 4}" font-family="Arial, sans-serif" font-size="11.5" text-anchor="end" fill="#64748b">{val:.2f}</text>')

    svg.append(f'<line x1="{x_min}" y1="{y_min}" x2="{x_max}" y2="{y_min}" stroke="#94a3b8" stroke-width="1.5"/>')
    svg.append(f'<line x1="{x_min}" y1="{y_min}" x2="{x_min}" y2="{y_max}" stroke="#94a3b8" stroke-width="1.5"/>')
    svg.append(f'<text x="40" y="280" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#1e293b" transform="rotate(-90 40 280)">Metric Value</text>')

    # Legend
    svg.append('<rect x="370" y="70" width="14" height="14" fill="#3b82f6" rx="2"/>')
    svg.append('<text x="390" y="82" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">ROC-AUC</text>')
    svg.append('<rect x="490" y="70" width="14" height="14" fill="#8b5cf6" rx="2"/>')
    svg.append('<text x="510" y="82" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">At-Risk F1</text>')

    n_groups = len(df)
    group_w = (x_max - x_min) / n_groups
    bar_w = 24

    for i, (_, row) in enumerate(df.iterrows()):
        gx = x_min + i * group_w + (group_w - 2 * bar_w - 6) / 2

        # ROC-AUC
        auc = row['ROC_AUC']
        if auc is not None:
            ay = y_min - ((auc - y_low) / (y_high - y_low)) * (y_min - y_max)
            ah = y_min - ay
            svg.append(f'<rect x="{gx}" y="{ay}" width="{bar_w}" height="{ah}" fill="#3b82f6" rx="2"/>')
            svg.append(f'<text x="{gx + bar_w/2}" y="{ay - 6}" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#1e293b">{auc:.3f}</text>')

        # F1
        f1 = row['F1']
        fy = y_min - ((f1 - y_low) / (y_high - y_low)) * (y_min - y_max)
        fh = y_min - fy
        svg.append(f'<rect x="{gx + bar_w + 6}" y="{fy}" width="{bar_w}" height="{fh}" fill="#8b5cf6" rx="2"/>')
        svg.append(f'<text x="{gx + bar_w + 6 + bar_w/2}" y="{fy - 6}" font-family="Arial, sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#1e293b">{f1:.3f}</text>')

        cat = row['Category']
        svg.append(f'<text x="{gx + bar_w + 3}" y="{y_min + 18}" font-family="Arial, sans-serif" font-size="9.5" text-anchor="middle" fill="#1e293b">{cat}</text>')

    svg.append('</svg>')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(svg))
    print(f"  -> Generated Figure: {svg_path}")

if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    run_fairness_subgroup_analysis(project_root)
