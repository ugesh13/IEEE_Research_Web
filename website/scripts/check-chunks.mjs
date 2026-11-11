import fs from 'node:fs';
import path from 'node:path';

const assetsDir = path.resolve('dist/assets');
const files = fs.readdirSync(assetsDir);
console.log('--- JS CHUNK SIZES (dist/assets) ---');
let mainChunkSize = 0;
files.filter(f => f.endsWith('.js')).forEach(f => {
  const stat = fs.statSync(path.join(assetsDir, f));
  const sizeKb = (stat.size / 1024).toFixed(2);
  console.log(`- ${f}: ${sizeKb} KB`);
  if (f.startsWith('index-')) {
    mainChunkSize = stat.size / 1024;
  }
});
console.log('------------------------------------');
console.log(`Main JS Chunk: ${mainChunkSize.toFixed(2)} KB (Limit: < 500 KB) -> ${mainChunkSize < 500 ? 'PASS' : 'FAIL'}`);

