# Student Performance Prediction Using Machine Learning and Explainable AI
## An Experimental Study Using the Open University Learning Analytics Dataset (OULAD)

### Project Overview
This repository contains the complete experimental code, data processing pipelines, evaluation metrics, statistical tests, SHAP explainability analyses, and paper draft for the research study on predicting student outcomes in higher education using OULAD.

### Directory Structure
```
Student_Performance_Prediction_Using_ML_and_XAI/    
├── data/
│   ├── raw/                  <- Immutable original OULAD CSV files
│   └── processed/            <- Cleaned, integrated, and feature-engineered datasets
├── notebooks/                <- Jupyter notebooks for interactive analysis & verification
├── src/                      <- Modular production Python code
├── results/
│   ├── figures/              <- Publication-quality graphs and plots (300 DPI)
│   ├── tables/               <- Experimental summary tables (Markdown / LaTeX / CSV)
│   └── metrics/              <- Serialized raw evaluation metrics & validation runs
├── paper/                    <- Final IEEE-style manuscript and references
├── research_log.md           <- Methodological decision log
├── requirements.txt          <- Python environment dependencies
└── README.md
```

### Reproducibility Policy
- **Zero Fabrication**: All results, tables, figures, p-values, metrics, and SHAP analyses are computed from actual experimental runs on the OULAD data.
- **Leakage Prevention**: Strictly enforced temporal cutoffs across S0 (baseline demographics/registration), S1 (early academic), and S2 (early VLE engagement).
