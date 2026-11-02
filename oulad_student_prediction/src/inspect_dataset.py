"""
OULAD Dataset Inspection and Profiling Script (Phase 1: Dataset Understanding)

This script analyzes all 7 raw OULAD CSV files:
1. studentInfo.csv
2. studentAssessment.csv
3. studentRegistration.csv
4. studentVle.csv
5. assessments.csv
6. courses.csv
7. vle.csv

It calculates:
- File size on disk
- Row and column counts
- Column names and data types
- Missing values (counts and percentages)
- Duplicate rows
- Unique identifiers / candidate keys
- Referential integrity and foreign key relationships
- Potential data-quality anomalies
"""

import os
import sys
import json
import pandas as pd
import numpy as np

EXPECTED_FILES = [
    'courses.csv',
    'assessments.csv',
    'vle.csv',
    'studentInfo.csv',
    'studentRegistration.csv',
    'studentAssessment.csv',
    'studentVle.csv'
]

def format_bytes(size):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.2f} {unit}"
        size /= 1024.0
    return f"{size:.2f} TB"

def inspect_dataset(data_dir, output_dir=None):
    print("=" * 80)
    print("PHASE 1: OULAD DATASET COMPREHENSIVE INSPECTION REPORT")
    print(f"Directory: {data_dir}")
    print("=" * 80)
    
    if not os.path.exists(data_dir):
        print(f"Error: Directory '{data_dir}' does not exist.")
        return None

    found_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    print(f"\n1. FILES DETECTED ({len(found_files)} CSV files):")
    for f in found_files:
        status = " [EXPECTED OULAD TABLE]" if f in EXPECTED_FILES else " [UNKNOWN/ADDITIONAL]"
        print(f"   - {f}{status}")
    
    missing = [f for f in EXPECTED_FILES if f not in found_files]
    if missing:
        print(f"\n   WARNING: Missing expected OULAD files: {missing}")

    report = {}
    dfs = {}

    print("\n" + "=" * 80)
    print("2-8. DETAILED TABLE PROFILES")
    print("=" * 80)

    for fname in EXPECTED_FILES:
        fpath = os.path.join(data_dir, fname)
        if not os.path.exists(fpath):
            continue
        
        file_size = os.path.getsize(fpath)
        print(f"\n>>> Table: {fname}")
        print(f"    File Size: {format_bytes(file_size)} ({file_size:,} bytes)")
        
        # Load CSV (handle large files like studentVle efficiently if needed)
        try:
            df = pd.read_csv(fpath)
            dfs[fname] = df
        except Exception as e:
            print(f"    Error reading {fname}: {e}")
            continue

        n_rows, n_cols = df.shape
        duplicates = df.duplicated().sum()
        
        table_info = {
            'file_name': fname,
            'file_size_bytes': file_size,
            'file_size_formatted': format_bytes(file_size),
            'n_rows': n_rows,
            'n_cols': n_cols,
            'duplicates': int(duplicates),
            'columns': {}
        }

        print(f"    Dimensions: {n_rows:,} rows x {n_cols} columns")
        print(f"    Duplicate Records: {duplicates:,} ({duplicates / n_rows * 100:.2f}%)")
        print("    Columns & Data Types:")

        for col in df.columns:
            dtype = str(df[col].dtype)
            n_missing = int(df[col].isnull().sum())
            pct_missing = (n_missing / n_rows) * 100
            n_unique = int(df[col].nunique(dropna=True))
            sample_vals = df[col].dropna().unique()[:3].tolist()
            
            table_info['columns'][col] = {
                'dtype': dtype,
                'n_missing': n_missing,
                'pct_missing': round(pct_missing, 3),
                'n_unique': n_unique,
                'sample_values': [str(v) for v in sample_vals]
            }

            missing_str = f"{n_missing:,} ({pct_missing:.2f}%)" if n_missing > 0 else "0 (0.0%)"
            print(f"      - {col:<26} | Type: {dtype:<8} | Missing: {missing_str:<15} | Unique: {n_unique:<8} | Sample: {sample_vals}")

        report[fname] = table_info

    # 9 & 10. RELATIONSHIPS & REFERENTIAL INTEGRITY
    print("\n" + "=" * 80)
    print("9-10. KEY IDENTIFIERS & REFERENTIAL INTEGRITY CHECKS")
    print("=" * 80)

    integrity_checks = []

    # Check studentInfo keys
    if 'studentInfo.csv' in dfs:
        si = dfs['studentInfo.csv']
        si_key_dups = si.duplicated(subset=['code_module', 'code_presentation', 'id_student']).sum()
        print(f"[*] studentInfo composite key ('code_module', 'code_presentation', 'id_student'):")
        print(f"    Duplicate student-course-presentation registrations: {si_key_dups}")
        integrity_checks.append({
            'table': 'studentInfo.csv',
            'key': ['code_module', 'code_presentation', 'id_student'],
            'duplicate_keys': int(si_key_dups),
            'is_primary_key': bool(si_key_dups == 0)
        })

    # Check studentRegistration keys
    if 'studentRegistration.csv' in dfs:
        sr = dfs['studentRegistration.csv']
        sr_key_dups = sr.duplicated(subset=['code_module', 'code_presentation', 'id_student']).sum()
        print(f"[*] studentRegistration composite key ('code_module', 'code_presentation', 'id_student'):")
        print(f"    Duplicate student registrations: {sr_key_dups}")
        integrity_checks.append({
            'table': 'studentRegistration.csv',
            'key': ['code_module', 'code_presentation', 'id_student'],
            'duplicate_keys': int(sr_key_dups),
            'is_primary_key': bool(sr_key_dups == 0)
        })

    # Check assessments keys
    if 'assessments.csv' in dfs:
        asm = dfs['assessments.csv']
        asm_dups = asm.duplicated(subset=['id_assessment']).sum()
        print(f"[*] assessments key ('id_assessment'):")
        print(f"    Duplicate assessment IDs: {asm_dups} (Unique: {asm['id_assessment'].nunique()})")

    # Check vle keys
    if 'vle.csv' in dfs:
        vle = dfs['vle.csv']
        vle_dups = vle.duplicated(subset=['id_site']).sum()
        print(f"[*] vle key ('id_site'):")
        print(f"    Duplicate site IDs: {vle_dups} (Unique: {vle['id_site'].nunique()})")

    # Referential checks: studentAssessment -> assessments
    if 'studentAssessment.csv' in dfs and 'assessments.csv' in dfs:
        sa_ids = set(dfs['studentAssessment.csv']['id_assessment'].unique())
        a_ids = set(dfs['assessments.csv']['id_assessment'].unique())
        missing_in_asm = sa_ids - a_ids
        print(f"[*] studentAssessment.id_assessment in assessments.id_assessment:")
        print(f"    Unmatched assessment IDs: {len(missing_in_asm)}")

    # Referential checks: studentVle -> vle
    if 'studentVle.csv' in dfs and 'vle.csv' in dfs:
        sv_sites = set(dfs['studentVle.csv']['id_site'].unique())
        v_sites = set(dfs['vle.csv']['id_site'].unique())
        missing_in_vle = sv_sites - v_sites
        print(f"[*] studentVle.id_site in vle.id_site:")
        print(f"    Unmatched site IDs: {len(missing_in_vle)}")

    # 11. POTENTIAL DATA QUALITY ANOMALIES
    print("\n" + "=" * 80)
    print("11. POTENTIAL DATA QUALITY ISSUES IDENTIFIED")
    print("=" * 80)
    
    anomalies = []
    
    # studentInfo final_result distribution
    if 'studentInfo.csv' in dfs:
        si = dfs['studentInfo.csv']
        res_counts = si['final_result'].value_counts(dropna=False).to_dict()
        print(f"[*] Target variable 'final_result' in studentInfo.csv:")
        for cat, count in res_counts.items():
            print(f"    - {cat:<15}: {count:,} ({count / len(si) * 100:.2f}%)")
        
        # Check IMD band missing
        imd_missing = si['imd_band'].isnull().sum()
        print(f"[*] studentInfo.imd_band missingness: {imd_missing:,} ({imd_missing / len(si) * 100:.2f}%)")
        anomalies.append(f"imd_band has {imd_missing:,} missing values ({imd_missing / len(si) * 100:.2f}%)")

    # studentRegistration date_registration negative values
    if 'studentRegistration.csv' in dfs:
        sr = dfs['studentRegistration.csv']
        neg_reg = (sr['date_registration'] < 0).sum()
        pos_reg = (sr['date_registration'] >= 0).sum()
        null_reg = sr['date_registration'].isnull().sum()
        print(f"[*] studentRegistration.date_registration:")
        print(f"    - Negative (days before course start): {neg_reg:,}")
        print(f"    - Zero or positive (after start): {pos_reg:,}")
        print(f"    - Null / missing: {null_reg:,}")

        # date_unregistration
        unreg_count = sr['date_unregistration'].notnull().sum()
        print(f"    - Students with unregistration date: {unreg_count:,} ({unreg_count / len(sr) * 100:.2f}%)")

    # studentAssessment scores missing
    if 'studentAssessment.csv' in dfs:
        sa = dfs['studentAssessment.csv']
        score_missing = sa['score'].isnull().sum()
        print(f"[*] studentAssessment.score missing values: {score_missing:,} ({score_missing / len(sa) * 100:.2f}%)")
        anomalies.append(f"studentAssessment has {score_missing:,} null scores (unscored / missing submissions)")

    # Save outputs if output_dir given
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        summary_path = os.path.join(output_dir, "dataset_profile_summary.json")
        with open(summary_path, 'w') as f:
            json.dump(report, f, indent=2)
        print(f"\n[+] Full dataset profiling saved to: {summary_path}")

    return report

if __name__ == "__main__":
    # Check default raw path or provided argument
    data_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join("data", "raw")
    out_path = sys.argv[2] if len(sys.argv) > 2 else os.path.join("..", "results", "tables")
    inspect_dataset(data_path, out_path)
