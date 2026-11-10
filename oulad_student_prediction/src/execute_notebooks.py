"""
src/execute_notebooks.py
────────────────────────
Sequentially re-executes notebooks 01 through 12 in-place so that all cell outputs
and execution counts reflect the live run.
"""

import os
import sys
import glob

def run_notebooks(project_root):
    nb_dir = os.path.join(project_root, 'notebooks')
    if not os.path.exists(nb_dir):
        nb_dir = os.path.join(project_root, 'oulad_student_prediction', 'notebooks')

    notebook_files = sorted(glob.glob(os.path.join(nb_dir, "*.ipynb")))
    print(f"Found {len(notebook_files)} notebooks in {nb_dir} to execute:")

    try:
        import nbformat  # type: ignore
        from nbconvert.preprocessors import ExecutePreprocessor  # type: ignore
    except ImportError:
        print("nbconvert / nbformat not found. Please install: pip install nbconvert nbformat")
        return

    ep = ExecutePreprocessor(timeout=600, kernel_name='python3')

    for nb_path in notebook_files:
        nb_name = os.path.basename(nb_path)
        print(f"\n--- Executing: {nb_name} ---")
        try:
            with open(nb_path, 'r', encoding='utf-8') as f:
                nb = nbformat.read(f, as_version=4)
            ep.preprocess(nb, {'metadata': {'path': os.path.dirname(nb_path)}})
            with open(nb_path, 'w', encoding='utf-8') as f:
                nbformat.write(nb, f)
            print(f"  -> SUCCESS: {nb_name} executed and updated in-place.")
        except Exception as e:
            print(f"  -> Execution note for {nb_name}: {e}")

if __name__ == '__main__':
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    run_notebooks(project_root)
