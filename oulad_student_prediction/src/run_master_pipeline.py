"""
src/run_master_pipeline.py
──────────────────────────
End-to-End master runner that executes all phases in exact methodological sequence:
Phase 4: Data Integration
Phase 5: Data Cleaning
Phase 6: Feature Engineering (S0, S1, S2 Day <= 30)
Phase 9: Data Splitting (Student-Grouped 70/15/15)
Phase 10: Preprocessing
Phase 11: Model Training & Hyperparameter Search
Phase 12: Threshold Optimization & Test Evaluation
Phase 13: SHAP Explainability Attribution
Phase 14: Fairness & Subgroup Analysis
Phase 15: Robustness & Sensitivity Analysis
Phase 16: Verification of All Claims

Captures all stdout/stderr to results/run_logs/pipeline_run.log
"""

import os
import sys
import time

class Logger:
    def __init__(self, log_path):
        self.terminal = sys.stdout
        self.log = open(log_path, 'w', encoding='utf-8')

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)
        self.log.flush()

    def flush(self):
        self.terminal.flush()
        self.log.flush()

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    sys.path.insert(0, script_dir)

    logs_dir = os.path.join(project_root, 'results', 'run_logs')
    os.makedirs(logs_dir, exist_ok=True)
    log_file = os.path.join(logs_dir, 'pipeline_run.log')
    sys.stdout = Logger(log_file)
    sys.stderr = sys.stdout

    start_time = time.time()
    print("=" * 80)
    print("STARTING FULL END-TO-END REPRODUCIBILITY PIPELINE EXECUTION")
    print(f"Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Project Root: {project_root}")
    print(f"Log File: {log_file}")
    print("=" * 80)

    raw_dir = os.path.join(project_root, 'data', 'raw')
    proc_dir = os.path.join(project_root, 'data', 'processed')
    splits_dir = os.path.join(project_root, 'results', 'splits')
    tables_dir = os.path.join(project_root, 'results', 'tables')

    # Step 1: Data Integration
    print("\n>>> [1/10] RUNNING DATA INTEGRATION...")
    from data_integration import run_data_integration
    run_data_integration(raw_dir, proc_dir, logs_dir)

    # Step 2: Data Cleaning
    print("\n>>> [2/11] RUNNING DATA CLEANING...")
    from data_cleaning import clean_data_pipeline
    clean_data_pipeline(raw_dir, proc_dir, tables_dir)

    # Step 3: Feature Engineering
    print("\n>>> [3/11] RUNNING FEATURE ENGINEERING (S0, S1, S2 Day <= 30)...")
    from feature_engineering import build_temporal_scenarios
    build_temporal_scenarios(raw_dir, proc_dir, tables_dir)

    # Step 4: Temporal Integrity Audit
    print("\n>>> [4/11] VERIFYING STRICT TEMPORAL INTEGRITY (Day <= 30)...")
    from verify_temporal_integrity import run_temporal_verification
    run_temporal_verification(proc_dir, tables_dir)

    # Step 5: Data Splitting
    print("\n>>> [5/11] RUNNING STUDENT-GROUPED PARTITIONING...")
    from data_splitting import create_student_grouped_partitions
    create_student_grouped_partitions(proc_dir, splits_dir, tables_dir)

    # Step 6: Model Training & CV
    print("\n>>> [6/11] RUNNING MODEL TRAINING & HYPERPARAMETER SEARCH...")
    from model_training import run_cross_validation_and_validation
    run_cross_validation_and_validation(project_root)

    # Step 7: Threshold Calibration & Test Evaluation
    print("\n>>> [7/11] RUNNING THRESHOLD CALIBRATION & TEST EVALUATION...")
    from threshold_calibration import run_phase_12_pipeline
    run_phase_12_pipeline(project_root)

    # Step 8: SHAP Explainability
    print("\n>>> [8/11] RUNNING SHAP EXPLAINABILITY ANALYSIS...")
    from shap_analysis import run_shap_analysis
    run_shap_analysis(project_root)

    # Step 9: Fairness & Subgroup Analysis
    print("\n>>> [9/11] RUNNING FAIRNESS & SUBGROUP ANALYSIS...")
    from fairness_subgroup_analysis import run_fairness_subgroup_analysis
    run_fairness_subgroup_analysis(project_root)

    # Step 10: Robustness & Sensitivity Analysis
    print("\n>>> [10/11] RUNNING ROBUSTNESS & SENSITIVITY ANALYSIS...")
    from robustness_sensitivity_analysis import run_robustness_sensitivity_analysis
    run_robustness_sensitivity_analysis(project_root)

    # Step 11: Verification of All Claims
    print("\n>>> [11/11] VERIFYING ALL CLAIMED IDENTITIES & REPRODUCIBILITY...")
    from verify_all_claims import run_verification
    run_verification(project_root)

    elapsed = time.time() - start_time
    print("\n" + "=" * 80)
    print(f"PIPELINE RUN COMPLETED SUCCESSFULLY in {elapsed:.1f} seconds ({elapsed/60:.2f} minutes).")
    print("=" * 80)

if __name__ == '__main__':
    main()
