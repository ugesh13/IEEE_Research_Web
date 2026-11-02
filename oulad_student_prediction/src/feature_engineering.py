"""
Phase 6: OULAD Feature Engineering & Temporal Scenario Construction Pipeline

This module builds the three nested experimental scenario datasets:
- S0: Baseline Pre-Course (Day <= 0)
- S1: Baseline + Early Academic Assessment Performance (Day <= 30)
- S2: Baseline + Early Academic + Early VLE Engagement (Day <= 30)

Key Methodological Guarantees:
1. Every feature is independently computed using strict temporal filtering on raw tables.
2. No full-semester aggregates are used.
3. Assessment scores for non-submitting students are represented as NaN in raw feature sets,
   accompanied by an explicit binary indicator (has_early_assessment_submission_d30).
   Pipeline-level imputation is deferred to model training (Phase 10).
4. Unit of analysis strictly maintained: (code_module, code_presentation, id_student) -> 32,593 rows.
5. date_unregistration is excluded from all feature matrices.
6. Target variables:
   - Primary: is_at_risk (binary: 1=Fail/Withdrawn, 0=Pass/Distinction)
   - Secondary: final_result (multiclass: 4-class)
"""

import os
import sys
import json
import pandas as pd
import numpy as np

def build_temporal_scenarios(raw_dir, processed_dir, tables_dir):
    print("=" * 80)
    print("PHASE 6: TEMPORAL SCENARIO FEATURE ENGINEERING (S0, S1, S2)")
    print("=" * 80)

    os.makedirs(processed_dir, exist_ok=True)
    os.makedirs(tables_dir, exist_ok=True)

    # 1. Load Raw Source Tables (Read-Only)
    print("\n[Step 1] Loading raw tables for independent temporal computation...")
    courses = pd.read_csv(os.path.join(raw_dir, 'courses.csv'))
    assessments = pd.read_csv(os.path.join(raw_dir, 'assessments.csv'))
    student_info = pd.read_csv(os.path.join(raw_dir, 'studentInfo.csv'))
    student_reg = pd.read_csv(os.path.join(raw_dir, 'studentRegistration.csv'))
    student_asm = pd.read_csv(os.path.join(raw_dir, 'studentAssessment.csv'))
    student_vle = pd.read_csv(os.path.join(raw_dir, 'studentVle.csv'))

    expected_rows = 32593
    composite_key = ['code_module', 'code_presentation', 'id_student']

    # 2. Build S0: Baseline Pre-Course Feature Matrix (Day <= 0)
    print("\n[Step 2] Engineering Scenario S0 (Baseline Pre-Course)...")
    s0_df = student_info.copy()

    # Join course presentation length
    s0_df = pd.merge(s0_df, courses[['code_module', 'code_presentation', 'module_presentation_length']], 
                     on=['code_module', 'code_presentation'], how='left')

    # Join date_registration
    reg_clean = student_reg[composite_key + ['date_registration']].copy()
    reg_clean['date_registration'] = pd.to_numeric(reg_clean['date_registration'].replace('?', np.nan), errors='coerce')
    median_reg = float(reg_clean['date_registration'].median())
    reg_clean['date_registration_imputed_flag'] = reg_clean['date_registration'].isna().astype(int)
    reg_clean['date_registration'] = reg_clean['date_registration'].fillna(median_reg)

    s0_df = pd.merge(s0_df, reg_clean, on=composite_key, how='left')

    # Clean imd_band
    s0_df['imd_band'] = s0_df['imd_band'].replace({'?': 'Missing/Not Applicable', '10-20': '10-20%'})

    # Target variables
    s0_df['is_at_risk'] = s0_df['final_result'].isin(['Fail', 'Withdrawn']).astype(int)

    # Define S0 feature set
    s0_features = [
        'code_module', 'code_presentation',
        'gender', 'region', 'highest_education', 'imd_band', 'age_band', 'disability',
        'num_of_prev_attempts', 'studied_credits',
        'module_presentation_length',
        'date_registration', 'date_registration_imputed_flag'
    ]

    s0_export = s0_df[composite_key + s0_features + ['final_result', 'is_at_risk']].copy()
    print(f"  - S0 Dimensions: {s0_export.shape[0]:,} rows x {len(s0_features)} features (+ identifiers and targets)")

    # 3. Build Early Academic Features for S1 (Cutoff: Day <= 30)
    print("\n[Step 3] Engineering Early Academic Features for S1 (Cutoff: Day <= 30)...")
    # Link studentAssessment with assessment metadata
    asm_meta = assessments[['id_assessment', 'code_module', 'code_presentation', 'assessment_type', 'date', 'weight']].copy()
    asm_meta.rename(columns={'date': 'assessment_deadline'}, inplace=True)
    asm_meta['assessment_deadline'] = pd.to_numeric(asm_meta['assessment_deadline'].replace('?', np.nan), errors='coerce')

    student_asm['clean_score'] = pd.to_numeric(student_asm['score'].replace('?', np.nan), errors='coerce')
    student_asm['clean_date_submitted'] = pd.to_numeric(student_asm['date_submitted'], errors='coerce')

    merged_asm = pd.merge(student_asm, asm_meta, on='id_assessment', how='inner')
    merged_asm['submission_delay'] = merged_asm['clean_date_submitted'] - merged_asm['assessment_deadline']

    # CRITICAL TEMPORAL FILTER: Only submissions made on or before Day 30
    early_asm = merged_asm[merged_asm['clean_date_submitted'] <= 30].copy()
    # Also strictly exclude any final exams
    early_asm = early_asm[early_asm['assessment_type'] != 'Exam']

    print(f"  - Raw assessment submissions <= Day 30: {len(early_asm):,} (Excluding {len(merged_asm) - len(early_asm):,} post-Day-30 and exam records)")

    # Aggregate early assessments per student-presentation
    early_asm_agg = early_asm.groupby(composite_key).agg(
        early_assessments_submitted_d30=('clean_score', 'count'),
        early_avg_score_d30=('clean_score', 'mean'),
        early_min_score_d30=('clean_score', 'min'),
        early_max_score_d30=('clean_score', 'max'),
        early_std_score_d30=('clean_score', 'std'),
        early_avg_submission_delay_d30=('submission_delay', 'mean'),
        early_banked_count_d30=('is_banked', 'sum')
    ).reset_index()

    # Fill std with 0 for students with exactly 1 submission
    early_asm_agg['early_std_score_d30'] = early_asm_agg['early_std_score_d30'].fillna(0.0)

    # Merge early assessment aggregates with S0 base
    s1_df = pd.merge(s0_export, early_asm_agg, on=composite_key, how='left')

    # Binary submission indicator: 1 = submitted >= 1 assessment by Day 30, 0 = no submission
    s1_df['has_early_assessment_submission_d30'] = s1_df['early_assessments_submitted_d30'].notna().astype(int)
    s1_df['early_assessments_submitted_d30'] = s1_df['early_assessments_submitted_d30'].fillna(0)
    s1_df['early_banked_count_d30'] = s1_df['early_banked_count_d30'].fillna(0)

    # Methodological Decision: early_avg_score_d30, min, max remain NaN for non-submitting students
    # to preserve distinction between 0 score and unsubmitted; handled in Phase 10 pipelines.

    s1_features = s0_features + [
        'early_assessments_submitted_d30',
        'has_early_assessment_submission_d30',
        'early_avg_score_d30',
        'early_min_score_d30',
        'early_max_score_d30',
        'early_std_score_d30',
        'early_avg_submission_delay_d30',
        'early_banked_count_d30'
    ]

    s1_export = s1_df[composite_key + s1_features + ['final_result', 'is_at_risk']].copy()
    print(f"  - S1 Dimensions: {s1_export.shape[0]:,} rows x {len(s1_features)} features (+ identifiers and targets)")
    sub_count_s1 = int(s1_df['has_early_assessment_submission_d30'].sum())
    print(f"  - Students with assessment submitted by Day 30: {sub_count_s1:,} ({sub_count_s1/expected_rows*100:.2f}%)")

    # 4. Build Early VLE Features for S2 (Cutoff: Day <= 30)
    print("\n[Step 4] Engineering Early VLE Behavioral Features for S2 (Cutoff: Day <= 30)...")
    student_vle['clean_date'] = pd.to_numeric(student_vle['date'], errors='coerce')
    student_vle['clean_click'] = pd.to_numeric(student_vle['sum_click'], errors='coerce')

    # CRITICAL TEMPORAL FILTER: Only interactions logged on or before Day 30
    early_vle = student_vle[student_vle['clean_date'] <= 30].copy()
    print(f"  - Raw VLE click records <= Day 30: {len(early_vle):,} (Excluding {len(student_vle) - len(early_vle):,} post-Day-30 records)")

    # Overall early VLE aggregates
    early_vle_overall = early_vle.groupby(composite_key).agg(
        early_vle_total_clicks_d30=('clean_click', 'sum'),
        early_vle_active_days_d30=('clean_date', 'nunique'),
        early_vle_sites_visited_d30=('id_site', 'nunique')
    ).reset_index()

    early_vle_overall['early_vle_clicks_per_active_day_d30'] = (
        early_vle_overall['early_vle_total_clicks_d30'] / early_vle_overall['early_vle_active_days_d30']
    )

    # Sub-aggregations: Pre-course activity (date < 0) vs Early in-course activity (0 <= date <= 30)
    precourse_vle = early_vle[early_vle['clean_date'] < 0].groupby(composite_key)['clean_click'].sum().reset_index()
    precourse_vle.rename(columns={'clean_click': 'early_vle_precourse_clicks'}, inplace=True)

    incourse_vle = early_vle[early_vle['clean_date'] >= 0].groupby(composite_key)['clean_click'].sum().reset_index()
    incourse_vle.rename(columns={'clean_click': 'early_vle_incourse_clicks_d30'}, inplace=True)

    early_vle_agg = pd.merge(early_vle_overall, precourse_vle, on=composite_key, how='left')
    early_vle_agg = pd.merge(early_vle_agg, incourse_vle, on=composite_key, how='left')

    early_vle_agg['early_vle_precourse_clicks'] = early_vle_agg['early_vle_precourse_clicks'].fillna(0)
    early_vle_agg['early_vle_incourse_clicks_d30'] = early_vle_agg['early_vle_incourse_clicks_d30'].fillna(0)
    early_vle_agg['early_vle_precourse_ratio'] = (
        early_vle_agg['early_vle_precourse_clicks'] / (early_vle_agg['early_vle_total_clicks_d30'] + 1e-6)
    )

    # Merge early VLE with S1 to form nested S2 (S0 + S1 + Early VLE)
    s2_df = pd.merge(s1_export, early_vle_agg, on=composite_key, how='left')

    # Fill unengaged VLE students with 0
    s2_df['has_early_vle_interaction_d30'] = s2_df['early_vle_total_clicks_d30'].notna().astype(int)
    s2_df['early_vle_total_clicks_d30'] = s2_df['early_vle_total_clicks_d30'].fillna(0)
    s2_df['early_vle_active_days_d30'] = s2_df['early_vle_active_days_d30'].fillna(0)
    s2_df['early_vle_sites_visited_d30'] = s2_df['early_vle_sites_visited_d30'].fillna(0)
    s2_df['early_vle_clicks_per_active_day_d30'] = s2_df['early_vle_clicks_per_active_day_d30'].fillna(0.0)
    s2_df['early_vle_precourse_clicks'] = s2_df['early_vle_precourse_clicks'].fillna(0)
    s2_df['early_vle_incourse_clicks_d30'] = s2_df['early_vle_incourse_clicks_d30'].fillna(0)
    s2_df['early_vle_precourse_ratio'] = s2_df['early_vle_precourse_ratio'].fillna(0.0)

    s2_features = s1_features + [
        'has_early_vle_interaction_d30',
        'early_vle_total_clicks_d30',
        'early_vle_active_days_d30',
        'early_vle_sites_visited_d30',
        'early_vle_clicks_per_active_day_d30',
        'early_vle_precourse_clicks',
        'early_vle_incourse_clicks_d30',
        'early_vle_precourse_ratio'
    ]

    s2_export = s2_df[composite_key + s2_features + ['final_result', 'is_at_risk']].copy()
    print(f"  - S2 Dimensions: {s2_export.shape[0]:,} rows x {len(s2_features)} features (+ identifiers and targets)")
    vle_count_s2 = int(s2_df['has_early_vle_interaction_d30'].sum())
    print(f"  - Students with VLE activity by Day 30: {vle_count_s2:,} ({vle_count_s2/expected_rows*100:.2f}%)")

    # 5. Export Scenario Datasets
    print("\n[Step 5] Exporting Scenario Datasets to data/processed/...")
    s0_path = os.path.join(processed_dir, 'scenario_s0.csv')
    s1_path = os.path.join(processed_dir, 'scenario_s1.csv')
    s2_path = os.path.join(processed_dir, 'scenario_s2.csv')

    s0_export.to_csv(s0_path, index=False)
    s1_export.to_csv(s1_path, index=False)
    s2_export.to_csv(s2_path, index=False)

    print(f"  -> S0 saved: {s0_path}")
    print(f"  -> S1 saved: {s1_path}")
    print(f"  -> S2 saved: {s2_path}")

    # 6. Generate Scenario Documentation & Verification Artifacts
    _export_scenario_documentation(tables_dir, s0_features, s1_features, s2_features, s0_export, s1_export, s2_export)

    return s0_export, s1_export, s2_export

