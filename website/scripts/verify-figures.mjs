import fs from 'fs';
import path from 'path';

// Locate files
let figuresPath = path.resolve('website/src/components/PaperFigures.tsx');
if (!fs.existsSync(figuresPath)) {
  figuresPath = path.resolve('src/components/PaperFigures.tsx');
}

let msPath = path.resolve('paper/Student_performance_perdiction_IEEE_Final.md');
if (!fs.existsSync(msPath)) {
  msPath = path.resolve('../paper/Student_performance_perdiction_IEEE_Final.md');
}

const figContent = fs.readFileSync(figuresPath, 'utf8');
const msContent = fs.readFileSync(msPath, 'utf8');

function norm(s) {
  return s
    .toLowerCase()
    .replace(/[#*_\\]/g, '')
    .replace(/[\s\-\u2010-\u2015\u2212]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/[\*\u2217]/g, '');
}

const normMs = norm(msContent);

const requiredFigures = [
  {
    name: 'Figure4Sigmoid',
    caption: 'Fig. 4. Sigmoid link of Eq. (3). A student is flagged At-Risk when σ(z) ≥ θ; the operational threshold θ = 0.45 corresponds to the logit z ≈ −0.201.'
  },
  {
    name: 'Figure5HoldoutMetrics',
    caption: 'Fig. 5. Holdout metrics computed from the confusion matrix with Eqs. (4)–(10). Green: recall (the primary target); red: error rates.'
  },
  {
    name: 'Figure6F1Tradeoff',
    caption: 'Fig. 6. F1 of Eq. (7) as a function of recall for fixed precision values. The red point is the holdout operating point (recall 0.8238, F1 = 0.7834), which lies on the dashed curve for precision 0.7468.'
  },
  {
    name: 'Figure7BrierLoss',
    caption: 'Fig. 7. Per-observation Brier loss of Eq. (11). The penalty grows quadratically with the distance between the predicted probability and the true class; the holdout mean is BS = 0.1638.'
  },
  {
    name: 'Figure8FeasibleRegion',
    caption: 'Fig. 8. Feasible region of the threshold rule in Eq. (12): recall ≥ 0.82 and precision ≥ 0.70 (shaded). The selected operating point θ* = 0.45 lies inside it on the holdout set.'
  }
];

console.log('[AUDIT] Verifying Figure Components and Verbatim Captions...');

for (const fig of requiredFigures) {
  // 1. Assert component exists in PaperFigures.tsx
  if (!figContent.includes(`export const ${fig.name}`)) {
    console.error(`FAIL: Component ${fig.name} missing in PaperFigures.tsx`);
    process.exit(1);
  }

  // 2. Assert caption exists in component
  const normCap = norm(fig.caption);
  if (!norm(figContent).includes(normCap)) {
    console.error(`FAIL: Caption for ${fig.name} does not match expected caption in PaperFigures.tsx:`);
    console.error(`  Expected: ${fig.caption}`);
    process.exit(1);
  }

  // 3. Assert caption matches manuscript
  if (!normMs.includes(normCap)) {
    console.error(`FAIL: Caption for ${fig.name} is not a substring of the manuscript:`);
    console.error(`  Caption: ${fig.caption}`);
    process.exit(1);
  }

  console.log(`  [PASS] ${fig.name}: component exists and caption matches manuscript.`);
}

console.log('[PASS] All 5 figures verified against manuscript captions.');
process.exit(0);
