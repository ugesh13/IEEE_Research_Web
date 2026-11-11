import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const repoRoot = path.resolve(__dirname, '..', '..');
const docsOut = path.resolve(repoRoot, 'docs', 'lighthouse.json');
const PORT = 4173;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  const ext = path.extname(filePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

function runCommand(cmd) {
  return new Promise((resolve) => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const env = { ...process.env, CHROME_PATH: chromePath };
    exec(cmd, { env, maxBuffer: 20 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) resolve({ err, stdout, stderr });
      else resolve({ stdout, stderr });
    });
  });
}

server.listen(PORT, async () => {
  console.log(`[server] Running on http://127.0.0.1:${PORT}`);
  
  const chromeFlags = '--headless=new --no-sandbox --disable-gpu';

  console.log('[lighthouse] Running audit to docs/lighthouse.json...');
  const cmd = `npx lighthouse http://127.0.0.1:${PORT} --output=json --output-path="${docsOut}" --only-categories=performance,accessibility,best-practices,seo --chrome-flags="${chromeFlags}" --quiet`;
  const res = await runCommand(cmd);
  if (res.err) {
    console.error('[lighthouse error]:', res.stderr || res.err);
  }

  if (fs.existsSync(docsOut)) {
    const report = JSON.parse(fs.readFileSync(docsOut, 'utf8'));
    const categories = report.categories;
    console.log(`\n=== LIGHTHOUSE SCORES ===`);
    for (const [key, cat] of Object.entries(categories)) {
      const score = Math.round(cat.score * 100);
      console.log(`- ${cat.title}: ${score}/100`);
    }
  } else {
    console.error('[error] docs/lighthouse.json was not generated.');
  }

  server.close();
  process.exit(0);
});
