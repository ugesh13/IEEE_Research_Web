import fs from 'fs';

const content = fs.readFileSync('paper/Student_performance_perdiction_IEEE_Final.md', 'utf8');

export function norm(s) {
  return s
    .toLowerCase()
    .replace(/[\s\-\u2010-\u2015\u2212]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

const normMs = norm(content);

export function checkString(label, str) {
  const n = norm(str);
  if (!normMs.includes(n)) {
    console.error(`FAIL: ${label}`);
    console.error(`Original: ${str}`);
    console.error(`Normalized: ${n}`);
    return false;
  }
  return true;
}

