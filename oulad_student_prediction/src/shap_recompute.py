"""
src/shap_recompute.py
─────────────────────
Empirical recomputation of SHAP feature attributions on the holdout test set
using the frozen Scenario S2 HistGradientBoostingClassifier model and 100 stratified
background samples from the training set (random_state=42).

Outputs:
- results/tables/shap_recomputed.csv
- results/tables/shap_recomputed.md
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np

def run_shap_recompute(project_root=None):
    if project_root is None:
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    models_dir = os.path.join(project_root, 'models')
    if not os.path.exists(models_dir):
        models_dir = os.path.join(project_root, 'oulad_student_prediction', 'models')

    proc_dir = os.path.join(project_root, 'data', 'processed')
    if not os.path.exists(proc_dir):
        proc_dir = os.path.join(project_root, 'oulad_student_prediction', 'data', 'processed')

    tables_dir = os.path.join(project_root, 'results', 'tables')
    if not os.path.exists(tables_dir):
        tables_dir = os.path.join(project_root, 'oulad_student_prediction', 'results', 'tables')
    os.makedirs(tables_dir, exist_ok=True)

    # 1. Load frozen model artifact
    model_path = os.path.join(models_dir, 's2_hgb_frozen_model.joblib')
    if not os.path.exists(model_path):
        print(f"[ERROR] Model artifact not found at {model_path}")
        return None

    artifact = joblib.load(model_path)
    clf = artifact['model']
    prep = artifact['preprocessor']

    # 2. Load dataset
    s2_path = os.path.join(proc_dir, 'scenario_s2.csv')
    if not os.path.exists(s2_path):
        print(f"[ERROR] Dataset not found at {s2_path}")
        return None

    df = pd.read_csv(s2_path)
    num_cols = [
        'num_of_prev_attempts', 'studied_credits', 'module_presentation_length',
        'date_registration', 'date_registration_imputed_flag',
        'early_assessments_submitted_d30', 'has_early_assessment_submission_d30',
        'early_avg_score_d30', 'early_min_score_d30', 'early_max_score_d30',
        'early_std_score_d30', 'early_avg_submission_delay_d30', 'early_banked_count_d30',
        'has_early_vle_interaction_d30', 'early_vle_total_clicks_d30',
        'early_vle_active_days_d30', 'early_vle_sites_visited_d30',
        'early_vle_clicks_per_active_day_d30', 'early_vle_precourse_clicks',
        'early_vle_incourse_clicks_d30', 'early_vle_precourse_ratio'
    ]
    cat_cols = [
        'code_module', 'code_presentation', 'gender', 'region',
        'highest_education', 'imd_band', 'age_band', 'disability'
    ]
    feature_cols = num_cols + cat_cols

    train_df = df[df['partition'] == 'train'].reset_index(drop=True)
    test_df = df[df['partition'] == 'test'].reset_index(drop=True)

    # 3. 100 Stratified background observations from training partition
    from sklearn.model_selection import StratifiedShuffleSplit
    sss = StratifiedShuffleSplit(n_splits=1, train_size=100, random_state=42)
    bg_idx, _ = next(sss.split(train_df, train_df['is_at_risk']))
    bg_df = train_df.iloc[bg_idx].reset_index(drop=True)

    X_bg_trans = prep.transform(bg_df[feature_cols])
    X_test_trans = prep.transform(test_df[feature_cols])

    # 4. Compute SHAP values with TreeExplainer
    import shap
    print(f"  -> Computing TreeExplainer SHAP values for {len(test_df)} holdout records...")
    explainer = shap.TreeExplainer(clf, data=X_bg_trans)
    shap_vals = explainer.shap_values(X_test_trans, check_additivity=False)
    mean_abs_shap = np.mean(np.abs(shap_vals), axis=0)

    # Map transformed columns back to 29 raw features
    cat_encoder = prep.named_transformers_['cat'].named_steps['onehot']
    cat_names = list(cat_encoder.get_feature_names_out(cat_cols))
    trans_names = num_cols + cat_names

    raw_map = {}
    for i, name in enumerate(trans_names):
        raw_col = None
        for c in cat_cols:
            if name.startswith(c) or name.startswith(f'cat__{c}'):
                raw_col = c
                break
        if raw_col is None:
            raw_col = name
        raw_map[raw_col] = raw_map.get(raw_col, 0.0) + mean_abs_shap[i]

    # Feature family definitions
    academic_features = [
        'early_avg_score_d30', 'has_early_assessment_submission_d30',
        'early_assessments_submitted_d30', 'early_min_score_d30',
        'early_max_score_d30', 'early_std_score_d30',
        'early_avg_submission_delay_d30', 'early_banked_count_d30'
    ]
    vle_features = [
        'early_vle_active_days_d30', 'early_vle_total_clicks_d30',
        'early_vle_sites_visited_d30', 'early_vle_clicks_per_active_day_d30',
        'early_vle_incourse_clicks_d30', 'early_vle_precourse_clicks',
        'early_vle_precourse_ratio', 'has_early_vle_interaction_d30'
    ]
    static_features = [
        'gender', 'age_band', 'disability', 'highest_education', 'imd_band',
        'region', 'num_of_prev_attempts', 'studied_credits',
        'date_registration', 'date_registration_imputed_flag',
        'code_module', 'code_presentation', 'module_presentation_length'
    ]

    academic_shap = sum(raw_map.get(f, 0.0) for f in academic_features)
    vle_shap = sum(raw_map.get(f, 0.0) for f in vle_features)
    static_shap = sum(raw_map.get(f, 0.0) for f in static_features)
    total_shap = academic_shap + vle_shap + static_shap

    academic_pct = (academic_shap / total_shap) * 100
    vle_pct = (vle_shap / total_shap) * 100
    static_pct = (static_shap / total_shap) * 100
    dynamic_pct = ((academic_shap + vle_shap) / total_shap) * 100

    # Build per-feature table
    records = []
    for raw_feat, val in raw_map.items():
        if raw_feat in academic_features:
            family = 'Academic Milestones (Day <= 30)'
        elif raw_feat in vle_features:
            family = 'VLE Digital Engagement (Day <= 30)'
        else:
            family = 'Static Intake and Context'
        records.append({
            'raw_feature': raw_feat,
            'family': family,
            'mean_abs_shap': round(float(val), 4),
            'pct_share': round(float(val / total_shap * 100), 2)
        })

    records.sort(key=lambda x: x['mean_abs_shap'], reverse=True)
    for rank, r in enumerate(records, 1):
        r['rank'] = rank

    res_df = pd.DataFrame(records)[['rank', 'raw_feature', 'family', 'mean_abs_shap', 'pct_share']]
    csv_path = os.path.join(tables_dir, 'shap_recomputed.csv')
    res_df.to_csv(csv_path, index=False)

    # Write Markdown summary with side-by-side comparison
    md_path = os.path.join(tables_dir, 'shap_recomputed.md')
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write("# Recomputed SHAP Feature Importance and Family Shares\n\n")
        f.write("### Comparison of Manuscript (Stored Constants) vs. Pipeline Recomputation\n\n")
        f.write("| Predictive Family | Features | Manuscript Stored Share (%) | Recomputed Holdout Share (%) | Recomputed Mean |SHAP| |\n")
        f.write("| :--- | :---: | :---: | :---: | :---: |\n")
        f.write(f"| **Academic Milestones (Day $\\le 30$)** | 8 | 33.22% | **{academic_pct:.2f}%** | {academic_shap:.4f} |\n")
        f.write(f"| **VLE Digital Engagement (Day $\\le 30$)** | 8 | 32.61% | **{vle_pct:.2f}%** | {vle_shap:.4f} |\n")
        f.write(f"| **Static Intake and Context** | 13 | 34.17% | **{static_pct:.2f}%** | {static_shap:.4f} |\n")
        f.write(f"| **Combined Dynamic Engagement** | 16 | 65.83% | **{dynamic_pct:.2f}%** | {academic_shap + vle_shap:.4f} |\n")
        f.write(f"| **Total Denominator** | 29 | 100.00% | **100.00%** | {total_shap:.4f} |\n\n")
        f.write("---\n\n")
        f.write("### Top 10 Recomputed Raw Features by Mean Absolute SHAP:\n\n")
        f.write("| Rank | Raw Feature | Predictive Family | Mean |SHAP| | Share (%) |\n")
        f.write("| :---: | :--- | :--- | :---: | :---: |\n")
        for r in records[:10]:
            f.write(f"| {r['rank']} | `{r['raw_feature']}` | {r['family']} | {r['mean_abs_shap']:.4f} | {r['pct_share']:.2f}% |\n")

    print(f"  -> Generated {csv_path} and {md_path}")
    return {
        'academic_pct': academic_pct,
        'vle_pct': vle_pct,
        'static_pct': static_pct,
        'dynamic_pct': dynamic_pct,
        'total_shap': total_shap,
        'csv_path': csv_path,
        'md_path': md_path
    }

if __name__ == '__main__':
    run_shap_recompute()

