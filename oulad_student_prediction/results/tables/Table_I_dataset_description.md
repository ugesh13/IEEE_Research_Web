# Table I: OULAD Dataset Structural Overview & Profile

| Table Name | File Size | Rows | Columns | Primary / Composite Key | Foreign Keys | Missing Values (%) | Description / Role in Study |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`courses.csv`** | 526 B | 22 | 3 | (`code_module`, `code_presentation`) | None | None (0.0%) | Presentation lengths for 7 modules across 4 semesters (2013B, 2013J, 2014B, 2014J). |
| **`assessments.csv`** | 8.21 KB | 206 | 6 | `id_assessment` | (`code_module`, `code_presentation`) | `date`: 11 (5.34%) [Final exams] | Metadata on Tutor Marked Assessments (TMA), Computer Marked Assessments (CMA), and Exams. |
| **`vle.csv`** | 264.27 KB | 6,364 | 6 | `id_site` | (`code_module`, `code_presentation`) | `week_from`, `week_to`: ~85% | Inventory of VLE digital learning resources and activity types. |
| **`studentInfo.csv`** | 3.30 MB | 32,593 | 12 | (`code_module`, `code_presentation`, `id_student`) | (`code_module`, `code_presentation`) | `imd_band`: 1,111 (3.41%) | Core demographic attributes, prior attempts, studied credits, and ground-truth `final_result`. |
| **`studentRegistration.csv`** | 1.08 MB | 32,593 | 5 | (`code_module`, `code_presentation`, `id_student`) | (`code_module`, `code_presentation`, `id_student`) | `date_registration`: 45 (0.14%), `date_unregistration`: 22,521 (69.1%) | Student enrollment dates and official cancellation dates relative to course start. |
| **`studentAssessment.csv`** | 5.43 MB | 173,912 | 5 | (`id_assessment`, `id_student`) | `id_assessment`, `id_student` | `score`: 173 (0.10%) | Submission records, submission dates, banked credits, and marks (0-100). |
| **`studentVle.csv`** | 432.81 MB | 10,655,280 | 6 | (`code_module`, `code_presentation`, `id_student`, `id_site`, `date`) | (`code_module`, `code_presentation`, `id_student`), `id_site` | None (0.0%) | Granular daily clickstream interaction logs per student per VLE resource. |
