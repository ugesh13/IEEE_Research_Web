import os
import pandas as pd
import numpy as np
from sklearn.model_selection import GroupShuffleSplit, StratifiedShuffleSplit

def run_diagnostics():
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'cleaned_student_dataset.csv')
    if not os.path.exists(data_path):
        data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'integrated_student_dataset.csv')
    
    df = pd.read_csv(data_path)
    total_records = len(df)
    unique_students = df['id_student'].nunique()
    print(f"Loaded student data: {total_records} observations, {unique_students} unique students.")
    
    target_counts = (22815, 4889, 4889)
    print(f"Manuscript Target Observation Counts: Train={target_counts[0]}, Val={target_counts[1]}, Holdout={target_counts[2]}\n")

    # (i) GroupShuffleSplit seed 42, two-stage 70/15/15 on id_student
    print("--- (i) GroupShuffleSplit (Seed 42, Two-Stage 70/15/15 on id_student) ---")
    gss1 = GroupShuffleSplit(n_splits=1, train_size=0.70, random_state=42)
    train_idx, temp_idx = next(gss1.split(df, groups=df['id_student']))
    df_train_gss = df.iloc[train_idx]
    df_temp_gss = df.iloc[temp_idx]

    gss2 = GroupShuffleSplit(n_splits=1, test_size=0.50, random_state=42)
    val_rel_idx, test_rel_idx = next(gss2.split(df_temp_gss, groups=df_temp_gss['id_student']))
    df_val_gss = df_temp_gss.iloc[val_rel_idx]
    df_test_gss = df_temp_gss.iloc[test_rel_idx]

    obs_i = (len(df_train_gss), len(df_val_gss), len(df_test_gss))
    stud_i = (df_train_gss['id_student'].nunique(), df_val_gss['id_student'].nunique(), df_test_gss['id_student'].nunique())
    print(f"Observations: Train={obs_i[0]}, Val={obs_i[1]}, Holdout={obs_i[2]}")
    print(f"Unique Students: Train={stud_i[0]}, Val={stud_i[1]}, Holdout={stud_i[2]}")
    print(f"Equals Manuscript (22,815 / 4,889 / 4,889)? {obs_i == target_counts}\n")

    # (ii) Grouped split stratified by is_at_risk at student level
    print("--- (ii) Student-Level Stratified Group Split (Seed 42, Two-Stage 70/15/15) ---")
    student_level = df.groupby('id_student')['is_at_risk'].max().reset_index()
    sss1 = StratifiedShuffleSplit(n_splits=1, train_size=0.70, random_state=42)
    s_train_idx, s_temp_idx = next(sss1.split(student_level, student_level['is_at_risk']))
    
    train_students = set(student_level.iloc[s_train_idx]['id_student'])
    temp_students_df = student_level.iloc[s_temp_idx]
    
    sss2 = StratifiedShuffleSplit(n_splits=1, test_size=0.50, random_state=42)
    s_val_idx, s_test_idx = next(sss2.split(temp_students_df, temp_students_df['is_at_risk']))
    
    val_students = set(temp_students_df.iloc[s_val_idx]['id_student'])
    test_students = set(temp_students_df.iloc[s_test_idx]['id_student'])

    df_train_strat = df[df['id_student'].isin(train_students)]
    df_val_strat = df[df['id_student'].isin(val_students)]
    df_test_strat = df[df['id_student'].isin(test_students)]

    obs_ii = (len(df_train_strat), len(df_val_strat), len(df_test_strat))
    stud_ii = (len(train_students), len(val_students), len(test_students))
    print(f"Observations: Train={obs_ii[0]}, Val={obs_ii[1]}, Holdout={obs_ii[2]}")
    print(f"Unique Students: Train={stud_ii[0]}, Val={stud_ii[1]}, Holdout={stud_ii[2]}")
    print(f"Equals Manuscript (22,815 / 4,889 / 4,889)? {obs_ii == target_counts}\n")

    # (iii) Repo's current partition in scenario_s2.csv
    print("--- (iii) Repo Current Partition (scenario_s2.csv) ---")
    s2_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'scenario_s2.csv')
    df_s2 = pd.read_csv(s2_path)
    s2_train = df_s2[df_s2['partition'] == 'train']
    s2_val = df_s2[df_s2['partition'] == 'validation']
    s2_test = df_s2[df_s2['partition'] == 'test']

    obs_iii = (len(s2_train), len(s2_val), len(s2_test))
    stud_iii = (s2_train['id_student'].nunique(), s2_val['id_student'].nunique(), s2_test['id_student'].nunique())
    print(f"Observations: Train={obs_iii[0]}, Val={obs_iii[1]}, Holdout={obs_iii[2]}")
    print(f"Unique Students: Train={stud_iii[0]}, Val={stud_iii[1]}, Holdout={stud_iii[2]}")
    print(f"Equals Manuscript (22,815 / 4,889 / 4,889)? {obs_iii == target_counts}\n")

    print("================================================================================")
    print("SUMMARY CONCLUSION:")
    any_match = (obs_i == target_counts) or (obs_ii == target_counts) or (obs_iii == target_counts)
    if any_match:
        print("At least one strategy reproduced the exact manuscript partition counts.")
    else:
        print("NONE of the three partitioning strategies reproduced the manuscript counts (22,815 / 4,889 / 4,889).")
        print("Root cause remains NOT ESTABLISHED.")
    print("================================================================================")

if __name__ == '__main__':
    run_diagnostics()

