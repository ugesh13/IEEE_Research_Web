"""
Root alias for oulad_student_prediction/src/sensitivity_day30_active.py
"""
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(REPO_ROOT, 'oulad_student_prediction', 'src')
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from sensitivity_day30_active import run_day30_active_sensitivity

if __name__ == '__main__':
    run_day30_active_sensitivity(REPO_ROOT)