def _export_scenario_documentation(tables_dir, s0_f, s1_f, s2_f, s0_df, s1_df, s2_df):
    # Table VII: Scenario Definition Table
    doc_path = os.path.join(tables_dir, 'Table_VII_scenario_definitions.md')
    with open(doc_path, 'w') as f:
        f.write("# Table VII: Experimental Prediction Scenarios Definition Matrix\n\n")
        f.write("| Scenario | Prediction Cutoff | Feature Count | Baseline Features | Assessment Features | VLE Features | Excluded Future Information |\n")
        f.write("| :--- | :--- | :---: | :--- | :--- | :--- | :--- |\n")
        f.write(f"| **S0** (Baseline) | **Day <= 0** (Pre-course intake) | {len(s0_f)} | Demographics, prior attempts, credits, presentation length, registration date | None (0 features) | None (0 features) | Excludes all in-semester assessments and all post-Day-0 VLE clicks. |\n")
        f.write(f"| **S1** (Early Academic) | **Day <= 30** (End of Month 1) | {len(s1_f)} | Full S0 baseline ({len(s0_f)} features) | Submissions count, submission flag, score statistics (avg, min, max, std), delay, banked credits | None (0 features) | Excludes all assessments submitted after Day 30 and all final examinations. |\n")
        f.write(f"| **S2** (Early Behavioral) | **Day <= 30** (End of Month 1) | {len(s2_f)} | Full S0 baseline ({len(s0_f)} features) | Full S1 assessment features ({len(s1_f) - len(s0_f)} features) | Total clicks, active days, distinct resources, clicks/day, pre-course clicks, in-course clicks, pre-course ratio | Excludes all VLE interactions logged after Day 30 and all subsequent assessment submissions. |\n")

    # Table VIII: Feature Temporal & Leakage Risk Audit
    audit_path = os.path.join(tables_dir, 'Table_VIII_feature_temporal_audit.md')
    feature_meta = [
        ('code_module', 'courses.csv / studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Static institutional metadata)'),
        ('code_presentation', 'courses.csv / studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Static semester metadata)'),
        ('gender', 'studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Self-declared student background)'),
        ('region', 'studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Geographic residence at intake)'),
        ('highest_education', 'studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Prior educational attainment)'),
        ('imd_band', 'studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Area deprivation index at intake)'),
        ('age_band', 'studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Demographic age category)'),
        ('disability', 'studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Declared disability status)'),
        ('num_of_prev_attempts', 'studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Historical repetitions on module)'),
        ('studied_credits', 'studentInfo.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Credit load at registration)'),
        ('module_presentation_length', 'courses.csv', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Syllabus planned duration)'),
        ('date_registration', 'studentRegistration.csv', 'Day -322', 'Day 0', 'S0, S1, S2', 'None (Registration timing before start)'),
        ('date_registration_imputed_flag', 'Derived', 'Pre-course', 'Day 0', 'S0, S1, S2', 'None (Missingness indicator flag)'),
        ('early_assessments_submitted_d30', 'studentAssessment.csv', 'Day -11', 'Day 30', 'S1, S2', 'None (Strictly filtered <= Day 30)'),
        ('has_early_assessment_submission_d30', 'Derived', 'Day -11', 'Day 30', 'S1, S2', 'None (Binary submission flag <= Day 30)'),
        ('early_avg_score_d30', 'studentAssessment.csv', 'Day -11', 'Day 30', 'S1, S2', 'None (Scores earned on assignments <= Day 30)'),
        ('early_min_score_d30', 'studentAssessment.csv', 'Day -11', 'Day 30', 'S1, S2', 'None (Minimum score <= Day 30)'),
        ('early_max_score_d30', 'studentAssessment.csv', 'Day -11', 'Day 30', 'S1, S2', 'None (Maximum score <= Day 30)'),
        ('early_std_score_d30', 'studentAssessment.csv', 'Day -11', 'Day 30', 'S1, S2', 'None (Score standard deviation <= Day 30)'),
        ('early_avg_submission_delay_d30', 'studentAssessment.csv + assessments.csv', 'Day -11', 'Day 30', 'S1, S2', 'None (Submission delay <= Day 30)'),
        ('early_banked_count_d30', 'studentAssessment.csv', 'Day -11', 'Day 30', 'S1, S2', 'None (Credit transfers <= Day 30)'),
        ('has_early_vle_interaction_d30', 'Derived', 'Day -25', 'Day 30', 'S2', 'None (Binary engagement flag <= Day 30)'),
        ('early_vle_total_clicks_d30', 'studentVle.csv', 'Day -25', 'Day 30', 'S2', 'None (Clicks strictly filtered <= Day 30)'),
        ('early_vle_active_days_d30', 'studentVle.csv', 'Day -25', 'Day 30', 'S2', 'None (Active calendar dates <= Day 30)'),
        ('early_vle_sites_visited_d30', 'studentVle.csv', 'Day -25', 'Day 30', 'S2', 'None (Distinct resources accessed <= Day 30)'),
        ('early_vle_clicks_per_active_day_d30', 'Derived', 'Day -25', 'Day 30', 'S2', 'None (Click intensity ratio <= Day 30)'),
        ('early_vle_precourse_clicks', 'studentVle.csv', 'Day -25', 'Day -1', 'S2', 'None (Pre-course browsing before Day 0)'),
        ('early_vle_incourse_clicks_d30', 'studentVle.csv', 'Day 0', 'Day 30', 'S2', 'None (In-course clicks between Day 0 and 30)'),
        ('early_vle_precourse_ratio', 'Derived', 'Day -25', 'Day 30', 'S2', 'None (Ratio of pre-course to Month 1 clicks)')
    ]

    with open(audit_path, 'w') as f:
        f.write("# Table VIII: Granular Feature Temporal Horizon & Leakage Risk Audit\n\n")
        f.write("| Feature Name | Source Table | Earliest Possible Date | Latest Included Date | Scenario(s) | Leakage Risk Assessment |\n")
        f.write("| :--- | :--- | :--- | :--- | :---: | :--- |\n")
        for feat in feature_meta:
            f.write(f"| `{feat[0]}` | {feat[1]} | {feat[2]} | {feat[3]} | {feat[4]} | {feat[5]} |\n")

    print(f"  -> Generated Table VII: {doc_path}")
    print(f"  -> Generated Table VIII: {audit_path}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_path = os.path.join(base_dir, 'data', 'raw')
    proc_path = os.path.join(base_dir, 'data', 'processed')
    tables_path = os.path.join(base_dir, 'results', 'tables')
    build_temporal_scenarios(raw_path, proc_path, tables_path)
