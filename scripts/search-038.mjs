import fs from 'fs';
import path from 'path';

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      searchDir(full);
    } else {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('0.38')) {
        console.log('Found 0.38 in:', full);
        const lines = content.split('\n');
        lines.forEach((l, i) => {
          if (l.includes('0.38')) console.log(`  L${i+1}: ${l.trim()}`);
        });
      }
    }
  }
}

searchDir('website/src');

