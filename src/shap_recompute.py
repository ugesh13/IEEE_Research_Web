"""
Root alias for oulad_student_prediction/src/shap_recompute.py
"""
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(REPO_ROOT, 'oulad_student_prediction', 'src')
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from shap_recompute import run_shap_recompute

if __name__ == '__main__':
    run_shap_recompute(REPO_ROOT)

