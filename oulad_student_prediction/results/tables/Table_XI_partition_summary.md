# Table XI: Student-Grouped Experimental Partition Summary

| Partition | Unique Students (%) | Observations (%) | At-Risk (1) (%) | Successful (0) (%) | Distinction (%) | Pass (%) | Fail (%) | Withdrawn (%) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Train (70%)** | 20,149 (69.99%) | 22,815 (70.00%) | 12,045 (52.79%) | 10,770 (47.21%) | 2,117 (9.28%) | 8,653 (37.93%) | 4,936 (21.63%) | 7,109 (31.16%) |
| **Validation (15%)** | 4,318 (15.00%) | 4,889 (15.00%) | 2,581 (52.79%) | 2,308 (47.21%) | 453 (9.27%) | 1,854 (37.92%) | 1,058 (21.64%) | 1,524 (31.17%) |
| **Test (15% Holdout)** | 4,318 (15.00%) | 4,889 (15.00%) | 2,582 (52.81%) | 2,307 (47.19%) | 454 (9.29%) | 1,854 (37.92%) | 1,058 (21.64%) | 1,523 (31.15%) |
| **Total Cohort** | **28,785 (100.0%)** | **32,593 (100.0%)** | **17,208 (52.80%)** | **15,385 (47.20%)** | **3,024 (9.28%)** | **12,361 (37.93%)** | **7,052 (21.64%)** | **10,156 (31.16%)** |

---

### Programmatic Group Leakage Verification
$$\text{Train Students} \cap \text{Validation Students} = \emptyset \quad (\text{Count} = 0)$$
$$\text{Train Students} \cap \text{Test Students} = \emptyset \quad (\text{Count} = 0)$$
$$\text{Validation Students} \cap \text{Test Students} = \emptyset \quad (\text{Count} = 0)$$

* **Verification Status**: **PASSED (0 student overlap)**.
* **Partition Mapping Applied**: Identically mapped to $S_0$, $S_1$, and $S_2$.
* **Random Seed**: `RANDOM_SEED = 42`.
