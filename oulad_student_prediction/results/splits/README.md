# Student-Grouped Split Specifications & Metadata

- **Random Seed**: 42
- **Methodology**: Two-stage stratified student-level split using `StratifiedShuffleSplit` on `id_student`
- **Total Unique Students**: 28,785
  - Train: 20,149 students (69.99%)
  - Validation: 4,318 students (15.00%)
  - Test: 4,318 students (15.00%)
- **Total Enrollments / Observations**: 32,593
  - Train: 22,815 observations (70.00%)
  - Validation: 4,889 observations (15.00%)
  - Test: 4,889 observations (15.00%)
- **Programmatic Zero-Leakage Checks**: Passed (0 student overlap across Train, Val, Test).
- **Cross-Scenario Consistency**: Identically applied to S0, S1, and S2 datasets.
- **Python Execution Script**: `src/data_splitting.py`
- **Interactive Verification Notebook**: `notebooks/06_train_val_test_splitting.ipynb`
