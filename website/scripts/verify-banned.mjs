import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

console.log('[AUDIT] Running verify-banned checks on website/src...');

// Banned patterns
const bannedTokens = [
  'XX Month',
  'complete proofs',
  'Single Unblinding',
  'Single-use'
];

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (/\.(tsx?|jsx?|json|html|css|md)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const files = scanDir(srcDir);
let errors = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const token of bannedTokens) {
    if (content.includes(token)) {
      console.error(`[FAIL] Found banned token "${token}" in ${path.relative(rootDir, file)}`);
      errors++;
    }
  }

  // Check "pre-specified"
  if (/pre-specified/i.test(content)) {
    console.error(`[FAIL] Found "pre-specified" in ${path.relative(rootDir, file)}`);
    errors++;
  }

  // Check "verified" (except in ref [15] title or benign code)
  const verifiedMatches = content.match(/verified/gi);
  if (verifiedMatches) {
    // Check if only in reference [15] title
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/verified/i.test(line)) {
        if (!line.includes('15') && !line.includes('reproducible') && !line.includes('title')) {
          console.error(`[FAIL] Found "verified" in ${path.relative(rootDir, file)}:${i + 1}: ${line.trim()}`);
          errors++;
        }
      }
    }
  }
}

if (errors > 0) {
  console.error(`[FAIL] verify-banned failed with ${errors} violation(s).`);
  process.exit(1);
} else {
  console.log('[PASS] verify-banned passed: zero banned tokens found in website/src.');
  process.exit(0);
}
