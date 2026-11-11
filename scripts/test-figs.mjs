import fs from 'fs';
const content = fs.readFileSync('paper/Student_performance_perdiction_IEEE_Final.md', 'utf8');

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

const normMs = norm(content);

const fig8 = 'Fig. 8. Feasible region of the threshold rule in Eq. (12): recall >= 0.82 and precision >= 0.70 (shaded). The selected operating point θ* = 0.45 lies inside it on the holdout set.';

console.log('Fig 8:', normMs.includes(norm(fig8)));
