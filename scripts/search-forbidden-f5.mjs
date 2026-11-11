import fs from 'fs';
import path from 'path';

const patterns = [/fatigue/i, /administrative reality/i, /single-split/i, /log-odds/i];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      searchDir(full);
    } else {
      const content = fs.readFileSync(full, 'utf8');
      patterns.forEach(p => {
        if (p.test(content)) {
          console.log(`Pattern ${p} matched in ${full}`);
          const lines = content.split('\n');
          lines.forEach((l, i) => {
            if (p.test(l)) console.log(`  L${i+1}: ${l.trim()}`);
          });
        }
      });
    }
  }
}

searchDir('website/src');

