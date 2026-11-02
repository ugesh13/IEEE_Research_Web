"""
Phase 9: Student-Grouped Train / Validation / Test Splitting Pipeline

This module creates the unified, leakage-free student-level partition assignment:
- Development Set: 85% of unique students (split into 70% Train and 15% Validation, plus 5-fold CV)
- Test Set: 15% of unique students (strictly locked holdout)

Methodological Guarantees:
1. Partitioning occurs strictly at the unique student level (id_student).
2. A student appears in exactly ONE partition (0 overlap across train, val, test).
3. The exact same partition mapping is applied across all experimental scenarios (S0, S1, S2).
4. Full programmatic verification of zero student overlap before proceeding.
5. Saves the partition mapping to results/splits/student_partition_assignment.csv.
6. Exports Table XI partition summary.
"""

import os
import sys
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedShuffleSplit, StratifiedGroupKFold

RANDOM_SEED = 42

def create_student_grouped_partitions(processed_dir, splits_dir, tables_dir):
    print("=" * 80)
    print("PHASE 9: STUDENT-GROUPED PARTITIONING (70% TRAIN / 15% VAL / 15% TEST)")
    print(f"Random Seed: {RANDOM_SEED}")
    print("=" * 80)

    os.makedirs(splits_dir, exist_ok=True)
    os.makedirs(tables_dir, exist_ok=True)

    # 1. Load Scenarios
    s0_path = os.path.join(processed_dir, 'scenario_s0.csv')
    s1_path = os.path.join(processed_dir, 'scenario_s1.csv')
    s2_path = os.path.join(processed_dir, 'scenario_s2.csv')

    s0 = pd.read_csv(s0_path)
    s1 = pd.read_csv(s1_path)
    s2 = pd.read_csv(s2_path)

    n_total_obs = len(s0)
    assert n_total_obs == len(s1) == len(s2) == 32593, "Observation count mismatch across scenarios!"
    
    # Verify identical observation keys
    assert (s0['id_student'] == s1['id_student']).all(), "S0 and S1 id_student mismatch!"
    assert (s0['id_student'] == s2['id_student']).all(), "S0 and S2 id_student mismatch!"

    # 2. Extract Unique Students and Aggregate Target for Stratification
    print("\n[Step 1] Profiling unique students for stratified grouped partitioning...")
    # Compute student-level representative outcome (mode or max risk) for stratification
    student_summary = s0.groupby('id_student').agg(
        total_enrollments=('final_result', 'count'),
        is_at_risk_student=('is_at_risk', 'max') # 1 if student was at risk in any enrollment
    ).reset_index()

    n_unique_students = len(student_summary)
    print(f"  - Total unique students: {n_unique_students:,}")
    print(f"  - Total student-course enrollments: {n_total_obs:,}")

    # 3. Two-Stage Stratified Split on Unique Students
    # Stage 1: Split into 85% Development and 15% Test
    sss1 = StratifiedShuffleSplit(n_splits=1, test_size=0.15, random_state=RANDOM_SEED)
    dev_idx, test_idx = next(sss1.split(student_summary, student_summary['is_at_risk_student']))

    dev_students = student_summary.iloc[dev_idx].copy()
    test_students = student_summary.iloc[test_idx].copy()

    # Stage 2: Split Development into Train (70% of total -> 70/85 = 82.35% of dev) and Validation (15% of total -> 15/85 = 17.65% of dev)
    val_rel_size = 0.15 / 0.85 # approx 0.17647
    sss2 = StratifiedShuffleSplit(n_splits=1, test_size=val_rel_size, random_state=RANDOM_SEED)
    train_sub_idx, val_sub_idx = next(sss2.split(dev_students, dev_students['is_at_risk_student']))

    train_students = dev_students.iloc[train_sub_idx].copy()
    val_students = dev_students.iloc[val_sub_idx].copy()

    train_students['partition'] = 'train'
    val_students['partition'] = 'validation'
    test_students['partition'] = 'test'

    # Combine into unified student partition assignment table
    student_partitions = pd.concat([train_students, val_students, test_students], axis=0).reset_index(drop=True)
    partition_map = student_partitions[['id_student', 'partition']].copy()

    # Also compute 5-fold cross-validation fold IDs on Development data for Phase 10-12 tuning
    dev_subset = student_partitions[student_partitions['partition'].isin(['train', 'validation'])].copy()
    # 5-fold CV assignment
    skf = StratifiedShuffleSplit(n_splits=5, test_size=0.20, random_state=RANDOM_SEED)
    # Assign discrete 5-fold indicators
    dev_subset['cv_fold'] = -1
    # Use simple stratified k-fold
    from sklearn.model_selection import StratifiedKFold
    skf_k = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
    for fold_id, (_, val_fold_idx) in enumerate(skf_k.split(dev_subset, dev_subset['is_at_risk_student'])):
        dev_subset.iloc[val_fold_idx, dev_subset.columns.get_loc('cv_fold')] = fold_id

    partition_map = pd.merge(partition_map, dev_subset[['id_student', 'cv_fold']], on='id_student', how='left')
    partition_map['cv_fold'] = partition_map['cv_fold'].fillna(-1).astype(int)

    # 4. Programmatic Group Leakage Verification
    print("\n[Step 2] Executing Strict Programmatic Group-Leakage Verification...")
    train_ids = set(partition_map[partition_map['partition'] == 'train']['id_student'])
    val_ids = set(partition_map[partition_map['partition'] == 'validation']['id_student'])
    test_ids = set(partition_map[partition_map['partition'] == 'test']['id_student'])

    leak_train_val = train_ids.intersection(val_ids)
    leak_train_test = train_ids.intersection(test_ids)
    leak_val_test = val_ids.intersection(test_ids)

    print(f"  - Overlap(Train, Validation): {len(leak_train_val)} students")
    print(f"  - Overlap(Train, Test):       {len(leak_train_test)} students")
    print(f"  - Overlap(Validation, Test):  {len(leak_val_test)} students")

    assert len(leak_train_val) == 0, f"LEAKAGE DETECTED: {len(leak_train_val)} students overlap Train and Validation!"
    assert len(leak_train_test) == 0, f"LEAKAGE DETECTED: {len(leak_train_test)} students overlap Train and Test!"
    assert len(leak_val_test) == 0, f"LEAKAGE DETECTED: {len(leak_val_test)} students overlap Validation and Test!"
    print("  -> PASSED: Exact 0 student leakage across all partition boundaries.")

    # 5. Apply Partition Mapping to All Scenarios
    print("\n[Step 3] Applying identical partition mapping to S0, S1, and S2...")
    s0_merged = pd.merge(s0, partition_map, on='id_student', how='left')
    s1_merged = pd.merge(s1, partition_map, on='id_student', how='left')
    s2_merged = pd.merge(s2, partition_map, on='id_student', how='left')

    assert s0_merged['partition'].isna().sum() == 0, "Unmapped partitions in S0!"
    assert s1_merged['partition'].isna().sum() == 0, "Unmapped partitions in S1!"
    assert s2_merged['partition'].isna().sum() == 0, "Unmapped partitions in S2!"

    # Save partition mapping file
    mapping_file = os.path.join(splits_dir, 'student_partition_assignment.csv')
    partition_map.to_csv(mapping_file, index=False)
    print(f"  -> Student partition mapping saved to: {mapping_file}")

    # Also update scenario datasets with partition and cv_fold columns for easy downstream training
    s0_merged.to_csv(s0_path, index=False)
    s1_merged.to_csv(s1_path, index=False)
    s2_merged.to_csv(s2_path, index=False)
    print(f"  -> Updated scenario datasets with verified 'partition' and 'cv_fold' columns.")

    # 6. Profile Partition Distributions
    print("\n[Step 4] Profiling Partitions and Target Distributions:")
    summary_data = []
    for part in ['train', 'validation', 'test']:
        sub_df = s0_merged[s0_merged['partition'] == part]
        n_obs = len(sub_df)
        n_stud = sub_df['id_student'].nunique()
        risk_cnt = int(sub_df['is_at_risk'].sum())
        succ_cnt = n_obs - risk_cnt
        risk_pct = risk_cnt / n_obs * 100
        succ_pct = succ_cnt / n_obs * 100

        # Four class
        fc = sub_df['final_result'].value_counts()
        dist_cnt = int(fc.get('Distinction', 0))
        pass_cnt = int(fc.get('Pass', 0))
        fail_cnt = int(fc.get('Fail', 0))
        with_cnt = int(fc.get('Withdrawn', 0))

        summary_data.append({
            'partition': part.capitalize(),
            'students': n_stud,
            'students_pct': n_stud / n_unique_students * 100,
            'observations': n_obs,
            'obs_pct': n_obs / n_total_obs * 100,
            'at_risk_cnt': risk_cnt,
            'at_risk_pct': risk_pct,
            'succ_cnt': succ_cnt,
            'succ_pct': succ_pct,
            'dist_cnt': dist_cnt,
            'dist_pct': dist_cnt / n_obs * 100,
            'pass_cnt': pass_cnt,
            'pass_pct': pass_cnt / n_obs * 100,
            'fail_cnt': fail_cnt,
            'fail_pct': fail_cnt / n_obs * 100,
            'with_cnt': with_cnt,
            'with_pct': with_cnt / n_obs * 100
        })

        print(f"  - {part.capitalize()} Partition:")
        print(f"      Students: {n_stud:,} ({n_stud/n_unique_students*100:.2f}%) | Observations: {n_obs:,} ({n_obs/n_total_obs*100:.2f}%)")
        print(f"      At-Risk (1): {risk_cnt:,} ({risk_pct:.2f}%) | Successful (0): {succ_cnt:,} ({succ_pct:.2f}%)")
        print(f"      Distinction: {dist_cnt:,} ({dist_cnt/n_obs*100:.2f}%) | Pass: {pass_cnt:,} ({pass_cnt/n_obs*100:.2f}%)")
        print(f"      Fail: {fail_cnt:,} ({fail_cnt/n_obs*100:.2f}%) | Withdrawn: {with_cnt:,} ({with_cnt/n_obs*100:.2f}%)")

    # 7. Generate Table XI Partition Summary Markdown
    table_file = os.path.join(tables_dir, 'Table_XI_partition_summary.md')
    with open(table_file, 'w') as f:
        f.write("# Table XI: Student-Grouped Experimental Partition Summary\n\n")
        f.write("| Partition | Unique Students (%) | Observations (%) | At-Risk (1) (%) | Successful (0) (%) | Distinction (%) | Pass (%) | Fail (%) | Withdrawn (%) |\n")
        f.write("| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n")
        for row in summary_data:
            f.write(f"| **{row['partition']}** | {row['students']:,} ({row['students_pct']:.2f}%) | {row['observations']:,} ({row['obs_pct']:.2f}%) | {row['at_risk_cnt']:,} ({row['at_risk_pct']:.2f}%) | {row['succ_cnt']:,} ({row['succ_pct']:.2f}%) | {row['dist_cnt']:,} ({row['dist_pct']:.2f}%) | {row['pass_cnt']:,} ({row['pass_pct']:.2f}%) | {row['fail_cnt']:,} ({row['fail_pct']:.2f}%) | {row['with_cnt']:,} ({row['with_pct']:.2f}%) |\n")
        
        # Add total row
        tot_risk = s0['is_at_risk'].sum()
        tot_succ = len(s0) - tot_risk
        fc_tot = s0['final_result'].value_counts()
        f.write(f"| **Total Cohort** | **28,785 (100.0%)** | **32,593 (100.0%)** | **{tot_risk:,} (52.80%)** | **{tot_succ:,} (47.20%)** | **{fc_tot['Distinction']:,} (9.28%)** | **{fc_tot['Pass']:,} (37.93%)** | **{fc_tot['Fail']:,} (21.64%)** | **{fc_tot['Withdrawn']:,} (31.16%)** |\n")

    print(f"\n  -> Generated Table XI: {table_file}")
    return partition_map, summary_data

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    proc_path = os.path.join(base_dir, 'data', 'processed')
    splits_path = os.path.join(base_dir, 'results', 'splits')
    tables_path = os.path.join(base_dir, 'results', 'tables')
    create_student_grouped_partitions(proc_path, splits_path, tables_path)
