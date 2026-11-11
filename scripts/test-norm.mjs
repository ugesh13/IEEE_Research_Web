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

export function testSubstring(name, str) {
  const n = norm(str);
  const ok = normMs.includes(n);
  if (!ok) {
    console.error(`FAIL: ${name}`);
    console.error(`Original: ${str.slice(0, 100)}...`);
    console.error(`Normalized: ${n.slice(0, 100)}...`);
  } else {
    console.log(`PASS: ${name}`);
  }
  return ok;
}

