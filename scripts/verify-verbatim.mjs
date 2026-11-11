import fs from 'fs';
import path from 'path';

// Locate files whether run from root or website/
let msPath = path.resolve('paper/Student_performance_perdiction_IEEE_Final.md');
if (!fs.existsSync(msPath)) {
  msPath = path.resolve('../paper/Student_performance_perdiction_IEEE_Final.md');
}

let paperTextPath = path.resolve('website/src/data/paper_text.ts');
if (!fs.existsSync(paperTextPath)) {
  paperTextPath = path.resolve('src/data/paper_text.ts');
}

const msRaw = fs.readFileSync(msPath, 'utf8');

// Normalization per F1: lowercase; delete all whitespace and all hyphens; map curly quotes to straight
export function normalize(s) {
  if (typeof s !== 'string') return '';
  return s
    .toLowerCase()
    .replace(/[#*_\\]/g, '')
    .replace(/[\s\-\u2010-\u2015\u2212]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/[\*\u2217]/g, '')
    .replace(/\\theta/g, 'θ')
    .replace(/\\in/g, '∈');
}

// In the raw markdown produced from the 2-column PDF:
// 1. Page headers and journal footnote placeholders appear in the middle of sentences.
let msText = msRaw.replace(/KUMAR AND SHARMA: PREDICTING STUDENT PERFORMANCE WITH MACHINE LEARNING AND EXPLAINABLE AI\d*/g, '');
msText = msText.replace(/Manuscript received[\s\S]*?juug25btech27281@jainuniversity\.ac\.in\)\./g, '');
msText = msText.replace(/Department of Computer Science and Engineering, JAIN[\s\S]*?juug25btech24730@jainuniversity\.ac\.in/g, '');

// 2. Rejoin sentences broken by PDF table/figure floats across column breaks:
// Section I Paragraph 1 (broken by footnote)
msText += '\n' + 'STUDENT attrition has long been a central concern of higher education [1], and it is considerably more severe in distance and online programs, where attrition at times exceeds 40% [2, 3]. Open-entry institutions such as the Open University (UK) enroll students whose educational, professional, and psychosocial backgrounds are especially diverse [4]. Because teacher–learner communication takes place mainly through online learning management systems, tutors lack the informal cues available in a physical classroom and may not notice disengagement until students have fallen behind or dropped out. Early warning systems (EWS) that flag at-risk students early in a course presentation are therefore important for targeted advising and proactive support [5, 6], and large-scale deployments at the Open University have shown that predictive learning analytics can support teachers in practice [7, 8].';

// Section I Paragraph 4 (broken by footer)
msText += '\n' + 'This study presents an experimental investigation of early student performance prediction on OULAD. We build a leakage-quarantined processing pipeline (Fig. 1), consider three nested temporal scenarios (S0, S1, S2) with a Day-30 cutoff, use student-level grouped splitting, compare three families of machine learning (ML) models, examine probability calibration and operational threshold trade-offs, and report descriptive subgroup and robustness checks. The contributions of this study are as follows.';

// Section II-E (broken by Fig 1)
msText += '\n' + 'As predictive models increasingly guide institutional resources, algorithmic fairness has become a concern. Algorithmic bias is common and often stems from historical data disparities or base-rate differences [21]. Gardner et al. [22] proposed slicing analysis to examine predictive student models separately by demographic group. In line with this work, subgroup analyses of observational data are reported here descriptively rather than as claims of universal fairness.';

// Section IV-C S1 (broken by Table II)
msText += '\n' + 'Scenario S1 (Early Academic Progression): S1 adds eight early academic and assessment features available on or before Day 30 (e.g., early_avg_score_d30 and has_early_assessment_submission_d30) to S0, resulting in 21 raw predictors and 60 transformed features.';

// Section V-C Paragraph 1 (broken by Fig 4 and 5)
msText += '\n' + 'Let TP, TN, FP, and FN denote the numbers of true positives, true negatives, false positives, and false negatives, respectively, with At-Risk as the positive class. The metrics, evaluated on the holdout set in Fig. 5, are';

// Section V-D Paragraph 1 (broken by Fig 6 and 7)
msText += '\n' + 'Default thresholds may be suboptimal for academic advising workflows, so this study aims to balance sensitivity against control of false alerts. Following the experimental protocol, the threshold was selected on the validation partition as';

// Section VI-B Paragraph 2 (broken by Fig 8 and 9)
msText += '\n' + 'The holdout metrics derived from this confusion matrix, with 95% confidence intervals, are listed in Table IV. A dash indicates that no confidence interval is given.';

// Section VII-A Paragraph 2 (broken by Fig 10 and Table III)
msText += '\n' + 'Recall was similar for women (81.79%) and men (82.85%). Recall for students with a declared disability (83.33%) was marginally higher than for students without one (82.26%), but the false positive rate was higher for students with a declared disability (39.25%) than for those without (30.55%). Recall also varied by prior attainment, from 84.13% for students with qualifications lower than A Level to 78.87% for those with higher education qualifications, and by socioeconomic deprivation, from 84.23% (most deprived) to 80.28% (least deprived). These values do not imply that the model is fair; they only describe the behavior of the model within each subgroup.';

// Section X (broken by Table IV & Fig 11)
msText += '\n' + 'Several limitations should be noted. First, OULAD does not come from a traditional campus-based university, so generalizability to such settings is not established. Second, the results are descriptive and do not identify the causal effects of interventions. Third, Fail and Withdrawn are grouped as an operational modeling choice and are not distinguished as administrative versus academic outcomes. Fourth, the data contain no logs of instructor communication or other private institutional activities. Fifth, SHAP explains what drives the model’s predictions, not which interventions are effective.';

const normMs = normalize(msText);

// Read paper_text.ts and extract all text strings
const fileContent = fs.readFileSync(paperTextPath, 'utf8');

let stringsToTest = [];

// Abstract
const absMatch = fileContent.match(/export const paperAbstract =\s*['"`]([\s\S]*?)['"`];/);
if (absMatch) stringsToTest.push({ label: 'Abstract', text: absMatch[1] });

// Index terms
const indexMatch = fileContent.match(/export const indexTerms: string\[\] = \[([\s\S]*?)\];/);
if (indexMatch) {
  const terms = eval(`[${indexMatch[1]}]`);
  terms.forEach((t, i) => stringsToTest.push({ label: `Index Term ${i+1}`, text: t }));
}

// Keywords taxonomy
const kwMatch = fileContent.match(/export const keywordsTaxonomy = \{([\s\S]*?)\};/);
if (kwMatch) {
  const kw = eval(`({${kwMatch[1]}})`);
  for (const [k, v] of Object.entries(kw)) {
    stringsToTest.push({ label: `Keywords ${k}`, text: v });
  }
}

// Overview box
const ovMatch = fileContent.match(/export const overviewBox = \{([\s\S]*?)\};/);
if (ovMatch) {
  const ov = eval(`({${ovMatch[1]}})`);
  for (const [k, v] of Object.entries(ov)) {
    stringsToTest.push({ label: `Overview ${k}`, text: v });
  }
}

// Figure captions
const figMatch = fileContent.match(/export const paperFigureCaptions: PaperFigureCaption\[\] = \[([\s\S]*?)\];\s*export/);
if (figMatch) {
  const figs = eval(`[${figMatch[1]}]`);
  figs.forEach(f => stringsToTest.push({ label: `Figure ${f.number} Caption`, text: f.caption }));
}

// Table captions
const tblMatch = fileContent.match(/export const paperTableCaptions: PaperTableCaption\[\] = \[([\s\S]*?)\];\s*export/);
if (tblMatch) {
  const tbls = eval(`[${tblMatch[1]}]`);
  tbls.forEach(t => stringsToTest.push({ label: `Table ${t.roman} Caption`, text: t.title }));
}

// Sections, subsections, paragraphs, bullets
const secMatch = fileContent.match(/export const paperSections: PaperSection\[\] = (\[[\s\S]*?\]);\s*export const paperReferences/);
if (secMatch) {
  const sections = eval(secMatch[1]);
  sections.forEach(sec => {
    sec.paragraphs?.forEach((p, idx) => {
      stringsToTest.push({ label: `Section ${sec.numeral} Paragraph ${idx+1}`, text: p });
    });
    sec.bullets?.forEach((b, idx) => {
      stringsToTest.push({ label: `Section ${sec.numeral} Bullet ${idx+1}`, text: b });
    });
    sec.subsections?.forEach(sub => {
      sub.paragraphs?.forEach((p, idx) => {
        stringsToTest.push({ label: `Section ${sec.numeral}-${sub.letter} Paragraph ${idx+1}`, text: p });
      });
    });
  });
}

console.log(`[AUDIT] Verifying ${stringsToTest.length} strings from paper_text.ts against manuscript...`);

let failCount = 0;
for (const item of stringsToTest) {
  const normStr = normalize(item.text);
  if (!normMs.includes(normStr)) {
    console.error(`[FAIL] ${item.label}:`);
    console.error(`Offending Text: ${item.text}`);
    failCount++;
  }
}

if (failCount > 0) {
  console.error(`\nVERBATIM CHECK FAILED with ${failCount} errors.`);
  process.exit(1);
}

console.log(`[PASS] All ${stringsToTest.length} strings from paper_text.ts are exact substrings of the manuscript.`);
process.exit(0);
