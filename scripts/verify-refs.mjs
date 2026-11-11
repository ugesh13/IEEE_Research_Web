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

const fileContent = fs.readFileSync(paperTextPath, 'utf8');
const msContent = fs.readFileSync(msPath, 'utf8');

function norm(s) {
  return s
    .toLowerCase()
    .replace(/[#*_\\]/g, '')
    .replace(/[\s\-\u2010-\u2015\u2212]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

const normMs = norm(msContent);

// Parse paperReferences
const refsMatch = fileContent.match(/export const paperReferences:\s*PaperReference\[\]\s*=\s*(\[[\s\S]*?\]);/);
if (!refsMatch) {
  console.error('FAIL: Could not locate paperReferences in paper_text.ts');
  process.exit(1);
}

const paperReferences = eval(refsMatch[1]);

console.log(`[AUDIT] Checking ${paperReferences.length} references...`);
if (paperReferences.length !== 30) {
  console.error(`FAIL: Expected exactly 30 references, found ${paperReferences.length}`);
  process.exit(1);
}

// 1. Check all entries have valid non-empty https URL, none containing "..."
for (let i = 0; i < paperReferences.length; i++) {
  const ref = paperReferences[i];
  if (ref.id !== i + 1) {
    console.error(`FAIL: Ref index ${i} has id ${ref.id}, expected ${i + 1}`);
    process.exit(1);
  }
  if (!ref.url || !ref.url.startsWith('https://')) {
    console.error(`FAIL: Ref [${ref.id}] missing valid https:// URL: "${ref.url}"`);
    process.exit(1);
  }
  if (ref.url.includes('...')) {
    console.error(`FAIL: Ref [${ref.id}] contains truncated "...": "${ref.url}"`);
    process.exit(1);
  }

  // Extract title: either within quotes "..." or “...” or book title before "2nd ed" / publisher
  let title = '';
  const quoteMatch = ref.citation.match(/[“"']([^”"']+)[”"']/);
  if (quoteMatch) {
    title = quoteMatch[1];
  } else {
    // Books like Tinto
    const bookMatch = ref.citation.match(/V\.\s*Tinto,\s*([^,]+)/);
    if (bookMatch) title = bookMatch[1];
    else title = ref.citation;
  }

  const normTitle = norm(title);
  if (!normMs.includes(normTitle)) {
    console.error(`FAIL: Ref [${ref.id}] title "${title}" not found in manuscript:`);
    console.error(`  Normalized title: ${normTitle}`);
    process.exit(1);
  }
}

// 2. Check in-text citations [n] in paper_text.ts are all between 1 and 30
const citationMatches = [...fileContent.matchAll(/\[(\d+)\]/g)];
for (const match of citationMatches) {
  const n = parseInt(match[1], 10);
  if (n < 1 || n > 30) {
    console.error(`FAIL: In-text citation [${n}] is out of range 1-30`);
    process.exit(1);
  }
}

console.log(`[PASS] All 30 references asserted: non-empty https URL, no "...", titles matching manuscript, in-text citations in [1, 30].`);
process.exit(0);
