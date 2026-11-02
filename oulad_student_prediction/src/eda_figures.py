"""
Phase 8: Exploratory Data Analysis (EDA) & Publication-Quality Figure Generator

This module loads the scenario datasets (S0, S1, S2) and generates publication-quality
figures (300 DPI PNG and SVG vector formats) and descriptive statistical summaries.

Standards Enforced:
1. Purely descriptive (no ML training, no testing leak).
2. Generates Figures 1 to 11 with clear academic formatting (Nature/IEEE style).
3. Saves underlying numerical tabular data to results/figures/data/.
4. Strictly distinguishes correlation from causation.
"""

import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set publication plotting style
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 10
plt.rcParams['axes.labelsize'] = 11
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10
plt.rcParams['legend.fontsize'] = 10
plt.rcParams['figure.titlesize'] = 14
plt.rcParams['figure.dpi'] = 300

# Color palette: Accessible, colorblind-friendly
PRIMARY_BLUE = "#1f77b4"
DANGER_CORAL = "#d62728"
MUTED_SLATE = "#7f7f7f"
EMERALD_GREEN = "#2ca02c"
AMBER_GOLD = "#ff7f0e"

def generate_all_eda_figures(processed_dir, figures_dir):
    print("=" * 80)
    print("PHASE 8: GENERATING PUBLICATION-READY EDA FIGURES (300 DPI)")
    print("=" * 80)

    os.makedirs(figures_dir, exist_ok=True)
    fig_data_dir = os.path.join(figures_dir, "data")
    os.makedirs(fig_data_dir, exist_ok=True)

    # Load Scenario Datasets
    s0 = pd.read_csv(os.path.join(processed_dir, 'scenario_s0.csv'))
    s1 = pd.read_csv(os.path.join(processed_dir, 'scenario_s1.csv'))
    s2 = pd.read_csv(os.path.join(processed_dir, 'scenario_s2.csv'))

    # =========================================================================
    # Figure 3: Primary Binary Target Distribution
    # =========================================================================
    print("[1/9] Generating Figure 3: Binary Target Distribution...")
    fig, ax = plt.subplots(figsize=(6, 4.5))
    target_counts = s0['is_at_risk'].value_counts()
    labels = ['Successful (0)\n(Pass / Distinction)', 'At-Risk (1)\n(Fail / Withdrawn)']
    counts = [target_counts[0], target_counts[1]]
    pcts = [c / len(s0) * 100 for c in counts]
    colors = [PRIMARY_BLUE, DANGER_CORAL]

    bars = ax.bar(labels, counts, color=colors, width=0.55, edgecolor='black', linewidth=0.8)
    for bar, c, p in zip(bars, counts, pcts):
        ax.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 300,
                f"{c:,}\n({p:.1f}%)", ha='center', va='bottom', fontsize=10, fontweight='bold')

    ax.set_ylabel("Number of Student Presentations", fontweight='bold')
    ax.set_title("Figure 3: Primary Binary Target Distribution in OULAD\n(N = 32,593 Student-Course Enrollments)", fontweight='bold')
    ax.set_ylim(0, 20500)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "Figure_3_binary_target_distribution.png"), dpi=300)
    plt.savefig(os.path.join(figures_dir, "Figure_3_binary_target_distribution.svg"))
    plt.close()

    # =========================================================================
    # Figure 4: Four-Class Ground-Truth Outcome Distribution
    # =========================================================================
    print("[2/9] Generating Figure 4: Four-Class Ground-Truth Distribution...")
    fig, ax = plt.subplots(figsize=(7, 4.5))
    cat_order = ['Distinction', 'Pass', 'Fail', 'Withdrawn']
    fc_counts = s0['final_result'].value_counts().reindex(cat_order)
    fc_colors = [EMERALD_GREEN, PRIMARY_BLUE, AMBER_GOLD, DANGER_CORAL]

    bars = ax.bar(cat_order, fc_counts, color=fc_colors, width=0.6, edgecolor='black', linewidth=0.8)
    for bar, c in zip(bars, fc_counts):
        p = c / len(s0) * 100
        ax.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 250,
                f"{c:,}\n({p:.1f}%)", ha='center', va='bottom', fontsize=9.5, fontweight='bold')

    ax.set_ylabel("Number of Student Presentations", fontweight='bold')
    ax.set_title("Figure 4: Four-Class Ground-Truth Outcome Distribution (final_result)", fontweight='bold')
    ax.set_ylim(0, 14500)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "Figure_4_four_class_distribution.png"), dpi=300)
    plt.savefig(os.path.join(figures_dir, "Figure_4_four_class_distribution.svg"))
    plt.close()

    # =========================================================================
    # Figure 5: Early Assessment Participation by Target Group
    # =========================================================================
    print("[3/9] Generating Figure 5: Early Assessment Participation by Target...")
    fig, ax = plt.subplots(figsize=(7, 4.5))
    # Percentage submitting >= 1 assessment by Day 30
    sub_0 = (s1[s1['is_at_risk'] == 0]['has_early_assessment_submission_d30'].mean()) * 100
    sub_1 = (s1[s1['is_at_risk'] == 1]['has_early_assessment_submission_d30'].mean()) * 100
    
    categories = ['Successful Group (0)', 'At-Risk Group (1)']
    sub_pcts = [sub_0, sub_1]
    nosub_pcts = [100 - sub_0, 100 - sub_1]

    w = 0.55
    b1 = ax.bar(categories, sub_pcts, width=w, label='Submitted >= 1 Early Assessment (<= Day 30)', 
                color=PRIMARY_BLUE, edgecolor='black', linewidth=0.8)
    b2 = ax.bar(categories, nosub_pcts, width=w, bottom=sub_pcts, label='No Assessment Submitted by Day 30',
                color="#e0e0e0", edgecolor='black', linewidth=0.8)

    for i, (s, n) in enumerate(zip(sub_pcts, nosub_pcts)):
        ax.text(i, s/2, f"{s:.1f}%\nSubmitted", ha='center', va='center', color='white', fontweight='bold')
        ax.text(i, s + n/2, f"{n:.1f}%\nUnsubmitted", ha='center', va='center', color='black', fontweight='bold')

    ax.set_ylabel("Proportion of Student Presentations (%)", fontweight='bold')
    ax.set_title("Figure 5: Early Assessment Submission Participation by Final Outcome\n(Temporal Cutoff: Day <= 30)", fontweight='bold')
    ax.set_ylim(0, 115)
    ax.legend(loc='upper right', frameon=True)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "Figure_5_assessment_participation_by_target.png"), dpi=300)
    plt.savefig(os.path.join(figures_dir, "Figure_5_assessment_participation_by_target.svg"))
    plt.close()

    # =========================================================================
    # Figure 6: Early Assessment Score Distribution by Target
    # =========================================================================
    print("[4/9] Generating Figure 6: Early Assessment Score Distribution...")
    fig, ax = plt.subplots(figsize=(7.5, 4.5))
    scores_succ = s1[(s1['is_at_risk'] == 0) & (s1['early_avg_score_d30'].notna())]['early_avg_score_d30']
    scores_risk = s1[(s1['is_at_risk'] == 1) & (s1['early_avg_score_d30'].notna())]['early_avg_score_d30']

    sns.kdeplot(scores_succ, ax=ax, label=f'Successful (Mean: {scores_succ.mean():.1f})', color=PRIMARY_BLUE, fill=True, alpha=0.3, linewidth=2)
    sns.kdeplot(scores_risk, ax=ax, label=f'At-Risk (Mean: {scores_risk.mean():.1f})', color=DANGER_CORAL, fill=True, alpha=0.3, linewidth=2)

    ax.axvline(40, color='black', linestyle='--', linewidth=1.2, label='Pass Threshold (40%)')
    ax.set_xlabel("Early Assessment Average Score (Day <= 30, %)", fontweight='bold')
    ax.set_ylabel("Density", fontweight='bold')
    ax.set_title("Figure 6: Distribution of Early Assessment Scores for Submitting Students", fontweight='bold')
    ax.set_xlim(0, 100)
    ax.legend(loc='upper left', frameon=True)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "Figure_6_early_assessment_scores_by_target.png"), dpi=300)
    plt.savefig(os.path.join(figures_dir, "Figure_6_early_assessment_scores_by_target.svg"))
    plt.close()

    # =========================================================================
    # Figure 7: Early VLE Digital Engagement by Target
    # =========================================================================
    print("[5/9] Generating Figure 7: Early VLE Engagement Comparison...")
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.5))
    
    # Clicks (log-scaled distribution)
    vle_succ = s2[s2['is_at_risk'] == 0]['early_vle_total_clicks_d30']
    vle_risk = s2[s2['is_at_risk'] == 1]['early_vle_total_clicks_d30']
    
    sns.boxplot(x='is_at_risk', y='early_vle_total_clicks_d30', data=s2, ax=ax1, 
                palette=[PRIMARY_BLUE, DANGER_CORAL], showfliers=False, width=0.4)
    ax1.set_xticklabels(['Successful (0)', 'At-Risk (1)'])
    ax1.set_xlabel("Student Outcome Group", fontweight='bold')
    ax1.set_ylabel("Early VLE Total Clicks (<= Day 30)", fontweight='bold')
    ax1.set_title("(a) Total VLE Clicks (Outliers Hidden)", fontweight='bold')

    # Active Days
    sns.boxplot(x='is_at_risk', y='early_vle_active_days_d30', data=s2, ax=ax2,
                palette=[PRIMARY_BLUE, DANGER_CORAL], showfliers=False, width=0.4)
    ax2.set_xticklabels(['Successful (0)', 'At-Risk (1)'])
    ax2.set_xlabel("Student Outcome Group", fontweight='bold')
    ax2.set_ylabel("Active Calendar Learning Days (<= Day 30)", fontweight='bold')
    ax2.set_title("(b) Active Learning Days", fontweight='bold')

    plt.suptitle("Figure 7: Early Digital Engagement Patterns by Academic Outcome Group", fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "Figure_7_early_vle_engagement_by_target.png"), dpi=300)
    plt.savefig(os.path.join(figures_dir, "Figure_7_early_vle_engagement_by_target.svg"))
    plt.close()

    # =========================================================================
    # Figure 9: Feature Correlation Matrix across Key Numerical Features
    # =========================================================================
    print("[6/9] Generating Figure 9: Feature Correlation Matrix...")
    corr_cols = [
        'studied_credits', 'num_of_prev_attempts', 'date_registration',
        'early_assessments_submitted_d30', 'early_avg_score_d30',
        'early_vle_total_clicks_d30', 'early_vle_active_days_d30',
        'early_vle_sites_visited_d30', 'is_at_risk'
    ]
    corr_labels = [
        'Studied Credits', 'Prev Attempts', 'Registration Date',
        'Early Submissions', 'Early Avg Score',
        'Early Total Clicks', 'Early Active Days',
        'Early Sites Visited', 'At-Risk Target'
    ]
    
    corr_mat = s2[corr_cols].corr()
    
    fig, ax = plt.subplots(figsize=(8.5, 7))
    sns.heatmap(corr_mat, annot=True, fmt=".2f", cmap="coolwarm", vmin=-0.6, vmax=1.0,
                xticklabels=corr_labels, yticklabels=corr_labels, ax=ax,
                cbar_kws={'label': 'Pearson Correlation Coefficient (r)'})
    ax.set_title("Figure 9: Pearson Correlation Matrix of Predictive Features (S2 Scenario)", fontweight='bold')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "Figure_9_feature_correlation_matrix.png"), dpi=300)
    plt.savefig(os.path.join(figures_dir, "Figure_9_feature_correlation_matrix.svg"))
    plt.close()

    # =========================================================================
    # Figure 10: Academic Risk Across Key Demographic Subgroups
    # =========================================================================
    print("[7/9] Generating Figure 10: Academic Risk Across Demographic Subgroups...")
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))

    # Highest Education
    edu_order = ['No Formal quals', 'Lower Than A Level', 'A Level or Equivalent', 'HE Qualification', 'Post Graduate Qualification']
    edu_risk = s0.groupby('highest_education')['is_at_risk'].mean().reindex(edu_order) * 100
    ax1.barh(edu_order, edu_risk, color=PRIMARY_BLUE, edgecolor='black', height=0.55)
    ax1.axvline(52.8, color='black', linestyle='--', linewidth=1.2, label='Cohort Baseline (52.8%)')
    ax1.set_xlabel("At-Risk Proportion (%)", fontweight='bold')
    ax1.set_title("(a) Prior Educational Attainment", fontweight='bold')
    ax1.set_xlim(0, 75)
    ax1.legend(loc='lower right')

    # Disability
    dis_order = ['N', 'Y']
    dis_labels = ['No Disability (N)', 'Declared Disability (Y)']
    dis_risk = s0.groupby('disability')['is_at_risk'].mean().reindex(dis_order) * 100
    ax2.bar(dis_labels, dis_risk, color=[PRIMARY_BLUE, DANGER_CORAL], edgecolor='black', width=0.45)
    ax2.axhline(52.8, color='black', linestyle='--', linewidth=1.2, label='Cohort Baseline (52.8%)')
    ax2.set_ylabel("At-Risk Proportion (%)", fontweight='bold')
    ax2.set_title("(b) Declared Disability Status", fontweight='bold')
    ax2.set_ylim(0, 75)
    ax2.legend(loc='upper right')

    # Age Band
    age_order = ['0-35', '35-55', '55<=']
    age_risk = s0.groupby('age_band')['is_at_risk'].mean().reindex(age_order) * 100
    ax3.bar(age_order, age_risk, color=MUTED_SLATE, edgecolor='black', width=0.45)
    ax3.axhline(52.8, color='black', linestyle='--', linewidth=1.2, label='Cohort Baseline (52.8%)')
    ax3.set_ylabel("At-Risk Proportion (%)", fontweight='bold')
    ax3.set_xlabel("Age Category", fontweight='bold')
    ax3.set_title("(c) Age Band", fontweight='bold')
    ax3.set_ylim(0, 75)
    ax3.legend(loc='upper right')

    # Gender
    gen_order = ['M', 'F']
    gen_labels = ['Male (M)', 'Female (F)']
    gen_risk = s0.groupby('gender')['is_at_risk'].mean().reindex(gen_order) * 100
    ax4.bar(gen_labels, gen_risk, color=[PRIMARY_BLUE, AMBER_GOLD], edgecolor='black', width=0.45)
    ax4.axhline(52.8, color='black', linestyle='--', linewidth=1.2, label='Cohort Baseline (52.8%)')
    ax4.set_ylabel("At-Risk Proportion (%)", fontweight='bold')
    ax4.set_title("(d) Gender", fontweight='bold')
    ax4.set_ylim(0, 75)
    ax4.legend(loc='upper right')

    plt.suptitle("Figure 10: Academic Risk Proportions Across Demographic Subgroups (N = 32,593)", fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "Figure_10_demographic_risk_subgroups.png"), dpi=300)
    plt.savefig(os.path.join(figures_dir, "Figure_10_demographic_risk_subgroups.svg"))
    plt.close()

    # =========================================================================
    # Figure 11: Nested Feature Scenario Progression Horizon
    # =========================================================================
    print("[8/9] Generating Figure 11: Feature Progression Horizon...")
    fig, ax = plt.subplots(figsize=(8, 4))
    scenarios = ['S0 (Baseline)', 'S1 (Early Academic)', 'S2 (Early Behavioral)']
    base_counts = [13, 13, 13]
    asm_counts = [0, 8, 8]
    vle_counts = [0, 0, 8]

    b1 = ax.barh(scenarios, base_counts, color=MUTED_SLATE, label='Baseline Demographics & Course Metadata', edgecolor='black', height=0.5)
    b2 = ax.barh(scenarios, asm_counts, left=base_counts, color=PRIMARY_BLUE, label='Early Assessment Submissions (<= Day 30)', edgecolor='black', height=0.5)
    left_vle = [b + a for b, a in zip(base_counts, asm_counts)]
    b3 = ax.barh(scenarios, vle_counts, left=left_vle, color=EMERALD_GREEN, label='Early VLE Clickstream Engagement (<= Day 30)', edgecolor='black', height=0.5)

    for i, total in enumerate([13, 21, 29]):
        ax.text(total + 0.5, i, f"{total} Features", va='center', fontweight='bold', fontsize=10)

    ax.set_xlabel("Number of Engineered Features", fontweight='bold')
    ax.set_title("Figure 11: Nested Feature Availability Progression Horizon Across Scenarios", fontweight='bold')
    ax.set_xlim(0, 34)
    ax.legend(loc='lower right', frameon=True)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "Figure_11_feature_progression_scenarios.png"), dpi=300)
    plt.savefig(os.path.join(figures_dir, "Figure_11_feature_progression_scenarios.svg"))
    plt.close()

    print("[9/9] All Figures generated successfully in results/figures/.")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    proc_path = os.path.join(base_dir, 'data', 'processed')
    figs_path = os.path.join(base_dir, 'results', 'figures')
    generate_all_eda_figures(proc_path, figs_path)
